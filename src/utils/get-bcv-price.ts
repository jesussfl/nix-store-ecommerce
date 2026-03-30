export const GetBCVPrice = async () => {
  try {
    const data = await fetch(
      'https://ve.dolarapi.com/v1/euros',
      {
        method: 'GET',
        next: { revalidate: 3600 },
      }
    ).then((res) => res.json())
    
    // API returns an array; index 0 is the official (BCV) rate
    return (Array.isArray(data) ? data[0]?.promedio : data?.promedio) || 0
  } catch (error) {
    console.error('Error fetching BCV price:', error)
    return 0
  }
}
