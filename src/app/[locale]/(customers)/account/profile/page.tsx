import ProfilePage from './profile-page'
import { GET_ACTIVE_CUSTOMER } from '@/libs/queries/account'
import { redirect } from 'next/navigation'
import { vendureFetchSSR } from '@/libs/vendure/vendureFetchSSR'

export default async function Page() {
  const { data } = await vendureFetchSSR({ query: GET_ACTIVE_CUSTOMER })

  if (!data?.activeCustomer) {
    redirect('/account/login?callback=/account/profile')
  }

  return <ProfilePage />
}
