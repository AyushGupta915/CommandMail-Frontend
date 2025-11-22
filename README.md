# CommandMail Frontend

Modern, AI-powered email productivity agent built with React, Vite, and TailwindCSS-inspired styling.

## Features

* **Inbox Management** - View, filter, and organize emails
* **AI Processing** - Automatic categorization and action item extraction
* **Agent Chat** - Interactive AI assistant for email queries
* **Prompt Editor** - Customize AI behavior with custom prompts
* **Draft Management** - Create, edit, and improve email drafts with AI
* **Real-time Updates** - Instant feedback and processing status
* **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

* **Framework:** React 18
* **Build Tool:** Vite
* **HTTP Client:** Axios
* **Icons:** Lucide React
* **Styling:** Custom CSS with modern design patterns

## Prerequisites

* Node.js v18 or higher
* npm or yarn package manager
* Backend API running (see backend README)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/commandmail-frontend.git
cd commandmail-frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

#### For Local Development

Create `.env.local`:

```bash
touch .env.local
```

Add:

```env
VITE_API_URL=http://localhost:5000/api
```

#### For Production

Create `.env.production`:

```bash
touch .env.production
```

Add:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

**Important:** Replace `your-backend-url.onrender.com` with your actual backend URL.

## Running the Frontend

### Development Mode

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### 1. Initial Setup

When you first open the app:

1. **Click "Load Mock Inbox"** - This loads 20 sample emails into the database
2. **Click "Process All"** - AI will categorize all emails and extract action items (takes ~30 seconds)

### 2. Inbox Page

**View Emails:**

* All emails are displayed in a list
* Click any email to view details
* Email detail panel shows on the right

**Filter Emails:**

* **All** - Show all emails
* **Unprocessed** - Show emails not yet processed by AI
* **Processed** - Show emails already processed
* **Important** - Show only important emails
* **To-Do** - Show emails with action items
* **Newsletter** - Show newsletter/marketing emails
* **Spam** - Show spam emails

**Process Emails:**

* **Process All** - Process all unprocessed emails at once
* **Process Single** - Click an email, then click "Process Email with AI"

**Generate Replies:**

* Click a processed email
* Click "Generate Reply Draft"
* Reply is automatically saved to Drafts

**Action Items:**

* Processed emails show action items extracted by AI
* Click checkbox to mark items as complete/incomplete
* Completion status is saved automatically

### 3. Prompt Brain Page

Customize how the AI processes emails:

**Three Main Prompts:**

1. **Email Categorization**

   * Controls how emails are categorized
   * Defines rules for Important, To-Do, Newsletter, Spam

2. **Action Item Extraction**

   * Defines how to extract tasks from emails
   * Specifies output format (JSON)

3. **Auto-Reply Generation**

   * Controls tone and style of generated replies
   * Defines greeting/closing conventions

**How to Edit:**

1. Click on any prompt card
2. Edit the text in the textarea
3. Click "Save Changes" (for individual) or "Save All Changes"
4. Click "Reset to Defaults" to restore original prompts

**Tips for Writing Prompts:**

* Be specific and clear
* Include examples when possible
* Define expected output format
* Set constraints (e.g., "respond with only one word")

### 4. Agent Chat Page

Interactive AI assistant for your emails:

**Quick Actions:**

* **Show Urgent Emails** - Get list of important/urgent items
* **Inbox Summary** - Get overview of your inbox
* **My Action Items** - See all tasks from emails
* **Unprocessed Count** - Check how many emails need processing

**Chat with Context:**

1. Click an email from the "Recent Emails" sidebar
2. Selected email becomes the context
3. Ask questions like:

   * "Should I reply to this?"
   * "What's the main point of this email?"
   * "Draft a professional response"
4. Click "Clear" to remove email context

**General Questions:**

* "How many important emails do I have?"
* "What meetings do I have this week?"
* "Show me all action items with deadlines"

### 5. Drafts Page

Manage your email drafts:

**Create New Draft:**

1. Click "New Draft" button
2. Enter subject and body
3. Click "Save Draft"

**Edit Draft:**

1. Click any draft from the list
2. Click "Edit" button
3. Modify content
4. Click "Save Changes"

