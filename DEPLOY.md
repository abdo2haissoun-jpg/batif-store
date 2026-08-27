# Deploy BATIF Store to Vercel

## Quick Deploy (Recommended)

### Step 1: Push to GitHub

1. Go to https://github.com/new
2. Create a new repository named `batif-store`
3. Make it **Public** (or Private if you prefer)
4. Run these commands:

```bash
cd "/Users/webloo/Desktop/batif dev"
git init
git add .
git commit -m "Initial commit - BATIF Store"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/batif-store.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to https://vercel.com
2. Sign up/Login with your GitHub account
3. Click **"Add New..."** → **"Project"**
4. Select your `batif-store` repository
5. Click **"Deploy"**

That's it! Your store will be live at `https://batif-store.vercel.app`

### Step 3: Set Environment Variables (IMPORTANT)

After deployment, add these environment variables in Vercel:

1. Go to your project in Vercel
2. Click **"Settings"** → **"Environment Variables"**
3. Add these:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://bsibadesqhzerzuxegwv.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_L9Fg4HeKuIhvjgi-o96Ltw_7Rfm8OuS` |

4. Click **"Save"**
5. Go to **"Deployments"** → click **"..."** on latest → **"Redeploy"**

### Step 4: Custom Domain (Optional)

1. In Vercel, go to **"Settings"** → **"Domains"**
2. Add your custom domain (e.g., `batif.store`)
3. Follow the DNS instructions to point your domain to Vercel

## Important Notes

- **Products**: Your products are stored in Supabase and will appear automatically
- **Orders**: Orders are created directly in Supabase (no backend needed)
- **Admin Panel**: The admin panel (`localhost:3001`) stays local for now

## Troubleshooting

**Build fails?**
- Make sure all environment variables are set in Vercel
- Check the build logs in Vercel dashboard

**Images not showing?**
- Ensure Supabase Storage bucket `products` is public
- Check image URLs are accessible

**Products not loading?**
- Verify Supabase URL and anon key are correct
- Check if products have `status: 'published'` in database
