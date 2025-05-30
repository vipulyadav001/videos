class VideoGallery {
    constructor() {
        this.videoGrid = document.getElementById('videoGrid');
        this.loading = document.getElementById('loading');
        this.init();
    }

    async init() {
        try {
            await this.loadVideos();
        } catch (error) {
            console.error('Error loading videos:', error);
            this.showError('Failed to load videos. Please try again.');
        }
    }

    async loadVideos() {
        try {
            const response = await fetch('/api/videos');
            const videos = await response.json();
            
            this.loading.classList.add('hidden');
            this.renderVideos(videos);
        } catch (error) {
            throw new Error('Failed to fetch videos');
        }
    }

    renderVideos(videos) {
        if (videos.length === 0) {
            this.videoGrid.innerHTML = '<p style="color: white; text-align: center; grid-column: 1/-1;">No videos found</p>';
            return;
        }

        this.videoGrid.innerHTML = videos.map(video => this.createVideoCard(video)).join('');
        
        // Add click event listeners
        document.querySelectorAll('.video-card').forEach(card => {
            card.addEventListener('click', () => {
                const filename = card.dataset.filename;
                this.downloadVideo(filename);
            });
        });
    }

    createVideoCard(video) {
        return `
            <div class="video-card" data-filename="${video.filename}">
                <video class="video-thumbnail" muted>
                    <source src="/videos/${video.filename}" type="video/mp4">
                </video>
                <div class="video-info">
                    <div class="video-title">${this.formatFilename(video.filename)}</div>
                    <div class="video-size">${this.formatFileSize(video.size)}</div>
                    <button class="download-btn" onclick="event.stopPropagation()">
                        📥 Download Video
                    </button>
                </div>
                <div class="download-overlay">
                    <div class="download-icon">⬇️</div>
                </div>
            </div>
        `;
    }

    formatFilename(filename) {
        // Remove extension and make it more readable
        return filename
            .replace('.mp4', '')
            .replace(/InShot_/, '')
            .replace(/(\d{8})_\d+/, (match) => {
                // Extract just the date part (first 8 digits) and format it
                const dateMatch = match.match(/(\d{8})/);
                if (dateMatch) {
                    const dateStr = dateMatch[1];
                    const year = dateStr.substring(0, 4);
                    const month = dateStr.substring(4, 6);
                    const day = dateStr.substring(6, 8);
                    const date = new Date(year, month - 1, day);
                    return date.toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                    });
                }
                return match;
            });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    downloadVideo(filename) {
        // Create a temporary link element and trigger download
        const link = document.createElement('a');
        link.href = `/download/${filename}`;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show download feedback
        this.showDownloadFeedback(filename);
    }

    showDownloadFeedback(filename) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000;
            font-weight: 600;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = `Downloading ${this.formatFilename(filename)}...`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    showError(message) {
        this.loading.innerHTML = `
            <div style="color: #ff6b6b; font-size: 1.2rem;">
                ❌ ${message}
            </div>
        `;
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize the gallery when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VideoGallery();
});