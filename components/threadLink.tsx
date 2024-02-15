import Link from 'next/link'
import { Button } from "@nextui-org/react";
type Props = {
  channelName: string,
  linkName: string,
}

export default function ThreadLink({ channelName, linkName }: Props) {
  return (
    <li className='mb-4'>
      <Button href={{
        pathname: '/chats',
        query: { channel_name: channelName },
      }}
      as={Link}
      color="primary">{linkName}</Button>
    </li>
  )
}