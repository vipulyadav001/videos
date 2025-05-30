const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Extract filename from URL path
        const urlPath = req.url;
        const filename = urlPath.split('/').pop();
        
        if (!filename) {
            return res.status(400).json({ error: 'No filename provided' });
        }

        const filePath = path.join(process.cwd(), 'videos', filename);
        
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
}