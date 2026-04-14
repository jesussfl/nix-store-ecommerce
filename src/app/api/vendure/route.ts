import { NextRequest, NextResponse } from 'next/server'

const VENDURE_ENDPOINT =
  (process.env.NEXT_PUBLIC_VENDURE_ADMIN_DOMAIN ||
    (process.env.NODE_ENV === 'production'
      ? 'https://p01--nix-store--9c67vmxtxbrm.code.run'
      : 'http://localhost:3000')) + '/shop-api'

export async function POST(request: NextRequest) {
  try {
    const languageCode = request.nextUrl.searchParams.get('languageCode') || 'es'
    const body = await request.text()

    // Forward cookies from the browser to Vendure
    const cookieHeader = request.headers.get('cookie') || ''

    const vendureResponse = await fetch(
      `${VENDURE_ENDPOINT}?languageCode=${languageCode}`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/graphql-response+json',
          'vendure-token': languageCode,
          ...(cookieHeader ? { Cookie: cookieHeader } : {}),
        },
        body,
      }
    )

    const responseBody = await vendureResponse.text()

    // Forward Set-Cookie headers from Vendure back to the browser
    const response = new NextResponse(responseBody, {
      status: vendureResponse.status,
      headers: {
        'Content-Type':
          vendureResponse.headers.get('Content-Type') || 'application/json',
      },
    })

    const setCookie = vendureResponse.headers.get('set-cookie')
    if (setCookie) {
      response.headers.set('set-cookie', setCookie)
    }

    return response
  } catch (error) {
    console.error('[Vendure Proxy] Error:', error)
    return NextResponse.json(
      { errors: [{ message: 'Proxy error: could not reach Vendure backend' }] },
      { status: 502 }
    )
  }
}
