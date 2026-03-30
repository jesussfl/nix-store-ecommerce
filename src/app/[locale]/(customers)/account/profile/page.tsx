import { redirect } from 'next/navigation'
import ProfilePage from './profile-page'
import { GET_ACTIVE_CUSTOMER } from '@/libs/queries/account'
import { vendureFetchSSR } from '@/libs/vendure/vendureFetchSSR'

export default async function Page() {
  const { data } = await vendureFetchSSR({
    query: GET_ACTIVE_CUSTOMER,
    cache: 'no-store',
  })

  if (!data?.activeCustomer) {
    redirect('/account/login?callback=/account/profile')
  }

  return <ProfilePage />
}
