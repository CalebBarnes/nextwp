import Image from 'next/image'

export function Logo(props) {
  return (
    <div className="relative flex h-10 items-center">
      <Image
        src="/logo.png"
        alt="Protocol Logo"
        width={48}
        height={48}
        className="mr-1 h-full w-auto"
      />
      <span className="font-bold">NextWP</span>
    </div>
  )
}
