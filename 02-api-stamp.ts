// TIMBRYF - API: Add Stamp
// File: /app/api/stamp/route.ts - Vercel + Supabase
// Cost: 0€ - uses free tier

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { card_id, merchant_id } = await req.json()

  // 1. Get card
  const { data: card } = await supabase
    .from('cards')
    .select('*')
    .eq('id', card_id)
    .single()

  if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 })

  // 2. Get merchant to know stamps_required
  const { data: merchant } = await supabase
    .from('merchants')
    .select('stamps_required')
    .eq('id', merchant_id)
    .single()

  const required = merchant?.stamps_required || 5
  let newStamps = card.current_stamps + 1
  let rewardUnlocked = false

  // 3. If reached reward -> reset and create reward
  if (newStamps >= required) {
    newStamps = 0
    rewardUnlocked = true
    await supabase.from('rewards').insert({ card_id, merchant_id })
  }

  // 4. Update card
  await supabase.from('cards').update({
    current_stamps: newStamps,
    total_stamps: card.total_stamps + 1,
    last_visit: new Date().toISOString()
  }).eq('id', card_id)

  // 5. Save stamp history
  await supabase.from('stamps').insert({ card_id, merchant_id })

  return NextResponse.json({ success: true, current_stamps: newStamps, rewardUnlocked, required })
}