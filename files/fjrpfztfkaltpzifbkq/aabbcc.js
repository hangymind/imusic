
let debugMode = false;
const appVersion = "1.6.325y09m21d-14h41m23s"; 
let debugLogEntries = [];
document.addEventListener('DOMContentLoaded', function() {
    let debugPanel = document.createElement('div');
    debugPanel.className = 'debug-panel';
    debugPanel.id = 'debugPanel';
    document.body.appendChild(debugPanel);
    
    updateDebugPanel();
});
document.addEventListener('keydown', function(e) {
    if (e.key === ';' && !e.ctrlKey && !e.altKey && !e.shiftKey && !e.metaKey) {
        debugMode = !debugMode;
        updateDebugPanel();
        addDebugLog(debugMode ? '调试模式已开启' : '调试模式已关闭');
    }
});
function updateDebugPanel() {
    const debugPanel = document.getElementById('debugPanel');
    if (!debugPanel) return;
    debugPanel.style.display = debugMode ? 'block' : 'none';
    
    if (debugMode) {
        debugPanel.innerHTML = '';
        const versionInfo = document.createElement('div');
        versionInfo.className = 'version-info';
        versionInfo.textContent = `版本: ${appVersion}`;
        debugPanel.appendChild(versionInfo);
        debugLogEntries.forEach((entry, index) => {
            const logEntry = document.createElement('div');
            logEntry.className = 'log-entry';
            logEntry.textContent = entry;
            debugPanel.appendChild(logEntry);
        });
    }
}
function addDebugLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    debugLogEntries.push(`[${timestamp}] ${message}`);
    if (debugLogEntries.length > 20) {
        debugLogEntries.shift(); 
    }
    if (debugMode) {
        updateDebugPanel();
    }
}
addDebugLog('应用已启动');

let showToastOnLoad = true;
function showTopRightToast(message, duration = 3000) {
    if (!message || message.trim().length === 0) {
        return;
    }
    let toast = document.querySelector('.top-right-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'top-right-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.remove('show', 'hide');
    void toast.offsetWidth;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, duration);
}
window.addEventListener('load', () => {
    if (showToastOnLoad) {
        showTopRightToast('在座的各位都是芙宁娜的勾❤'); //我在这输入文字
    }
});

