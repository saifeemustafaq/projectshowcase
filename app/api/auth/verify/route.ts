import { NextRequest, NextResponse } from 'next/server';
import { verifyPasswordServer } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }
    
    const isValid = await verifyPasswordServer(password);
    
    return NextResponse.json({ success: isValid });
  } catch (error) {
    console.error('Error in auth verify:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
