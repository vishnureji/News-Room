import { NextRequest, NextResponse } from 'next/server';
import { runDatabaseSeed } from '@/scripts/seed-supabase.mjs';

export async function POST() {
  try {
    const result = await runDatabaseSeed();
    return NextResponse.json({ success: true, message: 'Database seeded successfully', result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
