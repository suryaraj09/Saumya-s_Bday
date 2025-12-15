# Saumya's Birthday Invitation 🎉

A modern, interactive four-sided digital invitation card for a midnight birthday celebration.

## Features

✨ **Four-Sided Flip Experience**
- Side 1: Personalized name entry
- Side 2: Birthday celebration content
- Side 3: Event details (time & venue)
- Side 4: RSVP with backend integration

🎨 **Modern Design**
- Midnight-themed aesthetic with deep blues, purples, and gold accents
- Smooth 3D flip animations between sides
- Glassmorphism effects and gradient backgrounds
- Mobile-first responsive design
- Micro-animations for enhanced user experience

💾 **Smart Features**
- Local storage for visitor name persistence
- Duplicate RSVP prevention
- Automatic timestamp generation
- Backend fallback for offline submissions

## Project Structure

```
Saumya's_Bday/
├── index.html          # Main HTML structure
├── style.css           # Styling and animations
├── script.js           # Frontend logic
├── server.js           # Express backend server
├── package.json        # Node.js dependencies
├── responses.json      # RSVP data storage
└── README.md           # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Server**
   ```bash
   npm start
   ```

3. **Open the Invitation**
   - Navigate to: `http://localhost:3000/index.html`
   - Or simply: `http://localhost:3000`

## Usage

### For Guests
1. Enter your name on the first screen
2. Navigate through the invitation using the buttons
3. Submit your RSVP on the final screen

### For Organizers

**View All RSVPs:**
```bash
# Visit in browser
http://localhost:3000/api/rsvp
```

**View Statistics:**
```bash
# Visit in browser
http://localhost:3000/api/stats
```

**Check Responses File:**
- Open `responses.json` to see all RSVP data
- Each response includes: name, response (yes/no), timestamp

## API Endpoints

### POST `/api/rsvp`
Submit a new RSVP response
```json
{
  "name": "John Doe",
  "response": "yes",
  "timestamp": "2024-12-15T14:19:31+05:30"
}
```

### GET `/api/rsvp`
Retrieve all RSVP responses

### GET `/api/stats`
Get RSVP statistics (total, attending, not attending)

## Event Details

- **Gathering:** December 17th, 2024 (Evening onwards)
- **Midnight Celebration:** 12:00 AM, December 18th, 2024
- **Venue:** To be shared personally

## Customization

### Change Colors
Edit CSS custom properties in `style.css`:
```css
:root {
    --color-midnight: #0a0e27;
    --color-accent-purple: #6b4ce6;
    --color-accent-gold: #d4af37;
    /* ... more colors */
}
```

### Modify Content
- Edit text in `index.html`
- Update event details in Side 3
- Customize messages in `script.js`

## Deployment

### Option 1: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Option 2: Netlify
1. Create `netlify.toml` for serverless functions
2. Deploy via Netlify CLI or web interface

### Option 3: Railway
1. Connect your GitHub repository
2. Railway will auto-detect and deploy

## Troubleshooting

**Server won't start:**
- Ensure port 3000 is available
- Check if Node.js is installed: `node --version`

**RSVP not submitting:**
- Verify server is running
- Check browser console for errors
- Ensure `responses.json` has write permissions

**Name not persisting:**
- Check browser localStorage is enabled
- Try a different browser

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is created for personal use for Saumya's birthday celebration.

---

Made with ❤️ for a special celebration
