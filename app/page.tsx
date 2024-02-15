"use client"
import ThreadLink from '@/components/threadLink'
import 'remixicon/fonts/remixicon.css'

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";




export default async function Index() {
  const supabase = createClientComponentClient();
  const { data, error } = await supabase.from('profiles').select('name');
  console.log(data);






  return (
    <div className='h-screen'>
      <div className="flex-1 w-full flex flex-col items-center">
      <h1 className="text-3xl font-bold pt-6 pb-10">チャット</h1>
      <ul>
        {data ? (
          data.map((profile, index) => (
            <ThreadLink
              key={index}
              channelName={profile.name}
              linkName={profile.name}
            ></ThreadLink>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </ul>
    </div>
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