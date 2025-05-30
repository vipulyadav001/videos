const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const videosDir = path.join(process.cwd(), 'videos');
        
        // Check if videos directory exists
        if (!fs.existsSync(videosDir)) {
            return res.status(404).json({ error: 'Videos directory not found' });
        }

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
        
        res.status(200).json(videos);
    } catch (error) {
        console.error('Error reading videos directory:', error);
        res.status(500).json({ error: 'Failed to read videos directory' });
    }
}