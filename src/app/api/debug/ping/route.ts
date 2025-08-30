import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Ping route hit');
  return NextResponse.json({ success: true, message: 'pong' });
}
