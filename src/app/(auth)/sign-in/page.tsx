'use client'

import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <div className="bg-black h-screen text-white">
      Not signed in <br />
      <button className="bg-blue-600 px-3 py-1 rounded m-4" onClick={() => signIn()}>Sign in</button>
    </div>
  )
}