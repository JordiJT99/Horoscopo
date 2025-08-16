import { NextRequest, NextResponse } from 'next/server';

// Array para almacenar las últimas llamadas a modelos
let modelCallsLog: Array<{
  timestamp: string;
  model: string;
  caller: string;
  userAgent: string;
  ip: string;
  url: string;
  headers: Record<string, string>;
}> = [];

// Función para agregar una llamada al log
export function logModelCall(model: string, caller: string, request?: NextRequest) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    model,
    caller,
    userAgent: request?.headers.get('user-agent') || 'unknown',
    ip: request?.headers.get('x-forwarded-for') || request?.headers.get('x-real-ip') || 'unknown',
    url: request?.url || 'unknown',
    headers: request ? Object.fromEntries(request.headers.entries()) : {}
  };

  modelCallsLog.push(logEntry);
  
  // Mantener solo los últimos 100 registros
  if (modelCallsLog.length > 100) {
    modelCallsLog = modelCallsLog.slice(-100);
  }
  
  console.log('🚨 LLAMADA A MODELO DETECTADA:', logEntry);
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Token Usage Debug Endpoint',
    totalCalls: modelCallsLog.length,
    recentCalls: modelCallsLog.slice(-20), // Últimas 20 llamadas
    timestamp: new Date().toISOString()
  });
}

export async function DELETE(request: NextRequest) {
  modelCallsLog = [];
  return NextResponse.json({
    message: 'Model calls log cleared',
    timestamp: new Date().toISOString()
  });
}
