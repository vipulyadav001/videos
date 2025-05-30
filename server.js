const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static('.'));
app.use('/videos', express.static('videos'));

// API endpoint to get list of videos
app.get('/api/videos', (req, res) => {
    try {
        const videosDir = path.join(__dirname, 'videos');
        const files = fs.readdirSync(videosDir);
        
        const videos = files
            .filter(file => file.endsWith('.mp4'))
            .map(file => {
                const filePath = path.join(videosDir, file);
                const stats = fs.statSync(filePath);
                return {
                    filename: file,
                    size: stats.size,
                    modified: stats.mtime
                };
            })
            .sort((a, b) => b.modified - a.modified); // Sort by newest first
        
        res.json(videos);
    } catch (error) {
        console.error('Error reading videos directory:', error);
        res.status(500).json({ error: 'Failed to read videos directory' });
    }
});

// Download endpoint
app.get('/download/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(__dirname, 'videos', filename);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        // Set headers for download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'video/mp4');
        
        // Stream the file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        
        fileStream.on('error', (error) => {
            console.error('Error streaming file:', error);
            res.status(500).json({ error: 'Failed to download file' });
        });
        
    } catch (error) {
        console.error('Error in download endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Video Gallery Server running at http://localhost:${PORT}`);
    console.log(`📁 Serving videos from: ${path.join(__dirname, 'videos')}`);
});

module.exports = app;