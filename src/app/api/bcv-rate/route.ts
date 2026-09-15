import { NextResponse } from 'next/server'
import { getBcvRate } from '@/libs/bcv/rate.server'

// Talks to bcv.org.ve over `node:https`, so this must run on the Node
// runtime, and the result must never be cached at the framework/CDN layer
// on top of `getBcvRate`'s own in-memory cache.
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET() {
  const rate = await getBcvRate()

  return NextResponse.json(rate, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
