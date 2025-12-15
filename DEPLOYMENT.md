# Vercel Deployment Guide

## Step-by-Step Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Vercel CLI
```bash
npm install -g vercel
```

### 3. Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate with your Vercel account.

### 4. Set Up Vercel KV Storage

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Storage** tab
3. Click **Create Database**
4. Select **KV** (Redis)
5. Give it a name (e.g., "saumya-birthday-rsvp")
6. Click **Create**

### 5. Deploy to Vercel

From your project directory:
```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Select your account
- **Link to existing project?** → No
- **Project name?** → Press Enter (or give it a name)
- **Directory?** → Press Enter (current directory)
- **Override settings?** → No

Vercel will:
1. Build and deploy your project
2. Automatically link the KV database
3. Give you a deployment URL (e.g., `https://your-project.vercel.app`)

### 6. Connect KV Database to Project

After deployment, you need to link your KV database:

```bash
vercel env pull
```

Or manually in Vercel Dashboard:
1. Go to your project settings
2. Click **Storage**
3. Click **Connect Store**
4. Select your KV database
5. Click **Connect**

### 7. Redeploy (if needed)

If you had to manually link the database:
```bash
vercel --prod
```

### 8. Test Your Deployment

Visit your Vercel URL:
- Main site: `https://your-project.vercel.app`
- RSVP API: `https://your-project.vercel.app/api/rsvp`
- Stats API: `https://your-project.vercel.app/api/stats`

## Quick Deploy (Alternative)

If you have the project on GitHub:

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **Import Project**
3. Select your GitHub repository
4. Click **Deploy**
5. After deployment, set up KV database as described in Step 4-6

## Environment Variables

Vercel KV will automatically set these environment variables:
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

No manual configuration needed!

## Viewing RSVP Responses

### Via API:
```
https://your-project.vercel.app/api/rsvp
```

### Via Vercel KV Dashboard:
1. Go to **Storage** in your Vercel dashboard
2. Select your KV database
3. Browse the `rsvp_responses` key

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions

## Troubleshooting

**Issue:** API returns errors
- **Solution:** Make sure KV database is connected to the project

**Issue:** CORS errors
- **Solution:** Check that the API functions have proper CORS headers (already included)

**Issue:** Data not persisting
- **Solution:** Verify KV database is properly linked in project settings

## Cost

- Vercel Hobby (Free) plan includes:
  - Unlimited deployments
  - 100GB bandwidth
  - Serverless functions
  
- Vercel KV (Free) tier includes:
  - 256 MB storage
  - 10,000 commands per day
  - More than enough for this use case!

## Local Development

Continue using the Express server for local development:
```bash
npm start
```

The code automatically detects localhost and uses the appropriate API endpoint.
