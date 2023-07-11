import Image from "next/image"
import Link from "next/link"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div>
        <div><Link href="/"><Image src="" alt="tally logo"/></Link></div>
        <div><Link href="/play/game">game</Link></div>
        <div><Link href="/play/history">history</Link></div>
      </div>
      <div>{children}</div>
    </>
  )
}
