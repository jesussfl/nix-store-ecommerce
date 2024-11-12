export const GetBCVPrice = async () => {
  const { monitors } = await fetch(
    'https://pydolarve.org/api/v1/dollar?page=bcv',
    {
      method: 'GET',
      next: { revalidate: 3600 },
    }
  ).then((res) => res.json())
  return monitors.usd.price || 0
}
