# Vercel KV Setup Guide

## Why KV?
- Server‑less key‑value store that works out‑of‑the‑box with Vercel Functions.
- Stores RSVP responses persistently (no file system on serverless).

## Step‑by‑Step Instructions
1. **Log in to Vercel**
   - Open <https://vercel.com/dashboard> and sign in with the same account you used for the deployment.
2. **Select your project**
   - Find **`saumya-s-bday`** (or the project name shown in your deployment URL) and click it.
3. **Create a KV database**
   - In the left sidebar choose **Storage → KV**.
   - Click **Create Database**.
   - Give it a name, e.g. `birthday-rsvp` (must be globally unique, Vercel will add a suffix if needed).
4. **Connect the KV to the project**
   - After creation, click **Connect to Project** and select the same `saumya-s-bday` project.
   - Vercel will automatically add three environment variables to the project:
     - `KV_REST_API_URL`
     - `KV_REST_API_TOKEN`
     - `KV_REST_API_READ_ONLY_TOKEN`
5. **Redeploy the project**
   - Run the CLI from your project folder:
     ```bash
     vercel --prod
     ```
   - The deployment will pick up the new env vars and the serverless function `api/rsvp.js` will now read/write from KV.
6. **Verify the connection**
   - Open the live URL (e.g. `https://saumya-s-bday‑ha0eagjkx‑suryaraj09s‑projects.vercel.app`).
   - Submit an RSVP (both "I'm In" and "Can't Make It").
   - In the Vercel dashboard go to **Functions → Logs** for `api/rsvp` and you should see `kv.set` and `kv.get` calls without errors.
   - Optionally, create a temporary endpoint `/api/admin` that returns `await kv.get('rsvp_responses')` to see stored data directly.

## Optional: Local Development with KV
- Install the Vercel CLI locally (`npm i -g vercel`).
- Run `vercel env pull .env.local` to download the KV env vars for local testing.
- The same `api/rsvp.js` will work locally because it reads the env vars from `.env.local`.

## Add a Reminder to README
You may want to add a short paragraph in your `README.md` linking to this guide so future contributors know how to set up KV again.

---
*Generated on ${new Date().toISOString()}*
