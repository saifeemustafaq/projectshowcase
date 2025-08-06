import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { verifyPasswordServer, hashPassword } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication via session token in header
    const sessionToken = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters long' }, { status: 400 });
    }

    // Verify current password
    const isCurrentPasswordValid = await verifyPasswordServer(currentPassword);
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }

    // Hash and update the new password
    const newHash = await hashPassword(newPassword);
    const db = await getDatabase();
    const adminCollection = db.collection('admin');
    
    await adminCollection.updateOne(
      { role: 'admin' },
      { 
        $set: { 
          passwordHash: newHash,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    );
  }
} 