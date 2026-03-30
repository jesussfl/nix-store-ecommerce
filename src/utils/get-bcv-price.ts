export const GetBCVPrice = async () => {
  try {
    const data = await fetch(
      'https://ve.dolarapi.com/v1/dolares/oficial',
      {
        method: 'GET',
        next: { revalidate: 3600 },
      }
    ).then((res) => res.json())
    
    return data.promedio || 0
  } catch (error) {
    console.error('Error fetching BCV price:', error)
    return 0
  }
}
