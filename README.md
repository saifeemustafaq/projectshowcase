# Project Showcase

A beautiful, modern project gallery application with **live website previews** and secure edit mode.

## ✨ Key Features

### 🖼️ Live Website Previews
- **Real-time website previews** instead of static images
- Automatically loads demo websites in embedded iframes
- Intelligent fallback system with placeholder images
- Responsive preview scaling and interaction blocking

### 🔐 Secure Authentication
- **Password-protected edit mode** at `/projects/edit`
- SHA-256 password hashing (no plaintext storage)
- Session-based authentication with automatic expiration
- 30-minute session timeout with activity extension

### 📱 Modern UI/UX
- **Responsive design** with Tailwind CSS
- Beautiful card layouts with smooth animations
- Advanced filtering and sorting options
- Real-time search across projects, descriptions, and technologies

### 🛠️ Easy Content Management
- **Add, edit, and delete projects** in edit mode
- Form validation with helpful error messages
- Technology tags and categorization
- Featured project highlighting

## Routes

- `/` - Redirects to `/projects`
- `/projects` - Public gallery view (read-only)
- `/projects/edit` - Edit mode with password protection

## Authentication

### Default Password
**Password**: `admin123`

### Security Features
- Client-side password hashing using SHA-256
- Session-based authentication with automatic expiration (30 minutes)
- No plaintext passwords stored in code or browser
- Session token stored in sessionStorage (cleared when browser closes)

### Changing the Password
To change the password, update the `PASSWORD_HASH` constant in `/lib/auth.ts`:

1. Generate a new SHA-256 hash of your desired password
2. Replace the `PASSWORD_HASH` value with your new hash

Example using Node.js:
```javascript
const crypto = require('crypto');
const newPassword = 'your-new-password';
const hash = crypto.createHash('sha256').update(newPassword).digest('hex');
console.log(hash);
```

## Project Management

### Adding Projects
1. Access `/projects/edit`
2. Enter the password when prompted
3. Click "Add Project" button
4. Fill in the project details:
   - Title (required)
   - Description (required)
   - Image URL (required)
   - Technologies (comma-separated, required)
   - Category (required)
   - Demo URL (optional)
   - GitHub URL (optional)
   - Featured status (optional)

### Editing Projects
1. In edit mode, click the edit icon on any project card
2. Modify the project details in the modal
3. Save changes

### Deleting Projects
1. In edit mode, click the delete icon on any project card
2. Confirm deletion in the prompt

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React useState/useEffect
- **Storage**: Browser localStorage and sessionStorage
- **Authentication**: Client-side SHA-256 hashing
- **Icons**: Heroicons (inline SVG)

## File Structure

```
app/
├── projects/
│   ├── page.tsx          # Gallery view
│   └── edit/
│       └── page.tsx      # Edit mode
├── layout.tsx
├── page.tsx              # Root redirect
└── globals.css

components/
├── ProjectGallery.tsx    # Main gallery component
├── ProjectCard.tsx       # Individual project card
├── ProjectFormModal.tsx  # Add/edit project form
└── AuthModal.tsx         # Password authentication

lib/
├── auth.ts              # Authentication utilities
└── projects.ts          # Project data management

types/
└── project.ts           # TypeScript interfaces
```

## Sample Data

The application includes sample projects to demonstrate functionality:
- E-Commerce Platform (Featured)
- Task Management App (Featured)
- Weather Dashboard
- Mobile Fitness Tracker

## Browser Compatibility

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+

## Security Notes

- Passwords are hashed client-side using SHA-256
- Sessions expire after 30 minutes of inactivity
- No sensitive data is transmitted to servers
- All data is stored locally in the browser
- Session tokens are cleared when browser closes

## License

This project is open source and available under the MIT License.
