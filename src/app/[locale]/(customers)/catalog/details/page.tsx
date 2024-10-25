import { redirect } from 'next/navigation'

export const Page = () => {
  redirect('/catalog')

  return null
}
