"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabasetype"
import DateFormatter from "@/components/date"
import { useState, useEffect } from "react";

type Props = {
  chatData: Database["public"]["Tables"]["Chats"]["Row"],
  index: number,
}

export default function ChatUI({ chatData, index }: Props) {
  const supabase = createClientComponentClient();
  const [userName, setUserName] = useState("")
  const getData = async () => {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select()
      .eq("id", chatData.uid)

    if (error) {
      console.log(error);
      return
    }

    if (profile.length !== 1) {
      return
    }

    setUserName(profile[0].name)
  }

  useEffect(() => {
    getData()
  }, [])


  return (
    <div className="p-2">
      <div className="flex">
        <h2 className="font-medium text-gray-900 truncate">{userName}</h2>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500"><DateFormatter timestamp={chatData.created_at}></DateFormatter></p>
      </div>
      <p className="mt-1 text-gray-600 whitespace-pre-wrap">{chatData.message}</p>
    </div>
  )
}