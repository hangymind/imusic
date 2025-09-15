if (localStorage.getItem('theme') === 'light') { //肝帝永不没落！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
            document.body.classList.add('light');
        }
        
        let isPlaying = false;
        let currentSongIndex = 0;
        let playlist = [];
        let lyricsData = [];
        let currentLyricIndex = 0;

        const audioPlayer = document.getElementById('audioPlayer');
        const playBtn = document.getElementById('playBtn');
        const albumCover = document.getElementById('albumCover');
        const progressBar = document.getElementById('progressBar');
        const progress = document.getElementById('progress');
        const lyrics = document.getElementById('lyrics');
        const themeToggle = document.getElementById('themeToggle');
        let playMode = document.getElementById('playMode');
        if (!playMode) {
            playMode = document.createElement('select');
            playMode.id = 'playMode';
            playMode.style.display = 'none'; 
            const options = [
                { value: 'list', text: '列表循环' },
                { value: 'single', text: '单曲循环' },
                { value: 'random', text: '随机播放' }
            ];
            options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.text;
                playMode.appendChild(opt);
            });
            document.body.appendChild(playMode);
        }
        const searchBtn = document.getElementById('searchBtn');
        const searchModal = document.getElementById('searchModal');
        const searchModalInput = document.getElementById('searchModalInput');
        const searchModalClose = document.getElementById('searchModalClose');
        const searchBackdrop = document.querySelector('.search-backdrop');
        searchBtn.addEventListener('click', () => {
            searchModal.classList.add('show');
            setTimeout(() => {
                searchModalInput.focus();
            }, 300);
        });
        searchModalClose.addEventListener('click', () => {
            searchModal.classList.remove('show');
        });
        searchBackdrop.addEventListener('click', () => {
            searchModal.classList.remove('show');
        });
        searchModalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                const query = encodeURIComponent(this.value.trim());
                const url = `https://www.myfreemp3.com.cn/?page=audioPage&type=netease&name=${query}`;
                window.open(url, '_blank');
                this.value = '';
                searchModal.classList.remove('show');
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.classList.contains('show')) {
                searchModal.classList.remove('show');
            }
        });

        themeToggle.addEventListener('change', () => {
            document.body.classList.toggle('light', themeToggle.checked);
            localStorage.setItem('theme', themeToggle.checked ? 'light' : 'dark');
        });
        const modeBtn = document.getElementById('modeBtn');
        const playModes = ['list', 'single', 'random'];
        const modeTexts = ['列表循环', '单曲循环', '随机播放'];
        let currentModeIndex = 0;
        
        modeBtn.addEventListener('click', () => {
            currentModeIndex = (currentModeIndex + 1) % playModes.length;
            playMode.value = playModes[currentModeIndex];
            modeBtn.textContent = modeTexts[currentModeIndex];
            localStorage.setItem('playMode', playModes[currentModeIndex]);
        });
        const savedMode = localStorage.getItem('playMode');
        if (savedMode && playModes.includes(savedMode)) {
            currentModeIndex = playModes.indexOf(savedMode);
            playMode.value = savedMode;
            modeBtn.textContent = modeTexts[currentModeIndex];
        }
        if (localStorage.getItem('theme') === 'light') {
            themeToggle.checked = true;
        }
        
        // 边框开关功能
        const borderToggle = document.getElementById('borderToggle');
        const lyricsContainer = document.querySelector('.lyrics-container');
        
        // 加载保存的边框设置
        const savedBorderState = localStorage.getItem('showBorder');
        if (savedBorderState === 'false') {
            borderToggle.checked = false;
            lyricsContainer.style.border = 'none';
            lyricsContainer.style.boxShadow = 'none';
        }
        
        // 添加边框开关事件监听器
        borderToggle.addEventListener('change', () => {
            if (borderToggle.checked) {
                lyricsContainer.style.border = ''; // 恢复默认样式
                lyricsContainer.style.boxShadow = '';
                localStorage.setItem('showBorder', 'true');
            } else {
                lyricsContainer.style.border = 'none';
                lyricsContainer.style.boxShadow = 'none';
                localStorage.setItem('showBorder', 'false');
            }
        });

        playBtn.addEventListener('click', () => {
            if (!audioPlayer.src) return;
            if (isPlaying) {
                audioPlayer.pause();
                playBtn.textContent = '▶';
                albumCover.classList.remove('rotating');
            } else {
                audioPlayer.play();
                playBtn.textContent = '⏸';
                albumCover.classList.add('rotating');
            }
            isPlaying = !isPlaying;
        });

        function fmt(t) {
            const m = Math.floor(t / 60);
            const s = Math.floor(t % 60);
            return `${m}:${s.toString().padStart(2, '0')}`;
        }

        progressBar.addEventListener('click', e => {
            const rect = progressBar.getBoundingClientRect();
            const newTime = ((e.clientX - rect.left) / rect.width) * audioPlayer.duration;
            audioPlayer.currentTime = newTime;
        });

        const timeSlider = document.getElementById('timeSlider');
        const currentTimeLabel = document.getElementById('currentTime');
        const durationTimeLabel = document.getElementById('durationTime');

        audioPlayer.addEventListener('loadedmetadata', () => {
            durationTimeLabel.textContent = fmt(audioPlayer.duration);
            timeSlider.max = audioPlayer.duration;
        });

        audioPlayer.addEventListener('timeupdate', () => {
            const cur = audioPlayer.currentTime;
            const dur = audioPlayer.duration || 0;
            const percent = dur ? (cur / dur) * 100 : 0;
            progress.style.width = percent + '%';
            timeSlider.value = cur;
            currentTimeLabel.textContent = fmt(cur);
            updateLyrics();
        });

        timeSlider.addEventListener('input', () => {
            audioPlayer.currentTime = timeSlider.value;
        });

        audioPlayer.addEventListener('ended', () => {
            const mode = playMode?.value || 'list'; 
            if (mode === 'single') {
                audioPlayer.currentTime = 0;
                audioPlayer.play();
                return;
            }
            
            if (playlist.length === 0) return; 
            
            if (mode === 'random') {
               
                let newIndex;
               
                if (playlist.length > 1) {
                    do {
                        newIndex = Math.floor(Math.random() * playlist.length);
                    } while (newIndex === currentSongIndex);
                } else {
                    newIndex = 0;
                }
                currentSongIndex = newIndex;
            } else {
                currentSongIndex++;
                if (currentSongIndex >= playlist.length) {
                    currentSongIndex = 0; 
                }
            }
            
            if (playlist[currentSongIndex]) {
                audioPlayer.src = playlist[currentSongIndex].url;
                document.getElementById('songTitle').textContent = playlist[currentSongIndex].name;
                audioPlayer.play();
                isPlaying = true;
                playBtn.textContent = '暂停';
                albumCover.classList.add('rotating');
            }
        });
        document.getElementById('musicFile').addEventListener('change', e => {
            [...e.target.files].forEach(file => {
                const url = URL.createObjectURL(file);
                playlist.push({
                    name: file.name.replace(/\.[^/.]+$/, ''),
                    url
                });
            });
            if (playlist.length && !audioPlayer.src) {
                currentSongIndex = 0;
                audioPlayer.src = playlist[0].url;
                document.getElementById('songTitle').textContent = playlist[0].name;
            }
            updatePlaylist();
            renderSortableList();
            closeModal('uploadModal');
        });

        document.getElementById('lyricsFile').addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = ev => parseLyrics(ev.target.result);
            reader.readAsText(file);
            closeModal('lyricsModal');
        });

        document.getElementById('coverFile').addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const url = URL.createObjectURL(file);
            document.getElementById('coverImage').src = url;
            document.getElementById('coverImage').style.display = 'block';
            document.getElementById('coverPlaceholder').style.display = 'none';
            closeModal('coverModal');
        });

        function parseLyrics(lrc) {
            lyricsData = [];
            lrc.split('\n').forEach(line => {
                const m = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
                if (m) {
                    const min = parseInt(m[1]), sec = parseInt(m[2]), cs = parseInt(m[3]);
                    const time = min * 60 + sec + cs / 100;
                    const text = m[4].trim();
                    if (text) lyricsData.push({ time, text });
                }
            });
            displayLyrics();
        }
        function displayLyrics() {
            lyrics.innerHTML = '';
            lyricsData.forEach((item, idx) => {
                const line = document.createElement('div');
                line.className = 'lyric-line';
                line.textContent = item.text;
                line.dataset.time = item.time;
                lyrics.appendChild(line);
            });
        }
        function updateLyrics() {
            const cur = audioPlayer.currentTime;
            let idx = -1;
            for (let i = 0; i < lyricsData.length; i++) {
                if (cur >= lyricsData[i].time) idx = i;
                else break;
            }
            if (idx !== currentLyricIndex && idx >= 0) {
                document.querySelectorAll('.lyric-line').forEach(l => l.classList.remove('active'));
                const active = document.querySelectorAll('.lyric-line')[idx];
                if (active) {
                    active.classList.add('active');
                    active.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                currentLyricIndex = idx;
            }
        }

        function updatePlaylist() {
            const pl = document.getElementById('playlist');
            pl.innerHTML = '';
            playlist.forEach((song, idx) => {
                const li = document.createElement('li');
                li.className = 'playlist-item';
                const songName = document.createElement('span');
                songName.textContent = song.name;
                songName.onclick = () => playSong(idx);
                li.appendChild(songName);
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-song-btn';
                deleteBtn.textContent = '×';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    removeSong(idx);
                };
                li.appendChild(deleteBtn);
                
                pl.appendChild(li);
            });
        }
        function removeSong(index) {
            const wasCurrentSong = index === currentSongIndex;
            playlist.splice(index, 1);
            if (playlist.length === 0) {
                audioPlayer.src = '';
                document.getElementById('songTitle').textContent = '暂无歌曲';
                isPlaying = false;
                playBtn.textContent = '▶';
                albumCover.classList.remove('rotating');
            } else if (wasCurrentSong) {
                currentSongIndex = Math.min(index, playlist.length - 1);
                audioPlayer.src = playlist[currentSongIndex].url;
                document.getElementById('songTitle').textContent = playlist[currentSongIndex].name;
                if (isPlaying) audioPlayer.play();
            } else if (index < currentSongIndex) {
                currentSongIndex--;
            }
            updatePlaylist();
            renderSortableList();
        }
        function playSong(idx) {
            currentSongIndex = idx;
            audioPlayer.src = playlist[idx].url;
            document.getElementById('songTitle').textContent = playlist[idx].name;
            if (isPlaying) audioPlayer.play();
            closeModal('playlistModal');
        }

        document.getElementById('settingsBtn').addEventListener('click', () => {
            const modal = document.getElementById('settingsModal');
            modal.style.display = 'flex';
            void modal.offsetWidth;
            modal.classList.add('show');
            renderSortableList();
        });
        document.querySelectorAll('.settings-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.settings-item').forEach(i => i.classList.remove('active'));
                document.querySelectorAll('.settings-page').forEach(p => p.classList.remove('active'));
                item.classList.add('active');
                document.getElementById(item.dataset.page + '-settings').classList.add('active');
            });
        });
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');
        volumeSlider.addEventListener('input', () => {
            const v = volumeSlider.value;
            audioPlayer.volume = v / 100;
            volumeValue.textContent = v + '%';
            const percent = (v / 100) * 100;
            volumeSlider.style.background = `linear-gradient(to right, #a0a0a0 0%, #a0a0a0 ${percent}%, var(--bg-btn) ${percent}%, var(--bg-btn) 100%)`;
        });
        
        const initialVolume = volumeSlider.value;
        const initialPercent = (initialVolume / 100) * 100;
        volumeSlider.style.background = `linear-gradient(to right, #a0a0a0 0%, #a0a0a0 ${initialPercent}%, var(--bg-btn) ${initialPercent}%, var(--bg-btn) 100%)`;
        function renderSortableList() {
            const ol = document.getElementById('sortableList');
            ol.innerHTML = '';
            playlist.forEach((song, idx) => {
                const li = document.createElement('li');
                li.textContent = `${idx + 1}. ${song.name}`;
                li.dataset.idx = idx;
                ol.appendChild(li);
            });
            Sortable.create(ol, {
                animation: 150,
                onEnd: evt => {
                    const [mov] = playlist.splice(evt.oldIndex, 1);
                    playlist.splice(evt.newIndex, 0, mov);
                    updatePlaylist();
                }
            });
        }
        function closeModal(id) {
            const modal = document.getElementById(id);
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', e => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                    setTimeout(() => {
                        modal.style.display = 'none';
                    }, 300);
                }
            });
        });
        document.getElementById('playlistBtn').addEventListener('click', () => {
            const modal = document.getElementById('playlistModal');
            modal.style.display = 'flex';
            void modal.offsetWidth;
            modal.classList.add('show');
        });
        document.getElementById('uploadBtn').addEventListener('click', () => {
            const modal = document.getElementById('uploadModal');
            modal.style.display = 'flex';
            void modal.offsetWidth;
            modal.classList.add('show');
        });
        document.getElementById('uploadLyricsBtn').addEventListener('click', () => {
            const modal = document.getElementById('lyricsModal');
            modal.style.display = 'flex';
            void modal.offsetWidth;
            modal.classList.add('show');
        });
        document.getElementById('uploadCoverBtn').addEventListener('click', () => {
            const modal = document.getElementById('coverModal');
            modal.style.display = 'flex';
            void modal.offsetWidth;
            modal.classList.add('show');
        });
        document.getElementById('addUrlBtn').addEventListener('click', () => {
            const modal = document.getElementById('urlModal');
            modal.style.display = 'flex';
            void modal.offsetWidth;
            modal.classList.add('show');
        });
        document.getElementById('addSingleUrlBtn').addEventListener('click', () => {
            const url = document.getElementById('musicUrl').value.trim();
            const name = document.getElementById('musicName').value.trim();
            
            if (!url) {
                showUrlStatus('请输入有效的音乐URL', 'error');
                return;
            }
            
            try {
                new URL(url);
            } catch (e) {
                showUrlStatus('无效的URL格式', 'error');
                return;
            }
            let songName = name;
            if (!songName) {
                const urlObj = new URL(url);
                const pathname = urlObj.pathname;
                const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
                songName = filename.replace(/\.[^/.]+$/, ''); 
            }
            
            playlist.push({ name: songName, url: url });
            
            if (!audioPlayer.src) {
                currentSongIndex = 0;
                audioPlayer.src = playlist[0].url;
                document.getElementById('songTitle').textContent = playlist[0].name;
            }
            
            updatePlaylist();
            renderSortableList();
            showUrlStatus('歌曲添加成功！', 'success');
           
            document.getElementById('musicUrl').value = '';
            document.getElementById('musicName').value = '';
        });
        
       
        document.getElementById('addBatchUrlsBtn').addEventListener('click', () => {
            const batchUrlsText = document.getElementById('batchUrls').value.trim();
            
            if (!batchUrlsText) {
                showUrlStatus('请输入要添加的音乐URL', 'error');
                return;
            }
            
            const urls = batchUrlsText.split('\n').map(url => url.trim()).filter(url => url);
            
            if (urls.length === 0) {
                showUrlStatus('没有有效的URL', 'error');
                return;
            }
            
            let successCount = 0;
            let errorCount = 0;
            
            urls.forEach(url => {
                try {
                    new URL(url);
                    const urlObj = new URL(url);
                    const pathname = urlObj.pathname;
                    const filename = pathname.substring(pathname.lastIndexOf('/') + 1);
                    const songName = filename.replace(/\.[^/.]+$/, '');
                    playlist.push({ name: songName, url: url });
                    successCount++;
                } catch (e) {
                    errorCount++;
                }
            });
            if (successCount > 0 && !audioPlayer.src) {
                currentSongIndex = 0;
                audioPlayer.src = playlist[0].url;
                document.getElementById('songTitle').textContent = playlist[0].name;
            }
            
            updatePlaylist();
            renderSortableList();
            showUrlStatus(`成功添加 ${successCount} 首歌曲，失败 ${errorCount} 首`, 'success');
            
            document.getElementById('batchUrls').value = '';
        });
        function showUrlStatus(message, type) {
            const statusElement = document.getElementById('urlAddStatus');
            statusElement.textContent = message;
            statusElement.style.color = type === 'error' ? '#ff0000' : '#646464';
            setTimeout(() => {
                statusElement.textContent = '';
            }, 3000);
        }
        function closeChangelogModal() {
            const dontShowAgain = document.getElementById('dontShowAgain').checked;
            if (dontShowAgain) {
                localStorage.setItem('hasSeenChangelog', 'true');
            }
            closeModal('changelogModal');
        }
        function checkShowChangelog() {
            const hasSeen = localStorage.getItem('hasSeenChangelog');
            if (!hasSeen) {
         
                setTimeout(() => {
                    const modal = document.getElementById('changelogModal');
                    modal.style.display = 'flex';
                    void modal.offsetWidth;
                    modal.classList.add('show');
                }, 1000);
            }
        }
        window.addEventListener('load', checkShowChangelog);
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingOverlay = document.getElementById('loadingOverlay');
                loadingOverlay.classList.add('fade-out');
            }, 1500);
        });
        
        
        document.getElementById('checkUpdateBtn').addEventListener('click', checkForUpdates);
        // 检查downloadUpdateBtn元素是否存在
        const downloadUpdateBtn = document.getElementById('downloadUpdateBtn');
        if (downloadUpdateBtn) {
            downloadUpdateBtn.addEventListener('click', () => {
                window.open('https://imusicapp.netlify.app/files/download/latest', '_blank');
                closeModal('updateModal');
            });
        }
        
        function handleVersionCheck(latestVersion) {
            const updateStatus = document.getElementById('updateStatus');
            const currentVersion = '1.3';
            
            console.log('使用备选方案处理版本检查:', latestVersion);
            
            try {
                latestVersion = latestVersion.trim();
                if (!latestVersion.match(/^\d+(\.\d+)*$/)) {
                    throw new Error(`无效的版本号格式: ${latestVersion}`);
                }
                
                console.log('处理后的版本号:', latestVersion);
                
                if (isNewerVersion(latestVersion, currentVersion)) {
                    updateStatus.textContent = '发现新版本！';
                    updateStatus.style.color = '#4CAF50';
                    
                    document.getElementById('latestVersion').textContent = latestVersion;
                    
                    const updateContent = [
                        '修复已知bug',
                        '优化用户界面',
                        '提升性能体验',
                        '新增功能支持'
                    ];
                    
                    const contentList = document.getElementById('updateContent');
                    contentList.innerHTML = '';
                    updateContent.forEach(item => {
                        const li = document.createElement('li');
                        li.textContent = item;
                        contentList.appendChild(li);
                    });
                    
                    const modal = document.getElementById('updateModal');
                    modal.style.display = 'flex';
                    void modal.offsetWidth;
                    modal.classList.add('show');
                } else {
                    updateStatus.textContent = '已是最新版本';
                    updateStatus.style.color = '#646464';
                }
            } catch (error) {
                console.error('版本检查处理失败:', error);
                updateStatus.textContent = `版本检查失败: ${error.message}`;
                updateStatus.style.color = '#f44336';
            }
        }
        
        function checkForUpdates() {
            const updateStatus = document.getElementById('updateStatus');
           
            
            window.open('https://imusicapp.netlify.app/files/ver/check', '_blank');
            setTimeout(() => {
               
            }, 1000);
        }
        
        function isNewerVersion(latestVersion, currentVersion) {
           
            const latest = latestVersion.split('.').map(Number);
            const current = currentVersion.split('.').map(Number);
            
            for (let i = 0; i < Math.max(latest.length, current.length); i++) {
                const l = latest[i] || 0;
                const c = current[i] || 0;
                if (l > c) return true;
                if (l < c) return false;
            }
            return false;
        }