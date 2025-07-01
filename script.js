 // Like button functionality
        const likeBtn = document.getElementById('likeBtn');
        likeBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-thumbs-up"></i> Liked';
            } else {
                this.innerHTML = '<i class="fas fa-thumbs-up"></i> Like';
            }
        });
        
        // Share button functionality
        const shareBtn = document.getElementById('shareBtn');
        shareBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-share-alt"></i> Shared';
                
                // Create a temporary input for sharing URL
                const tempInput = document.createElement('input');
                tempInput.value = window.location.href;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                
                setTimeout(() => {
                    this.classList.remove('active');
                    this.innerHTML = '<i class="fas fa-share-alt"></i> Share';
                }, 2000);
            }
        });
        
        // Drag and drop area functionality
        const dropArea = document.getElementById('dropArea');
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'video/*';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // Click to open file dialog
        dropArea.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Handle file selection
        fileInput.addEventListener('change', function() {
            if (this.files.length > 0) {
                handleFileUpload(this.files[0]);
            }
        });
        
        // Drag and drop events
        dropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropArea.style.borderColor = '#4CAF50';
            dropArea.style.background = 'rgba(76, 175, 80, 0.1)';
        });
        
        dropArea.addEventListener('dragleave', () => {
            dropArea.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            dropArea.style.background = 'transparent';
        });
        
        dropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dropArea.style.borderColor = 'rgba(255, 255, 255, 0.3)';
            dropArea.style.background = 'transparent';
            
            if (e.dataTransfer.files.length > 0) {
                handleFileUpload(e.dataTransfer.files[0]);
            }
        });
        
        // Playlist functionality
        let playlist = [];
        const playlistItems = document.getElementById('playlistItems');
        const playlistCount = document.getElementById('playlistCount');
        
        // Add to playlist function
        function addToPlaylist(title, url, thumbnail, sourceType) {
            // Trim title if too long
            const trimmedTitle = title.length > 40 ? title.substring(0, 40) + '...' : title;
            
            const playlistItem = {
                id: Date.now(),
                title: trimmedTitle,
                url: url,
                thumbnail: thumbnail,
                sourceType: sourceType
            };
            
            playlist.push(playlistItem);
            renderPlaylist();
            showNotification('Video added to playlist!');
            
            // If this is the first video, play it
            if (playlist.length === 1) {
                playVideo(playlistItem);
            }
        }
        
        // Render playlist
        function renderPlaylist() {
            playlistItems.innerHTML = '';
            playlistCount.textContent = playlist.length + ' videos';
            
            playlist.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'playlist-item';
                itemElement.dataset.id = item.id;
                
                let thumbContent = '';
                if (item.thumbnail) {
                    thumbContent = `<img src="${item.thumbnail}" alt="${item.title}">`;
                } else {
                    thumbContent = `<i class="fas fa-film" style="font-size:20px;color:rgba(255,255,255,0.7);"></i>`;
                }
                
                itemElement.innerHTML = `
                    <div class="playlist-thumb">
                        ${thumbContent}
                    </div>
                    <div class="playlist-info">
                        <div class="playlist-item-title">${item.title}</div>
                    </div>
                `;
                
                itemElement.addEventListener('click', () => {
                    playVideo(item);
                });
                
                playlistItems.appendChild(itemElement);
            });
        }
        
        // Play video
        function playVideo(item) {
            const videoPlayer = document.getElementById('videoPlayer');
            const videoTitle = document.getElementById('videoTitle');
            
            // Update video info - trim if too long
            const trimmedTitle = item.title.length > 50 ? item.title.substring(0, 50) + '...' : item.title;
            videoTitle.textContent = trimmedTitle;
            
            // Create player based on source type
            if (item.sourceType === 'youtube') {
                // Extract YouTube ID
                const videoId = extractYouTubeId(item.url);
                if (videoId) {
                    videoPlayer.innerHTML = `
                        <iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen>
                        </iframe>
                    `;
                } else {
                    videoPlayer.innerHTML = '<p style="color:white;padding:20px;">Error: Invalid YouTube URL</p>';
                }
            } else {
                videoPlayer.innerHTML = `
                    <video controls autoplay>
                        <source src="${item.url}" type="video/mp4">
                        <source src="yourvideo.mkv" type="video/x-matroska">
                        Your browser does not support the video tag.
                    </video>
                `;
            }
        }
        
        // Extract YouTube ID from URL
        function extractYouTubeId(url) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        }
        
        // Get YouTube thumbnail
        function getYouTubeThumbnail(url) {
            const videoId = extractYouTubeId(url);
            if (videoId) {
                return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }
            return null;
        }
        
        // Handle file upload
        function handleFileUpload(file) {
            if (file.type.startsWith('video/')) {
                const objectUrl = URL.createObjectURL(file);
                const title = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
                
                // Trim title if too long
                const trimmedTitle = title.length > 40 ? title.substring(0, 40) + '...' : title;
                
                addToPlaylist(
                    trimmedTitle,
                    objectUrl,
                    'https://img.freepik.com/premium-vector/video-icon-multimedia-film-symbol-play-button-sign_53562-5900.jpg',
                    'file'
                );
            } else {
                alert('Please select a video file!');
            }
        }
        
        // URL upload functionality
        const uploadUrlBtn = document.getElementById('uploadUrlBtn');
        const videoUrlInput = document.getElementById('videoUrl');
        
        uploadUrlBtn.addEventListener('click', function() {
            const url = videoUrlInput.value.trim();
            if (url) {
                // Check if it's a YouTube URL
                if (url.includes('youtube.com') || url.includes('youtu.be')) {
                    const title = "YouTube Video";
                    const thumbnail = getYouTubeThumbnail(url);
                    
                    addToPlaylist(
                        title,
                        url,
                        thumbnail,
                        'youtube'
                    );
                } else {
                    // For direct video URLs
                    const fileName = url.substring(url.lastIndexOf('/') + 1);
                    const title = fileName.replace(/\.[^/.]+$/, "");
                    
                    // Trim title if too long
                    const trimmedTitle = title.length > 40 ? title.substring(0, 40) + '...' : title;
                    
                    addToPlaylist(
                        trimmedTitle,
                        url,
                        'https://img.freepik.com/premium-vector/video-icon-multimedia-film-symbol-play-button-sign_53562-5900.jpg',
                        'direct'
                    );
                }
                
                // Clear input
                videoUrlInput.value = '';
            } else {
                alert('Please enter a valid video URL');
            }
        });
        
        // Press Enter to upload URL
        videoUrlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                uploadUrlBtn.click();
            }
        });
        
        // Notification function
        function showNotification(message) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
        
        // Chat functionality
        const chatMessages = document.getElementById('chatMessages');
        const chatInput = document.getElementById('chatInput');
        const chatSendBtn = document.getElementById('chatSendBtn');
        
        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
        
        function sendMessage() {
            const message = chatInput.value.trim();
            if (message) {
                addMessage(message, 'You', true);
                chatInput.value = '';
                
                // Simulate responses
                setTimeout(() => {
                    const responses = [
                        "That's interesting!",
                        "I agree with you",
                        "What do others think?",
                        "This video is amazing!",
                        "Can we watch something else next?"
                    ];
                    
                    const users = ['Alex', 'Jamie', 'Taylor', 'Riley', 'Morgan'];
                    const randomUser = users[Math.floor(Math.random() * users.length)];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    
                    addMessage(randomResponse, randomUser, false);
                }, 1000 + Math.random() * 3000);
            }
        }
        
        function addMessage(content, user, isSent) {
            const now = new Date();
            const timeString = now.getHours() + ':' + (now.getMinutes() < 10 ? '0' : '') + now.getMinutes();
            
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            messageElement.classList.add(isSent ? 'sent' : 'received');
            
            messageElement.innerHTML = `
                <div class="message-header">
                    <div class="message-user">${user}</div>
                    <div class="message-time">${timeString}</div>
                </div>
                <div class="message-content">${content}</div>
            `;
            
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Add some sample videos for demonstration
        window.addEventListener('load', () => {
            // Add a couple of sample videos
            addToPlaylist(
                "Bebe Rexha - I'm A Mess [Official Music Video]",
                "https://www.youtube.com/watch?v=1P7m7M7bGDE",
                "https://img.youtube.com/vi/1P7m7M7bGDE/hqdefault.jpg",
                "youtube"
            );
            
            addToPlaylist(
                "Camila Cabello - Liar (Audio)",
                "https://www.youtube.com/watch?v=8A2t_tAjMz8",
                "https://img.youtube.com/vi/8A2t_tAjMz8/hqdefault.jpg",
                "youtube"
            );
        });

          const header = document.getElementById('header');
           document.addEventListener('mousemove', (e) => {
    if (e.clientY < 80) {
      header.classList.add('show');
    } else {
      header.classList.remove('show');
    }
  });

 











  