# 🌿 My Absolute Field - Setup Guide

This guide will walk you through deploying your personal website with a content management system (CMS) so you can easily add journal entries and photos.

**Time needed:** 30-45 minutes  
**Difficulty:** Beginner-friendly (just follow the steps!)

---

## What You'll Have When Done

- ✅ A live website at `your-site-name.netlify.app`
- ✅ An admin panel at `your-site-name.netlify.app/admin`
- ✅ Ability to add/edit journal entries from any device
- ✅ Ability to upload photos to your gallery
- ✅ Ability to update your reading stats

---

## Step 1: Create a GitHub Account

If you already have a GitHub account, skip to Step 2.

1. Go to [github.com](https://github.com)
2. Click **Sign Up**
3. Follow the prompts to create your free account
4. Verify your email address

---

## Step 2: Upload Your Site to GitHub

### Option A: Using GitHub Website (Easier)

1. Log into GitHub
2. Click the **+** icon in the top right → **New repository**
3. Name it: `my-absolute-field` (or any name you like)
4. Keep it **Public**
5. Check ✅ **Add a README file**
6. Click **Create repository**

Now upload the files:

7. Click **Add file** → **Upload files**
8. Drag the entire contents of the `my-absolute-field` folder into the upload area:
   - `index.html`
   - `netlify.toml`
   - `admin/` folder
   - `content/` folder
   - `_data/` folder
   - `images/` folder
9. Click **Commit changes**

### Option B: Using GitHub Desktop (More Reliable)

1. Download [GitHub Desktop](https://desktop.github.com/)
2. Sign in with your GitHub account
3. File → New Repository
4. Name: `my-absolute-field`
5. Choose the `my-absolute-field` folder as the local path
6. Click **Create Repository**
7. Click **Publish Repository**

---

## Step 3: Create a Netlify Account

1. Go to [netlify.com](https://www.netlify.com)
2. Click **Sign Up**
3. Choose **Sign up with GitHub** (easiest!)
4. Authorize Netlify to access your GitHub

---

## Step 4: Deploy Your Site

1. In Netlify, click **Add new site** → **Import an existing project**
2. Choose **GitHub**
3. Find and select your `my-absolute-field` repository
4. Leave all settings as default
5. Click **Deploy site**

⏳ Wait 1-2 minutes for deployment...

6. Your site is now live! Netlify gives you a random URL like `amazing-cupcake-123.netlify.app`

### (Optional) Change Your Site Name

1. Go to **Site settings** → **Site details** → **Change site name**
2. Choose something memorable like `my-absolute-field` 
3. Your new URL: `my-absolute-field.netlify.app`

---

## Step 5: Enable the CMS (Identity)

This lets you log into the admin panel.

1. In Netlify, go to **Integrations** (left sidebar)
2. Search for **Identity** and click **Enable**
3. Go to **Integrations** → **Identity** → **Settings**
4. Under **Registration**, select **Invite only**
5. Under **Services** → **Git Gateway**, click **Enable Git Gateway**

---

## Step 6: Create Your Admin User

1. Go to **Integrations** → **Identity**
2. Click **Invite users**
3. Enter your email address
4. Check your email for the invitation
5. Click the link and set your password

---

## Step 7: Test Your CMS! 🎉

1. Go to `your-site-name.netlify.app/admin`
2. Click **Login with Netlify Identity**
3. Enter your email and password
4. You should see your content management dashboard!

Try it out:
- Click **Journal Entries** → **New Journal Entry**
- Write something and click **Publish**
- Check your live site - it should appear!

---

## How to Use Your CMS

### Adding a Journal Entry

1. Go to `/admin`
2. Click **Journal Entries** → **New Journal Entry**
3. Fill in:
   - **Title**: Your entry title
   - **Date**: When you wrote it
   - **Featured Image**: (optional) Upload a photo
   - **Excerpt**: 1-2 sentence preview
   - **Body**: Your full entry (supports formatting!)
   - **Tags**: Select relevant tags
4. Click **Publish**

### Adding a Photo

1. Go to `/admin`
2. Click **Photography** → **New Photography**
3. Fill in:
   - **Title**: Name your photo
   - **Photo**: Upload your image
   - **Caption**: (optional) Brief description
   - **Date Taken**: When you took it
   - **Category**: What type of photo
   - **Featured**: Toggle on for large display
4. Click **Publish**

### Updating Reading Stats

1. Go to `/admin`
2. Click **Site Settings** → **Reading Stats**
3. Update any numbers:
   - 2026 books read
   - Your goal
   - Currently reading list
4. Click **Publish**

---

## Updating Reading Data from Storygraph

The site now **automatically processes** your Storygraph CSV export!

### How to Update Your Reading Data:

1. Go to [Storygraph](https://app.thestorygraph.com) → Settings → Export
2. Download your CSV export
3. Rename the file to `storygraph.csv`
4. In your GitHub repo, go to the `_data` folder
5. Upload/replace `storygraph.csv` with your new file
6. Netlify will automatically rebuild and process your data!

The build script will:
- ✅ Count your total books read
- ✅ Sort books by star rating
- ✅ Update your "currently reading" list
- ✅ Track your 2026 reading goal progress
- ✅ Count your TBR pile

---

## Troubleshooting

### "Page not found" on /admin
- Make sure you uploaded the `admin` folder with both `index.html` and `config.yml`
- Wait a few minutes and try again

### Can't log in
- Make sure you completed Step 5 (Enable Identity)
- Make sure you completed Step 6 (Create admin user)
- Check your email for the invitation link

### Changes not showing on site
- Wait 1-2 minutes - Netlify needs to rebuild
- Try a hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Need help?
- Netlify docs: https://docs.netlify.com
- Decap CMS docs: https://decapcms.org/docs

---

## Your Project Structure

```
my-absolute-field/
├── index.html          ← Your main website
├── netlify.toml        ← Netlify configuration
├── package.json        ← Build script config
├── build.js            ← CSV processor (runs on deploy)
├── admin/
│   ├── index.html      ← CMS admin page
│   └── config.yml      ← CMS configuration
├── content/
│   ├── journal/        ← Your journal entries (markdown)
│   └── photography/    ← Your photos (markdown + images)
├── _data/
│   ├── reading.json    ← Reading stats (auto-updated)
│   ├── books.json      ← Books by rating (auto-generated)
│   ├── fitness.json    ← Fitness routine
│   ├── journal.json    ← Journal entries
│   ├── photography.json ← Photo entries
│   └── storygraph.csv  ← Your Storygraph export (upload here!)
└── images/
    └── uploads/        ← Uploaded images go here
```

---

## Congratulations! 🎉

You now have a beautiful personal website that you can update from anywhere!

**Your site:** `https://your-site-name.netlify.app`  
**Your admin:** `https://your-site-name.netlify.app/admin`

Happy journaling and photo sharing! 📝📷
