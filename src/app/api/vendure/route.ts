import { NextRequest, NextResponse } from 'next/server'
import { getVendureEndpoint } from '@/libs/vendure/config'

const VENDURE_ENDPOINT = getVendureEndpoint()

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

    const setCookies = vendureResponse.headers.getSetCookie?.() || []

    if (setCookies.length > 0) {
      setCookies.forEach((cookie) => {
        response.headers.append('set-cookie', cookie)
      })
    } else {
      const setCookie = vendureResponse.headers.get('set-cookie')
      if (setCookie) {
        response.headers.set('set-cookie', setCookie)
      }
    }

    return response
  } catch (error) {
    console.error('[Vendure Proxy] Error:', error)
    return NextResponse.json(
      {
        errors: [
          {
            message: `Proxy error: could not reach Vendure backend at ${VENDURE_ENDPOINT}`,
          },
        ],
      },
      { status: 502 }
    )
  }
}