if (localStorage.getItem('theme') === 'light') { //肝帝永不没落！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
            document.body.classList.add('light');
        }
        window.isPlaying = false;
        window.currentSongIndex = 0;
        window.playlist = [];
        window.lyricsData = [];
        window.currentLyricIndex = 0;
        let isPlaying = window.isPlaying;
        let currentSongIndex = window.currentSongIndex;
        let playlist = window.playlist;
        let lyricsData = window.lyricsData;
        let currentLyricIndex = window.currentLyricIndex;

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
            const savedPrimaryColor = localStorage.getItem('primaryColor');
            const defaultColor = getDefaultColor();
            document.documentElement.style.setProperty('--primary-color', defaultColor);
            primaryColorPicker.value = defaultColor;
            localStorage.setItem('primaryColor', defaultColor);
            if (!savedPrimaryColor) {
                const defaultColor = getDefaultColor();
                document.documentElement.style.setProperty('--primary-color', defaultColor);
                primaryColorPicker.value = defaultColor;
            }
            
            addDebugLog(`主题已切换为: ${themeToggle.checked ? '浅色' : '深色'}`);
            // 主题切换时更新加载界面动画
            updateLoadingImageAnimation();
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
            addDebugLog(`播放模式已切换为: ${modeTexts[currentModeIndex]}`);
        });
        const savedMode = localStorage.getItem('playMode');
        if (savedMode && playModes.includes(savedMode)) {
            currentModeIndex = playModes.indexOf(savedMode);
            playMode.value = savedMode;
            modeBtn.textContent = modeTexts[currentModeIndex];
        }
        if (localStorage.getItem('theme') === 'light') {
            themeToggle.checked = true;
            addDebugLog('应用已加载浅色主题');
        } else {
            addDebugLog('应用已加载深色主题');
        }
        const primaryColorPicker = document.getElementById('primaryColorPicker');
        const resetThemeBtn = document.getElementById('resetThemeBtn');
        const glowColorPicker = document.getElementById('glowColorPicker');
        const resetGlowBtn = document.getElementById('resetGlowBtn');
        
        function getDefaultColor() {
            return document.body.classList.contains('light') ? '#a0a0a0' : '#555555';
        }
        
        function getDefaultGlowColor() {
            return document.body.classList.contains('light') ? '#ffffff' : '#ffffff';
        }
        
        // 初始化主题色
        const savedPrimaryColor = localStorage.getItem('primaryColor');
        if (savedPrimaryColor) {
            document.documentElement.style.setProperty('--primary-color', savedPrimaryColor);
            primaryColorPicker.value = savedPrimaryColor;
        } else {
            const defaultColor = getDefaultColor();
            document.documentElement.style.setProperty('--primary-color', defaultColor);
            primaryColorPicker.value = defaultColor;
        }
        
        // 初始化发光色
        const savedGlowColor = localStorage.getItem('glowColor');
        if (savedGlowColor) {
            document.documentElement.style.setProperty('--glow-color', savedGlowColor);
            glowColorPicker.value = savedGlowColor;
        } else {
            const defaultGlowColor = getDefaultGlowColor();
            document.documentElement.style.setProperty('--glow-color', defaultGlowColor);
            glowColorPicker.value = defaultGlowColor;
        }
        
        // 更新加载界面图片的动画
        function updateLoadingImageAnimation() {
            const loadingImage = document.querySelector('.loading-image');
            if (loadingImage) {
                if (document.body.classList.contains('light')) {
                    loadingImage.style.animation = 'customDarkGlow 2s ease-in-out infinite alternate';
                } else {
                    loadingImage.style.animation = 'customGlow 2s ease-in-out infinite alternate';
                }
            }
        }
        
        // 初始化时更新加载界面动画
        updateLoadingImageAnimation();
        
        // 主题色变更事件
        primaryColorPicker.addEventListener('input', function() {
            const color = this.value;
            document.documentElement.style.setProperty('--primary-color', color);
            localStorage.setItem('primaryColor', color);
        });
        
        // 主题色重置事件
        resetThemeBtn.addEventListener('click', function() {
            const defaultColor = getDefaultColor();
            document.documentElement.style.setProperty('--primary-color', defaultColor);
            primaryColorPicker.value = defaultColor;
            localStorage.setItem('primaryColor', defaultColor);
        });
        
        // 发光色变更事件
        glowColorPicker.addEventListener('input', function() {
            const color = this.value;
            document.documentElement.style.setProperty('--glow-color', color);
            localStorage.setItem('glowColor', color);
        });
        
        // 发光色重置事件
        resetGlowBtn.addEventListener('click', function() {
            const defaultGlowColor = getDefaultGlowColor();
            document.documentElement.style.setProperty('--glow-color', defaultGlowColor);
            glowColorPicker.value = defaultGlowColor;
            localStorage.setItem('glowColor', defaultGlowColor);
        });
        const borderToggle = document.getElementById('borderToggle');
        const lyricsContainer = document.querySelector('.lyrics-container');
        const savedBorderState = localStorage.getItem('showBorder');
        if (savedBorderState === 'false') {
            borderToggle.checked = false;
            lyricsContainer.style.border = 'none';
            lyricsContainer.style.boxShadow = 'none';
        }
        borderToggle.addEventListener('change', () => {
            if (borderToggle.checked) {
                lyricsContainer.style.border = ''; 
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
                addDebugLog(`暂停播放: ${playlist[currentSongIndex]?.name || '未知歌曲'}`);
            } else {
                audioPlayer.play();
                playBtn.textContent = '⏸';
                albumCover.classList.add('rotating');
                addDebugLog(`开始播放: ${playlist[currentSongIndex]?.name || '未知歌曲'}`);
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
            
            let nextSongIndex;
            if (mode === 'random') {
                
                if (playlist.length > 1) {
                    do {
                        nextSongIndex = Math.floor(Math.random() * playlist.length);
                    } while (nextSongIndex === currentSongIndex);
                } else {
                    nextSongIndex = 0;
                }
            } else {
                nextSongIndex = currentSongIndex + 1;
                if (nextSongIndex >= playlist.length) {
                    nextSongIndex = 0; 
                }
            }
            
            if (playlist[nextSongIndex]) {
                currentSongIndex = nextSongIndex;
                addDebugLog(`自动切换到${mode === 'random' ? '随机' : '下一首'}: ${playlist[currentSongIndex]?.name || '未知歌曲'}`);
                // 清空当前歌词
                lyricsData = [];
                currentLyricIndex = 0;
                window.lyricsData = lyricsData;
                window.currentLyricIndex = currentLyricIndex;
                displayLyrics();
                // 加载下一首歌曲
                audioPlayer.src = playlist[currentSongIndex].url;
                document.getElementById('songTitle').textContent = playlist[currentSongIndex].name;
                audioPlayer.play();
                isPlaying = true;
                playBtn.textContent = '⏸';
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
            if (!lyrics) {
                console.error('lyrics元素未找到');
                return;
            }
            lyrics.innerHTML = '';
            if (!lyricsData || lyricsData.length === 0) {
                const noLyrics = document.createElement('p');
                noLyrics.textContent = '暂无歌词';
                noLyrics.style.color = 'var(--text-weak)';
                noLyrics.style.textAlign = 'center';
                noLyrics.style.marginTop = '50px';
                lyrics.appendChild(noLyrics);
                return;
            }
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
                const renameBtn = document.createElement('button');
                renameBtn.className = 'rename-song-btn';
                renameBtn.textContent = '✏';
                renameBtn.title = '重命名';
                renameBtn.onclick = (e) => {
                    e.stopPropagation();
                    renameSong(idx);
                };
                li.appendChild(renameBtn);
                
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
        let currentRenameIndex = -1;
        function renameSong(index) {
            currentRenameIndex = index;
            const renameModal = document.getElementById('renameModal');
            const newSongNameInput = document.getElementById('newSongName');
            const renameError = document.getElementById('renameError');
            newSongNameInput.value = playlist[index].name;
            renameError.style.display = 'none';
            renameModal.style.display = 'flex';
            void renameModal.offsetWidth; 
            renameModal.classList.add('show');
            setTimeout(() => {
                newSongNameInput.focus();
                newSongNameInput.select();
            }, 100);
        }
        document.getElementById('confirmRenameBtn').addEventListener('click', () => {
            if (currentRenameIndex === -1) return;
            
            const newSongNameInput = document.getElementById('newSongName');
            const renameError = document.getElementById('renameError');
            const newName = newSongNameInput.value.trim();
            if (newName === '') {
                renameError.textContent = '歌曲名称不能为空';
                renameError.style.display = 'block';
                return;
            }
            playlist[currentRenameIndex].name = newName;
            updatePlaylist();
            renderSortableList();
            if (currentRenameIndex === currentSongIndex) {
                document.getElementById('songTitle').textContent = playlist[currentRenameIndex].name;
            }
            closeModal('renameModal');
        });
        document.getElementById('cancelRenameBtn').addEventListener('click', () => {
            closeModal('renameModal');
        });
        document.getElementById('renameModal').addEventListener('click', e => {
            if (e.target === document.getElementById('renameModal')) {
                closeModal('renameModal');
            }
        });
        document.getElementById('newSongName').addEventListener('keypress', e => {
            if (e.key === 'Enter') {
                document.getElementById('confirmRenameBtn').click();
            }
        });
        document.getElementById('newSongName').addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                document.getElementById('cancelRenameBtn').click();
            }
        });
        document.body.onselectstart = (e) => {
e.preventDefault();
return false;
};
        function removeSong(index) {
            const wasCurrentSong = index === currentSongIndex;
            playlist.splice(index, 1);
            if (playlist.length === 0) {
                audioPlayer.src = '';
                document.getElementById('songTitle').textContent = '暂无歌曲';
                isPlaying = false;
                playBtn.textContent = '▶';
                albumCover.classList.remove('rotating');
                lyricsData = [];
                currentLyricIndex = 0;
                window.lyricsData = lyricsData;
                window.currentLyricIndex = currentLyricIndex;
                displayLyrics();
            } else if (wasCurrentSong) {
                currentSongIndex = Math.min(index, playlist.length - 1);
                lyricsData = [];
                currentLyricIndex = 0;
                window.lyricsData = lyricsData;
                window.currentLyricIndex = currentLyricIndex;
                displayLyrics();
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
            addDebugLog(`切换到歌曲: ${playlist[idx]?.name || '未知歌曲'}`);
            lyricsData = [];
            currentLyricIndex = 0;
            window.lyricsData = lyricsData;
            window.currentLyricIndex = currentLyricIndex;
            displayLyrics();
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
                const activeItem = document.querySelector('.settings-item.active');
                const activePage = document.querySelector('.settings-page.active');
                if (activeItem === item) return;
                if (activePage) {
                    activePage.classList.remove('active');
                    activePage.classList.add('inactive');
                }
                setTimeout(() => {
                    document.querySelectorAll('.settings-item').forEach(i => i.classList.remove('active'));
                    document.querySelectorAll('.settings-page').forEach(p => p.classList.remove('inactive'));
                    item.classList.add('active');
                    const targetPage = document.getElementById(item.dataset.page + '-settings');
                    targetPage.classList.add('active');
                }, 300);
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
        document.getElementById('viewChangelogBtn').addEventListener('click', () => {
            const modal = document.getElementById('changelogModal');
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
                // 清空当前歌词
                lyricsData = [];
                currentLyricIndex = 0;
                window.lyricsData = lyricsData;
                window.currentLyricIndex = currentLyricIndex;
                displayLyrics();
                // 加载新歌曲
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
                // 清空当前歌词
                lyricsData = [];
                currentLyricIndex = 0;
                window.lyricsData = lyricsData;
                window.currentLyricIndex = currentLyricIndex;
                displayLyrics();
                // 加载新歌曲
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
            setTimeout(() => {
                const modal = document.getElementById('changelogModal');
                modal.style.display = 'flex';
                void modal.offsetWidth;
                modal.classList.add('show');
            }, 1000);
        }
        window.addEventListener('load', checkShowChangelog);
        window.addEventListener('load', () => {
            setTimeout(() => {
                const loadingOverlay = document.getElementById('loadingOverlay');
                loadingOverlay.classList.add('fade-out');
            }, 1500);
        });
        
        
        
        
        window.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
        
        
        let cropOffsetX = 0;
        let cropOffsetY = 0;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let originalImageSrc = '';
        let currentImageRect = null;
        let animationFrameId = null;
        let zoomLevel = 1; // 缩放比例，默认为1
        document.getElementById('cropCoverBtn').addEventListener('click', () => {
            const coverImage = document.getElementById('coverImage');
            if (!coverImage.src || coverImage.src === 'about:blank') {
                alert('请先上传专辑封面');
                return;
            }
            originalImageSrc = coverImage.src;
            const cropCoverModal = document.getElementById('cropCoverModal');
            cropCoverModal.style.display = 'flex';
            void cropCoverModal.offsetWidth;
            cropCoverModal.classList.add('show');
            const cropImage = document.getElementById('cropImage');
            const cropPlaceholder = document.getElementById('cropPlaceholder');
            const cropCircle = document.getElementById('cropCircle');
            const imageUrl = coverImage.src;
            const img = new Image();
            
            img.onload = () => {
                cropImage.onload = () => {
                    cropImage.style.display = 'block';
                    cropPlaceholder.style.display = 'none';
                    const previewContainer = document.getElementById('imagePreview');
                    const containerWidth = previewContainer.offsetWidth;
                    const containerHeight = previewContainer.offsetHeight;
                    const imageWidth = cropImage.offsetWidth;
                    const imageHeight = cropImage.offsetHeight;
                    const circleSize = Math.min(containerWidth, containerHeight) * 0.8;
                    cropCircle.style.width = `${Math.round(circleSize)}px`;
                    cropCircle.style.height = `${Math.round(circleSize)}px`;
                    cropOffsetX = 0;
                    cropOffsetY = 0;
                    updateCropPosition();
                    cropCircle.style.display = 'block';
                };
                
                cropImage.src = imageUrl;
            };
            
            img.src = imageUrl;
        });
        document.getElementById('cancelCropBtn').addEventListener('click', () => {
            closeModal('cropCoverModal');
        });
        document.getElementById('zoomSlider').addEventListener('input', function() {
            zoomLevel = parseFloat(this.value);
            updateCropPosition();
        });
        document.getElementById('cropCoverModal').addEventListener('click', e => {
            if (e.target === document.getElementById('cropCoverModal')) {
                closeModal('cropCoverModal');
            }
        });
        document.getElementById('repositionBtn').addEventListener('click', () => {
            cropOffsetX = 0;
            cropOffsetY = 0;
            zoomLevel = 1; 
            document.getElementById('zoomSlider').value = 1;
            updateCropPosition();
        });
        document.getElementById('confirmCropBtn').addEventListener('click', () => {
            const cropImage = document.getElementById('cropImage');
            const cropCircle = document.getElementById('cropCircle');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const circleSize = parseInt(cropCircle.style.width);
            canvas.width = circleSize;
            canvas.height = circleSize;
            const imageWidth = cropImage.offsetWidth;
            const imageHeight = cropImage.offsetHeight;
            const centerX = imageWidth / 2 - cropOffsetX;
            const centerY = imageHeight / 2 - cropOffsetY;
            ctx.save();
            ctx.beginPath();
            ctx.arc(circleSize / 2, circleSize / 2, circleSize / 2, 0, Math.PI * 2);
            ctx.clip();
            const scaleX = circleSize / imageWidth;
            const scaleY = circleSize / imageHeight;
            const scale = Math.max(scaleX, scaleY) / zoomLevel; 
            const drawWidth = imageWidth * scale;
            const drawHeight = imageHeight * scale;
            const drawX = (circleSize - drawWidth) / 2 - (centerX - imageWidth / 2) * scale;
            const drawY = (circleSize - drawHeight) / 2 - (centerY - imageHeight / 2) * scale;
            
            ctx.drawImage(cropImage, drawX, drawY, drawWidth, drawHeight);
            ctx.restore();
            const dataURL = canvas.toDataURL('image/png');
            const coverImage = document.getElementById('coverImage');
            coverImage.src = dataURL;
            closeModal('cropCoverModal');
        });
        const cropImage = document.getElementById('cropImage');
        cropImage.addEventListener('mousedown', startDrag);
        cropImage.addEventListener('touchstart', startDrag, { passive: true });
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag, { passive: false });
        
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
        
        function startDrag(e) {
            isDragging = true;
            const rect = cropImage.getBoundingClientRect();
            currentImageRect = rect;
            
            if (e.type === 'mousedown') {
                dragStartX = e.clientX - rect.left - cropOffsetX;
                dragStartY = e.clientY - rect.top - cropOffsetY;
            } else if (e.type === 'touchstart') {
                dragStartX = e.touches[0].clientX - rect.left - cropOffsetX;
                dragStartY = e.touches[0].clientY - rect.top - cropOffsetY;
            }
            
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging || !currentImageRect) return;
            
            let clientX, clientY;
            
            if (e.type === 'mousemove') {
                clientX = e.clientX;
                clientY = e.clientY;
            } else if (e.type === 'touchmove') {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
                e.preventDefault(); 
            }
            const newOffsetX = clientX - currentImageRect.left - dragStartX;
            const newOffsetY = clientY - currentImageRect.top - dragStartY;
            
            if (Math.abs(newOffsetX - cropOffsetX) > 0.5 || Math.abs(newOffsetY - cropOffsetY) > 0.5) {
                cropOffsetX = newOffsetX;
                cropOffsetY = newOffsetY;
                if (!animationFrameId) {
                    animationFrameId = requestAnimationFrame(() => {
                        updateCropPosition();
                        animationFrameId = null;
                    });
                }
            }
        }
        
        function endDrag() {
            isDragging = false;
            currentImageRect = null;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
            updateCropPosition();
        }
        
        function updateCropPosition() {
            const cropImage = document.getElementById('cropImage');
            const cropCircle = document.getElementById('cropCircle');
            const previewContainer = document.getElementById('imagePreview');
            
            if (!cropImage || !cropCircle || !previewContainer) return;
            const containerWidth = previewContainer.offsetWidth;
            const containerHeight = previewContainer.offsetHeight;
            const circleSize = parseInt(cropCircle.style.width);
            
            const circleX = (containerWidth - circleSize) / 2;
            const circleY = (containerHeight - circleSize) / 2;
            cropCircle.style.left = `${Math.round(circleX)}px`;
            cropCircle.style.top = `${Math.round(circleY)}px`;
            cropImage.style.transform = `translate(${Math.round(cropOffsetX)}px, ${Math.round(cropOffsetY)}px) scale(${zoomLevel})`;
        }
        window.addEventListener('resize', () => {
            if (document.getElementById('cropCoverModal').classList.contains('show')) {
               
                setTimeout(() => {
                    updateCropPosition();
                }, 100);
            }


        });
