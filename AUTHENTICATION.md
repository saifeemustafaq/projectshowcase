# Authentication System

This project uses a MongoDB-based authentication system for admin access. The admin password is stored as a hashed value in the database.

## Initial Setup

1. **Initialize Admin User**: Run this command to create the default admin user:
   ```bash
   npm run init-admin
   ```
   This creates an admin user with the default password `admin123`.

2. **Reset Password**: After initial setup, immediately change the password:
   ```bash
   npm run reset-password
   ```
   This will prompt you to enter a new secure password.

## Available Scripts

- `npm run init-admin` - Creates the initial admin user with default password
- `npm run reset-password` - Reset the admin password (stores hash in MongoDB)
- `npm run generate-password` - Generate SHA-256 hash for any password (utility only)

## Database Schema

The admin authentication uses a `admin` collection in MongoDB with the following structure:

```javascript
{
  _id: ObjectId,
  role: "admin",
  passwordHash: "sha256_hash_string",
  createdAt: Date,
  updatedAt: Date
}
```

## Security Notes

- Passwords are hashed using SHA-256 before storage
- Session tokens are stored in browser sessionStorage
- Sessions expire after 30 minutes of inactivity
- No passwords are stored in plain text anywhere in the system

## Environment Variables

Make sure your `.env.local` file contains:
```
MONGODB_URI=your_mongodb_connection_string
```
