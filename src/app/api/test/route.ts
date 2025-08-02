import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Test API endpoint working',
    timestamp: new Date().toISOString(),
    url: request.url
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({
    message: 'Test POST endpoint working',
    timestamp: new Date().toISOString(),
    url: request.url
  });
}
