import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return genericResponse(request);
}
export async function POST(request: Request) {
  return genericResponse(request);
}
export async function PUT(request: Request) {
  return genericResponse(request);
}
export async function PATCH(request: Request) {
  return genericResponse(request);
}
export async function DELETE(request: Request) {
  return genericResponse(request);
}
export async function HEAD(request: Request) {
  return genericResponse(request);
}
export async function OPTIONS(request: Request) {
  return genericResponse(request);
}

async function genericResponse(request: Request) {
  console.log(`Unhandled request: ${request.method} ${request.url}`);
  return NextResponse.json({ error: 'Route not found' }, { status: 404 });
}
