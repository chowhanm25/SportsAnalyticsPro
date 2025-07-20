import { NextRequest, NextResponse } from 'next/server';
// import { executeQuery } from '@/lib/snowflake';

export async function GET(request: NextRequest) {
  try {
        console.log('Dashboard API called successfully');
    
  } catch (error) {
    // handle error
    const errorMessage = typeof error === 'object' && error !== null && 'message' in error
      ? (error as { message: string }).message
      : String(error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}