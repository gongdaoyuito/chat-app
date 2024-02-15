"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabasetype"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import ChatUI from "@/components/chats/chat"
import 'remixicon/fonts/remixicon.css'

export default function Chats() {
  const supabase = createClientComponentClient()
  const searchParams = useSearchParams()
  let channelName = searchParams.get("channel_name")!!
  const [inputText, setInputText] = useState("")
  const [userID, setUserID] = useState("")
  const [messageText, setMessageText] = useState<Database["public"]["Tables"]["Chats"]["Row"][]>([])


  const fetchRealtimeData = () => {
    try {
      supabase
        .channel(channelName)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "Chats",
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              const { created_at, id, message, uid, channel, name } = payload.new
              setMessageText((messageText) => [...messageText, { id, created_at, message, uid, channel }])
            }
          }
        )
        .subscribe()

      return () => supabase.channel(channelName).unsubscribe()
    } catch (error) {
      console.error(error)
    }
  }

  // 初回のみ実行するために引数に空の配列を渡している
  useEffect(() => {
    (async () => {
      let allMessages = null
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user != null) {
          setUserID(user.id)
        }

        const { data } = await supabase.from("Chats").select("*").eq('channel', channelName).order("created_at")

        allMessages = data
      } catch (error) {
        console.error(error)
      }
      if (allMessages != null) {
        setMessageText(allMessages)
      }
    })()
    fetchRealtimeData()
  }, [])

  const onSubmitNewMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (inputText === "") return
    if (userID === "") {
      alert("ログインしないと投稿出来ません。")
      return
    }
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select()
        .eq("id", userID)

      if (error) {
        console.log(error);
        return
      }

      if (profile.length !== 1) {
        alert("投稿前にユーザ名を設定してください。")
      }

      await supabase.from("Chats").insert({ message: inputText, uid: userID, channel: channelName })
    } catch (error) {
      console.error(error)
      return
    }
    setInputText("")
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center p-2">
      <h1 className="text-3xl font-bold pt-5 pb-10">{channelName}</h1>
      <div className="w-full max-w-3xl mb-10">
        {messageText.map((item, index) => (
          <ChatUI chatData={item} index={index} key={item.id}></ChatUI>
        ))}
      </div>

      <form className="w-full max-w-md pb-10" onSubmit={onSubmitNewMessage}>
        <div className="mb-5 flex">
          <textarea id="message" name="message" rows={4} className="block p-2.5 w-full text-sm text-gray-900
                 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="メッセージを入力" value={inputText} onChange={(event) => setInputText(() => event.target.value)}>
          </textarea>
          <button type="submit" disabled={inputText === ""} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-25">
            送信
          </button>
        </div>
      </form>
      <div className='absolute bottom-0 w-full flex'>
      <div className='flex-1'><i class="ri-home-line ri-4x"></i></div>
      <div className='flex-1'><i class="ri-search-line ri-4x"></i></div>
      <div className='flex-1'><i class="ri-notification-line ri-4x"></i></div>
      <div className='flex-1'><i class="ri-chat-1-line ri-4x"></i></div>
      <div className='flex-1'><i class="ri-user-line ri-4x"></i></div>
      </div>
    </div>
    
  )
}