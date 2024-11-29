import ProfilePage from './profile-page'
import { GET_ACTIVE_CUSTOMER } from '@/libs/queries/account'
import { redirect } from 'next/navigation'
import { vendureFetchSSR } from '@/libs/vendure/vendureFetchSSR'

export default async function Page() {
  return <ProfilePage />
}