**Improve with AI:**

1. Click "Edit" on a draft
2. Click "Improve with AI"
3. AI will enhance your draft's clarity and professionalism
4. Review and save

**Delete Draft:**

* Click trash icon on draft card
* Confirm deletion

### 6. Search Functionality

Use the search bar to find specific emails:

* Search by sender name
* Search by subject
* Search by email content
* Results update in real-time

## UI Features

### Split-View Layout

* **Full View:** When no email is selected, inbox takes full width
* **Split View:** When email is clicked, layout splits (list + detail)
* **Close Detail:** Click X button to return to full view

### Loading States

* Spinner animations while processing
* Progress indicators for batch operations
* Real-time status messages

### Error Handling

* Clear error messages
* Automatic error dismissal after 3 seconds
* Network error detection

### Success Feedback

* Green success messages
* Auto-dismiss after 3 seconds
* Visual confirmation of actions

## Configuration Files

### vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### vercel.json (for deployment)

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}

```

## Troubleshooting

### API Connection Issues

**Problem:** `Failed to load emails`
**Solution:**

1. Check if backend is running (`http://localhost:5000`)
2. Verify `VITE_API_URL` in `.env.local`
3. Check browser console for CORS errors
4. Disable ad blocker (may block `/api/emails` requests)

### CORS Errors

**Problem:** `Access-Control-Allow-Origin` errors
**Solution:**

1. Make sure backend CORS is configured for your frontend URL
2. Check backend includes your Vercel domain in allowed origins
3. Clear browser cache and hard reload (Ctrl+Shift+R)

### Slow Processing

**Problem:** "Process All" takes very long
**Solution:**

* Normal for 20 emails (~30 seconds)
* Backend adds 1-second delay between requests to avoid rate limits
* Check backend logs for any API errors

### Environment Variables Not Working

**Problem:** `API calls going to wrong URL`
**Solution:**

```bash
# Stop the dev server
# Delete node_modules/.vite
rm -rf node_modules/.vite

# Restart
npm run dev
```

## Project Structure

```
frontend/
├── public/              # Static assets
│   └── favicon.svg
├── src/
│   ├── components/      # Reusable components
│   │   ├── EmailCard.jsx
│   │   ├── EmailCard.css
│   │   ├── EmailList.jsx
│   │   ├── EmailList.css
│   │   ├── EmailDetail.jsx
│   │   ├── EmailDetail.css
│   │   └── SearchBar.jsx
│   ├── context/         # React Context
│   │   └── EmailContext.jsx
│   ├── pages/           # Page components
│   │   ├── InboxPage.jsx
│   │   ├── InboxPage.css
│   │   ├── PromptBrainPage.jsx
│   │   ├── PromptBrainPage.css
│   │   ├── AgentChatPage.jsx
│   │   ├── AgentChatPage.css
│   │   ├── DraftsPage.jsx
│   │   └── DraftsPage.css
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── App.css
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env.local           # Local environment variables
├── .env.production      # Production environment variables
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── vercel.json          # Vercel deployment config
└── package.json         # Dependencies
```

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:

   * **Framework Preset:** Vite
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`
5. Add environment variable:

   ```
   VITE_API_URL = https://your-backend-url.onrender.com/api
   ```
6. Click "Deploy"

### 3. Configure Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Live Frontend:** [https://commandmail.vercel.app](https://commandmail.vercel.app)

## Environment Variables Reference

| Variable       | Description          | Required | Example                     |
| -------------- | -------------------- | -------- | --------------------------- |
| `VITE_API_URL` | Backend API base URL | Yes      | `http://localhost:5000/api` |

## Best Practices

### Performance

* Images and assets are optimized
* Code splitting for faster load times
* Lazy loading for better performance

### Accessibility

* Semantic HTML elements
* ARIA labels where needed
* Keyboard navigation support

### Security

* No sensitive data in frontend code
* API keys only in backend
* Environment variables for configuration

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/NewFeature`)
3. Commit changes (`git commit -m 'Add NewFeature'`)
4. Push to branch (`git push origin feature/NewFeature`)
5. Open Pull Request


## 👤 Author

Ayush Gupta
