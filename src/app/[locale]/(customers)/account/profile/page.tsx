import { ADD_ADDITIONAL_PAYMENT_TO_ORDER } from '@/libs/queries/payment'
import { vendureFetch } from '@/libs/vendure'

export default async function ProfilePage() {
  const { data, error } = await vendureFetch({
    query: ADD_ADDITIONAL_PAYMENT_TO_ORDER,
    variables: {
      orderCode: '4YNPQRPDATFRL6ZG',
      paymentMethodCode: 'pago-movil',
      metadata: {
        reference: '123456789',
        totalPaid: 8.75,
      },
    },
  })

  console.log(data, error, 'data')
  return <div className="w-full">Hola</div>
}
