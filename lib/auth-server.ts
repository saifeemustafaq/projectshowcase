import { getDatabase } from './mongodb';
import crypto from 'crypto';

/**
 * Hash a password using SHA-256 (server-side only)
 */
export async function hashPassword(password: string): Promise<string> {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Get admin user from database (server-side only)
 */
export async function getAdminUser() {
  try {
    const db = await getDatabase();
    const adminCollection = db.collection('admin');
    return await adminCollection.findOne({ role: 'admin' });
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
}

/**
 * Update admin password in database (server-side only)
 */
export async function updateAdminPassword(passwordHash: string): Promise<boolean> {
  try {
    const db = await getDatabase();
    const adminCollection = db.collection('admin');
    
    const result = await adminCollection.updateOne(
      { role: 'admin' },
      { 
        $set: { 
          passwordHash,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    return result.acknowledged;
  } catch (error) {
    console.error('Error updating admin password:', error);
    return false;
  }
}

/**
 * Verify password against the database hash (server-side only)
 */
export async function verifyPasswordServer(password: string): Promise<boolean> {
  try {
    const adminUser = await getAdminUser();
    if (!adminUser || !adminUser.passwordHash) {
      console.error('No admin user found in database');
      return false;
    }
    
    const hashedInput = await hashPassword(password);
    return hashedInput === adminUser.passwordHash;
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}
