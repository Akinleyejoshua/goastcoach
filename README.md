# Ghost Coach

AI-powered sports coaching assistant built with Next.js, MongoDB, Zustand, and Gemini Vision API.

## Features

- **Player Registration & Authentication** - JWT-based auth with user profile (sport, position, experience level)
- **Stance Upload & AI Feedback** - Upload a photo and receive structured coaching report from Gemini Vision
- **Session History** - Browse all past uploads with thumbnails, scores, and detailed feedback
- **AI Improvement Chat** - Context-aware chat about any session with memory of profile and feedback

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React, TypeScript, Tailwind CSS
- **State Management:** Zustand
- **Backend:** Next.js API Routes
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JWT (jsonwebtoken) + bcryptjs
- **AI:** Google Gemini 1.5 Flash Vision API
- **Icons:** Lucide React

## Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)
- Gemini API key (free from Google AI Studio)

## Setup

1. Clone and install dependencies:

```bash
npm install
```

2. Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required environment variables:

- `GEMINI_API_KEY` - Get from [Google AI Studio](https://aistudio.google.com/app/apikey)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Any secure random string

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## MongoDB Setup

### Local MongoDB
Make sure MongoDB is running locally on port 27017:

```bash
mongod
```

Or use Docker:

```bash
docker run -d -p 27017:27017 mongo:latest
```

### MongoDB Atlas
Create a free cluster and use the connection string:

```
mongodb+srv://<username>:<password>@cluster.mongodb.net/goastcoach
```

## Gemini API Key

1. Visit [aistudio.google.com](https://aistudio.google.com)
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy the key to your `.env.local` as `GEMINI_API_KEY`

## Project Structure

```
/app
  /api                  # API routes
    /auth
      login/route.ts   # JWT login
      register/route.ts # User registration
    upload/route.ts    # Image upload + Gemini analysis
    sessions/route.ts  # Fetch user's session history
    chat/route.ts      # AI chat about a session
  /dashboard           # Protected app pages
    layout.tsx         # Dashboard layout with navigation
    page.tsx           # Upload page
    /history           # Session history view
  (auth)               # Public auth pages
    login/page.tsx
    register/page.tsx
/components
  FeedbackCard.tsx     # Display AI feedback
  ChatButton.tsx       # Chat panel trigger
/lib
  mongodb.ts          # MongoDB connection
  models.ts           # Mongoose models (User, Session, Chat)
  auth.ts             # JWT + bcrypt helpers
  gemini.ts           # Gemini Vision API integration
/middleware.ts        # Route protection
/store
  authStore.ts        # User auth state
  appStore.ts         # Sessions state
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT |
| POST | `/api/upload` | Upload photo, get AI feedback |
| GET | `/api/sessions` | Get user's session history |
| POST | `/api/chat` | Chat with AI about a session |

## User Flow

1. Register with name, sport, position, experience level
2. Login
3. Upload a photo of your stance/technique (JPEG/PNG, max 5MB)
4. Receive AI feedback with:
   - Overall score (1-10)
   - Strengths
   - Areas to improve
   - Priority fix
   - Drill suggestion
   - Confidence level
5. View session history anytime
6. Ask follow-up questions in the chat panel

## Notes

- Images are stored as base64 data URLs (in-memory). For production, use a proper file storage (S3, Cloudinary, etc.)
- The Gemini analysis expects a `Cricket` or `Basketball` etc. in the user context; prompts are tailored to the selected sport
- JWT tokens stored in HTTP-only cookies (could also use localStorage with caution)
- Tailwind CSS is used for styling (already included)

## Future Improvements

- Proper file storage (S3, Cloudinary)
- Image thumbnail generation
- More detailed sport-specific prompts
- Video analysis
- Progress tracking charts
- Multi-language support

