# Video Gallery Downloader

A beautiful web application that displays all videos from the `videos` folder and allows users to download them with a single click.

## Features

- 🎬 Beautiful video gallery with grid layout
- 📱 Responsive design that works on all devices
- ⬇️ One-click video downloads
- 🎨 Modern UI with hover effects and animations
- 📊 File size display for each video
- 🔄 Automatic video thumbnail generation
- 📅 Smart filename formatting with date parsing
- 🔗 Social media links footer
- ☁️ Deployable to Vercel

## Quick Start (Local Development)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

### Option 2: Deploy via GitHub

1. **Push your code to GitHub**
2. **Connect your GitHub repo to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the configuration

### Important Notes for Vercel Deployment

- **File Size Limits:** Vercel has a 100MB limit for serverless functions. Large video files may need to be hosted elsewhere (like AWS S3) for production use.
- **Function Timeout:** Download functions have a 30-second timeout limit.
- **Static Files:** The `videos` folder will be deployed as static files accessible via `/videos/filename.mp4`

## Development

For development with auto-restart:
```bash
npm run dev
```

## How it Works

- The server scans the `videos` folder for MP4 files
- Videos are displayed in a responsive grid layout
- Click any video card to download the file
- The server streams files efficiently for large video downloads
- Social media links are displayed in the footer

## Social Media

- **Instagram:** @WorksJustFineCurtains
- **YouTube:** Works Just Fine Channel
- **LinkedIn:** Vipul Yadav

## File Structure

```
├── index.html          # Main HTML page
├── styles.css          # CSS styling
├── script.js           # Frontend JavaScript
├── server.js           # Express.js server (local dev)
├── api/                # Vercel serverless functions
│   ├── videos.js       # API endpoint for video list
│   └── download.js     # API endpoint for downloads
├── vercel.json         # Vercel configuration
├── package.json        # Node.js dependencies
├── videos/             # Video files directory
└── README.md           # This file
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Notes

- Videos are served directly from the `videos` folder
- Large files are streamed efficiently
- No video conversion or processing is performed
- All videos must be in MP4 format
- For production with large files, consider using a CDN or cloud storage