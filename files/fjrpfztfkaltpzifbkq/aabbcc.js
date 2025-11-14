
let debugMode = false;
const appVersion = "2.0.02025111418h49min34s"; 
let debugLogEntries = [];
document.addEventListener('DOMContentLoaded', function() {
    let debugPanel = document.createElement('div');
    debugPanel.className = 'debug-panel';
    debugPanel.id = 'debugPanel';
    document.body.appendChild(debugPanel);
    
    updateDebugPanel();
    const scrollPanel = document.getElementById('scrollPanel');
    if (scrollPanel) {
        scrollPanel.addEventListener('click', function(event) {
            if (event.target === scrollPanel) {
                scrollPanel.classList.remove('visible');
            }
        });
    }
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
        showTopRightToast('我豆居然是2.0');//我在这输入文字
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
        function createSearchResultsContainer() {
            let resultsContainer = document.getElementById('searchResults');
            if (!resultsContainer) {
                resultsContainer = document.createElement('div');
                resultsContainer.id = 'searchResults';
                resultsContainer.className = 'search-results';
                const searchModalContent = document.querySelector('.search-modal-content');
                searchModalContent.parentNode.insertBefore(resultsContainer, searchModalContent.nextSibling);
            }
            return resultsContainer;
        }
        function displaySearchResults(results) {
            const resultsContainer = createSearchResultsContainer();
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'block';
            
            if (!results || results.length === 0) {
                const noResultItem = document.createElement('div');
                noResultItem.className = 'search-result-item';
                noResultItem.textContent = '未找到相关歌曲';
                resultsContainer.appendChild(noResultItem);
                return;
            }
            
            results.forEach((song) => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.setAttribute('data-id', song.id);
                
                const songInfo = document.createElement('div');
                songInfo.className = 'song-info';
                
                const songImage = document.createElement('img');
                songImage.className = 'song-image';
                songImage.src = song.img1v1Url || 'https://tse4-mm.cn.bing.net/th/id/OIP-C._qi3Qq0XpVMleF_JEUU_9wAAAA?w=194&h=254&c=7&r=0&o=5&dpr=2&pid=1.7';
                songImage.alt = song.name || '未知歌曲';
                songInfo.appendChild(songImage);
                
                const songName = document.createElement('div');
                songName.className = 'song-name';
                songName.textContent = song.name || '未知歌曲';
                songInfo.appendChild(songName);
                
                const songArtists = document.createElement('div');
                songArtists.className = 'song-artists';
                songArtists.textContent = (song.artists && song.artists.map(artist => artist.name).join(', ')) || '未知艺术家';
                songInfo.appendChild(songArtists);
                
                const addButton = document.createElement('button');
                addButton.className = 'add-to-playlist-btn';
                addButton.textContent = '添加';
                addButton.title = '添加到播放列表';
                addButton.style.cssText = `
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    padding: 5px 10px;
                    cursor: pointer;
                    cursor: url('ctmcur/Hand.cur'), pointer;
                    font-size: 12px;
                    margin-left: 10px;
                    flex-shrink: 0;
                `;
                
                addButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const songId = resultItem.getAttribute('data-id');
                    const musicUrl = `https://music.163.com/song/media/outer/url?id=${songId}.mp3`;
                    const songName = song.name || '未知歌曲';
                    
                    addDebugLog(`尝试添加歌曲到播放列表: ${songName}`);
                    addDebugLog(`歌曲ID: ${songId}`);
                    addDebugLog(`生成的URL: ${musicUrl}`);
                    const songToAdd = {
                        name: songName,
                        url: musicUrl,
                        artist: (song.artists && song.artists.map(artist => artist.name).join(', ')) || '未知艺术家',
                        cover: song.img1v1Url || '',
                        lyric: ''
                    };
                    
                    addDebugLog(`准备添加的歌曲对象: ${JSON.stringify(songToAdd)}`);
                    window.playlist.push(songToAdd);
                    addDebugLog(`成功添加歌曲到播放列表，当前共有 ${window.playlist.length} 首歌曲`);
                    window.updatePlaylist();
                    window.renderSortableList();
                    
                    showTopRightToast(`已添加到播放列表: ${songName}`);
                });
                
                resultItem.appendChild(songInfo);
                resultItem.appendChild(addButton);
                
                resultItem.addEventListener('click', function() {
                    const songId = this.getAttribute('data-id');
                    const musicUrl = `https://music.163.com/song/media/outer/url?id=${songId}.mp3`;
                    navigator.clipboard.writeText(musicUrl).then(() => {
                        showTopRightToast(`已复制音乐链接`);
                    }).catch(err => {
                        console.error('复制失败:', err);
                        showTopRightToast('复制失败，请手动复制');
                    });
                });
                
                resultsContainer.appendChild(resultItem);
            });
        }
        function clearSearchResults() {
            const resultsContainer = document.getElementById('searchResults');
            if (resultsContainer) {
                resultsContainer.innerHTML = '';
                resultsContainer.style.display = 'none';
            }
        }

        searchModalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.value.trim()) {
                const query = encodeURIComponent(this.value.trim());
                const apiUrl = `https://163api.qijieya.cn/search?keywords=${query}`;
                const resultsContainer = createSearchResultsContainer();
                resultsContainer.innerHTML = '<div class="search-loading">搜索中...</div>';
                resultsContainer.style.display = 'block';
                fetch(apiUrl)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('API请求失败');
                        }
                        return response.json();
                    })
                    .then(data => {
                        addDebugLog(`搜索API返回的原始数据类型: ${typeof data}`);
                        addDebugLog(`搜索API返回是否为数组: ${Array.isArray(data)}`);
                        addDebugLog(`搜索API返回的原始数据: ${JSON.stringify(data, null, 2)}`);
                        
                        let songList = [];
                        if (Array.isArray(data)) {
                            songList = data;
                            addDebugLog(`直接使用数组数据，长度: ${songList.length}`);
                        } else if (data.result && Array.isArray(data.result.songs)) {
                            songList = data.result.songs;
                            addDebugLog(`使用data.result.songs，长度: ${songList.length}`);
                        } else if (data.songs && Array.isArray(data.songs)) {
                            songList = data.songs;
                            addDebugLog(`使用data.songs，长度: ${songList.length}`);
                        } else {
                            addDebugLog(`无法识别的数据格式，尝试查找songs字段`);
                            for (let key in data) {
                                if (Array.isArray(data[key])) {
                                    songList = data[key];
                                    addDebugLog(`使用data.${key}，长度: ${songList.length}`);
                                    break;
                                }
                            }
                        }
                        
                        addDebugLog(`最终处理后的歌曲列表长度: ${songList.length}`);
                        if (songList.length > 0) {
                            addDebugLog(`第一首歌曲示例: ${JSON.stringify(songList[0], null, 2)}`);
                        }
                        
                        displaySearchResults(songList);
                    })
                    .catch(error => {
                        console.error('搜索出错:', error);
                        addDebugLog(`搜索出错: ${error.message}`);
                        const resultsContainer = createSearchResultsContainer();
                        resultsContainer.innerHTML = `<div class="search-error">搜索出错: ${error.message}</div>`;
                    });
            }
        });
        searchModalClose.addEventListener('click', () => {
            searchModal.classList.remove('show');
            clearSearchResults();
        });

        searchBackdrop.addEventListener('click', () => {
            searchModal.classList.remove('show');
            clearSearchResults();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchModal.classList.contains('show')) {
                searchModal.classList.remove('show');
                clearSearchResults();
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
        const savedPrimaryColor = localStorage.getItem('primaryColor');
        if (savedPrimaryColor) {
            document.documentElement.style.setProperty('--primary-color', savedPrimaryColor);
            primaryColorPicker.value = savedPrimaryColor;
        } else {
            const defaultColor = getDefaultColor();
            document.documentElement.style.setProperty('--primary-color', defaultColor);
            primaryColorPicker.value = defaultColor;
        }
        const savedGlowColor = localStorage.getItem('glowColor');
        if (savedGlowColor) {
            document.documentElement.style.setProperty('--glow-color', savedGlowColor);
            glowColorPicker.value = savedGlowColor;
        } else {
            const defaultGlowColor = getDefaultGlowColor();
            document.documentElement.style.setProperty('--glow-color', defaultGlowColor);
            glowColorPicker.value = defaultGlowColor;
        }
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
        updateLoadingImageAnimation();
        primaryColorPicker.addEventListener('input', function() {
            const color = this.value;
            document.documentElement.style.setProperty('--primary-color', color);
            localStorage.setItem('primaryColor', color);
        });
        resetThemeBtn.addEventListener('click', function() {
            const defaultColor = getDefaultColor();
            document.documentElement.style.setProperty('--primary-color', defaultColor);
            primaryColorPicker.value = defaultColor;
            localStorage.setItem('primaryColor', defaultColor);
        });
        glowColorPicker.addEventListener('input', function() {
            const color = this.value;
            document.documentElement.style.setProperty('--glow-color', color);
            localStorage.setItem('glowColor', color);
        });
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
                lyricsData = [];
                currentLyricIndex = 0;
                window.lyricsData = lyricsData;
                window.currentLyricIndex = currentLyricIndex;
                displayLyrics();
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
                const currentAlignment = localStorage.getItem('lyricsAlignment') || 'left';
                noLyrics.style.textAlign = currentAlignment;
                noLyrics.style.marginTop = '50px';
                lyrics.appendChild(noLyrics);
                return;
            }
            const currentAlignment = localStorage.getItem('lyricsAlignment') || 'left';
            lyrics.style.textAlign = currentAlignment;
            
            lyricsData.forEach((item, idx) => {
                const line = document.createElement('div');
                line.className = 'lyric-line';
                line.textContent = item.text;
                line.dataset.time = item.time;
                line.style.textAlign = currentAlignment;
                lyrics.appendChild(line);
            });
        }
        function updateLyrics() {
            const cur = audioPlayer.currentTime;
            const delay = parseFloat(localStorage.getItem('lyricsDelay') || '0');
            const adjustedTime = cur + delay;
            let idx = -1;
            for (let i = 0; i < lyricsData.length; i++) {
                if (adjustedTime >= lyricsData[i].time) idx = i;
                else break;
            }
            if (idx !== currentLyricIndex && idx >= 0) {
                document.querySelectorAll('.lyric-line').forEach(l => {
                    l.classList.remove('active');
                    const savedFontSize = localStorage.getItem('lyricsFontSize') || '18';
                    l.style.fontSize = savedFontSize + 'px';
                });
                
                const active = document.querySelectorAll('.lyric-line')[idx];
                if (active) {
                    active.classList.add('active');
                    const savedActiveFontSize = localStorage.getItem('lyricsActiveFontSize') || '22';
                    active.style.fontSize = savedActiveFontSize + 'px';
                    active.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                currentLyricIndex = idx;
            }
        }
        function pauseSong() {
            if (audioPlayer && isPlaying) {
                audioPlayer.pause();
                playBtn.textContent = '▶';
                albumCover.classList.remove('rotating');
                isPlaying = false;
                addDebugLog(`暂停播放: ${playlist[currentSongIndex]?.name || '未知歌曲'}`);
                updateMiniPlayerState();
            }
        }

        function playPrevSong() {
            if (playlist.length === 0) return;
            
            let prevSongIndex;
            if (playMode?.value === 'random') {
                if (playlist.length > 1) {
                    do {
                        prevSongIndex = Math.floor(Math.random() * playlist.length);
                    } while (prevSongIndex === currentSongIndex);
                } else {
                    prevSongIndex = 0;
                }
            } else {
                prevSongIndex = currentSongIndex - 1;
                if (prevSongIndex < 0) {
                    prevSongIndex = playlist.length - 1;
                }
            }
            
            if (playlist[prevSongIndex]) {
                playSong(prevSongIndex);
                if (isPlaying) {
                    audioPlayer.play();
                }
            }
        }

        function playNextSong() {
            if (playlist.length === 0) return;
            
            let nextSongIndex;
            if (playMode?.value === 'random') {
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
                playSong(nextSongIndex);
                if (isPlaying) {
                    audioPlayer.play();
                }
            }
        }

        function updatePlaylist() {
            addDebugLog(`更新播放列表，当前共有 ${playlist.length} 首歌曲`);
            const pl = document.getElementById('playlist');
            pl.innerHTML = '';
            playlist.forEach((song, idx) => {
                addDebugLog(`歌曲 ${idx}: ${song.name}, URL: ${song.url}`);
                const li = document.createElement('li');
                li.className = 'playlist-item';
                const songName = document.createElement('span');
                songName.textContent = song.name;
                songName.onclick = () => playSong(idx);
                li.appendChild(songName);
                const favoriteBtn = document.createElement('button');
                favoriteBtn.className = 'favorite-btn';
                const isFavorited = window.isFavorited && window.isFavorited(song.url);
                favoriteBtn.innerHTML = isFavorited ? '❤' : '♡';
                favoriteBtn.title = isFavorited ? '取消收藏' : '收藏';
                favoriteBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (window.isFavorited && window.isFavorited(song.url)) {
                        window.removeFromFavorites && window.removeFromFavorites(song.url);
                        favoriteBtn.innerHTML = '♡';
                        favoriteBtn.title = '收藏';
                        favoriteBtn.classList.remove('favorited');
                    } else {
                        window.addToFavorites && window.addToFavorites(song);
                        favoriteBtn.innerHTML = '❤';
                        favoriteBtn.title = '取消收藏';
                        favoriteBtn.classList.add('favorited');
                    }
                };
                li.appendChild(favoriteBtn);
                
                const renameBtn = document.createElement('button');
                renameBtn.className = 'rename-song-btn';
                renameBtn.textContent = '✏';
                renameBtn.title = '编辑';
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
            const newArtistNameInput = document.getElementById('newArtistName');
            const renameError = document.getElementById('renameError');
            newSongNameInput.value = playlist[index].name;
            newArtistNameInput.value = playlist[index].artist || '';
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
            const newArtistNameInput = document.getElementById('newArtistName');
            const renameError = document.getElementById('renameError');
            const newName = newSongNameInput.value.trim();
            const newArtist = newArtistNameInput.value.trim();
            if (newName === '') {
                renameError.textContent = '歌曲名称不能为空';
                renameError.style.display = 'block';
                return;
            }
            playlist[currentRenameIndex].name = newName;
            playlist[currentRenameIndex].artist = newArtist || '未知的音乐人';
            updatePlaylist();
            renderSortableList();
            if (currentRenameIndex === currentSongIndex) {
                document.getElementById('songTitle').textContent = playlist[currentRenameIndex].name;
               
                document.getElementById('artistName').textContent = playlist[currentRenameIndex].artist;
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
            addDebugLog(`歌曲URL: ${playlist[idx]?.url || '无URL'}`);
            if (!playlist[idx]?.url) {
                addDebugLog('错误: 歌曲URL为空');
                showTopRightToast('无法播放: 歌曲URL无效');
                return;
            }
            
            lyricsData = [];
            currentLyricIndex = 0;
            window.lyricsData = lyricsData;
            window.currentLyricIndex = currentLyricIndex;
            displayLyrics();
            audioPlayer.src = playlist[idx].url;
            document.getElementById('songTitle').textContent = playlist[idx].name;
            document.getElementById('artistName').textContent = playlist[idx].artist || '未知的音乐人';
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
        
        const lyricsFontSlider = document.getElementById('lyricsFontSlider');
        const lyricsFontValue = document.getElementById('lyricsFontValue');
        const lyricsActiveFontSlider = document.getElementById('lyricsActiveFontSlider');
        const lyricsActiveFontValue = document.getElementById('lyricsActiveFontValue');
        const lyricsGlowSlider = document.getElementById('lyricsGlowSlider');
        const lyricsGlowValue = document.getElementById('lyricsGlowValue');
        const resetLyricsFontBtn = document.getElementById('resetLyricsFontBtn');
        const resetLyricsActiveFontBtn = document.getElementById('resetLyricsActiveFontBtn');
        const resetLyricsGlowBtn = document.getElementById('resetLyricsGlowBtn');
        const savedFontSize = localStorage.getItem('lyricsFontSize') || '18';
        const savedActiveFontSize = localStorage.getItem('lyricsActiveFontSize') || '22';
        const savedGlowSize = localStorage.getItem('lyricsGlowSize') || '15';
        const alignLeftBtn = document.getElementById('alignLeftBtn');
        const alignCenterBtn = document.getElementById('alignCenterBtn');
        const alignRightBtn = document.getElementById('alignRightBtn');
        const alignmentBtns = [alignLeftBtn, alignCenterBtn, alignRightBtn];
        const savedAlignment = localStorage.getItem('lyricsAlignment') || 'left';
        const lyricsDelaySlider = document.getElementById('lyricsDelaySlider');
        const lyricsDelayValue = document.getElementById('lyricsDelayValue');
        const resetLyricsDelayBtn = document.getElementById('resetLyricsDelayBtn');
        const savedDelay = localStorage.getItem('lyricsDelay') || '0';
        
        lyricsFontSlider.value = savedFontSize;
        lyricsFontValue.textContent = savedFontSize + 'px';
        lyricsActiveFontSlider.value = savedActiveFontSize;
        lyricsActiveFontValue.textContent = savedActiveFontSize + 'px';
        lyricsGlowSlider.value = savedGlowSize;
        lyricsGlowValue.textContent = savedGlowSize + 'px';
        lyricsDelaySlider.value = savedDelay;
        lyricsDelayValue.textContent = savedDelay + 's';
        applyLyricsSettings(savedFontSize, savedActiveFontSize, savedGlowSize);
        setLyricsAlignment(savedAlignment);
        
        lyricsFontSlider.addEventListener('input', () => {
            const fontSize = lyricsFontSlider.value;
            lyricsFontValue.textContent = fontSize + 'px';
            localStorage.setItem('lyricsFontSize', fontSize);
            applyLyricsSettings(fontSize, null, null);
        });
        
        lyricsActiveFontSlider.addEventListener('input', () => {
            const activeFontSize = lyricsActiveFontSlider.value;
            lyricsActiveFontValue.textContent = activeFontSize + 'px';
            localStorage.setItem('lyricsActiveFontSize', activeFontSize);
            applyLyricsSettings(null, activeFontSize, null);
        });
        
        lyricsGlowSlider.addEventListener('input', () => {
            const glowSize = lyricsGlowSlider.value;
            lyricsGlowValue.textContent = glowSize + 'px';
            localStorage.setItem('lyricsGlowSize', glowSize);
            applyLyricsSettings(null, null, glowSize);
        });
        lyricsDelaySlider.addEventListener('input', () => {
            const delay = lyricsDelaySlider.value;
            lyricsDelayValue.textContent = delay + 's';
            localStorage.setItem('lyricsDelay', delay);
        });
        resetLyricsFontBtn.addEventListener('click', () => {
            const defaultFontSize = '18';
            lyricsFontSlider.value = defaultFontSize;
            lyricsFontValue.textContent = defaultFontSize + 'px';
            localStorage.setItem('lyricsFontSize', defaultFontSize);
            applyLyricsSettings(defaultFontSize, null, null);
        });
        
        resetLyricsActiveFontBtn.addEventListener('click', () => {
            const defaultActiveFontSize = '22';
            lyricsActiveFontSlider.value = defaultActiveFontSize;
            lyricsActiveFontValue.textContent = defaultActiveFontSize + 'px';
            localStorage.setItem('lyricsActiveFontSize', defaultActiveFontSize);
            applyLyricsSettings(null, defaultActiveFontSize, null);
        });
        
        resetLyricsGlowBtn.addEventListener('click', () => {
            const defaultGlowSize = '15';
            lyricsGlowSlider.value = defaultGlowSize;
            lyricsGlowValue.textContent = defaultGlowSize + 'px';
            localStorage.setItem('lyricsGlowSize', defaultGlowSize);
            applyLyricsSettings(null, null, defaultGlowSize);
        });
        resetLyricsDelayBtn.addEventListener('click', () => {
            const defaultDelay = '0';
            lyricsDelaySlider.value = defaultDelay;
            lyricsDelayValue.textContent = defaultDelay + 's';
            localStorage.setItem('lyricsDelay', defaultDelay);
        });
        alignLeftBtn.addEventListener('click', () => setLyricsAlignment('left'));
        alignCenterBtn.addEventListener('click', () => setLyricsAlignment('center'));
        alignRightBtn.addEventListener('click', () => setLyricsAlignment('right'));
        function setLyricsAlignment(alignment) {
            alignmentBtns.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.align === alignment) {
                    btn.classList.add('active');
                }
            });
            localStorage.setItem('lyricsAlignment', alignment);
            if (lyrics) {
                lyrics.style.textAlign = alignment;
            }
            const lyricLines = document.querySelectorAll('.lyric-line');
            lyricLines.forEach(line => {
                line.style.textAlign = alignment;
            });
        }
        function applyLyricsSettings(fontSize, activeFontSize, glowSize) {
            const lyricsElements = document.querySelectorAll('.lyrics, .lyric-line:not(.active)');
            const activeLyricElements = document.querySelectorAll('.lyric-line.active');
            
            if (fontSize !== null) {
                lyricsElements.forEach(el => {
                    el.style.fontSize = fontSize + 'px';
                });
            }
            
            if (activeFontSize !== null) {
                activeLyricElements.forEach(el => {
                    el.style.fontSize = activeFontSize + 'px';
                });
            }
            
            if (glowSize !== null) {
                activeLyricElements.forEach(el => {
                    el.style.textShadow = `0 0 ${glowSize}px var(--glow-color)`;
                });
            }
        }
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
            
            playlist.push({ name: songName, url: url, artist: '未知的音乐人' });
            
            if (!audioPlayer.src) {
                currentSongIndex = 0;
                lyricsData = [];
                currentLyricIndex = 0;
                window.lyricsData = lyricsData;
                window.currentLyricIndex = currentLyricIndex;
                displayLyrics();
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
                    playlist.push({ name: songName, url: url, artist: '未知的音乐人' });
                    successCount++;
                } catch (e) {
                    errorCount++;
                }
            });
            if (successCount > 0 && !audioPlayer.src) {
                currentSongIndex = 0;
                lyricsData = [];
                currentLyricIndex = 0;
                window.lyricsData = lyricsData;
                window.currentLyricIndex = currentLyricIndex;
                displayLyrics();
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
        function checkShowChangelog() { //989-1005:强制更新方法
            setTimeout(() => {
                const modal = document.getElementById('changelogModal');
            //    const forceUpdate = document.getElementById('forceUpdate');
              //  forceUpdate.style.display = 'flex';
                modal.style.display = 'flex';
           //     void forceUpdate.offsetWidth;
                void modal.offsetWidth;
                modal.classList.add('show');
            //    forceUpdate.classList.add('show');
            }, 1000);
        }
        window.addEventListener('load', checkShowChangelog);
        window.addEventListener('load', () => {
            // Step 1: Logo加载0.7秒
            setTimeout(() => {
                // Step 2: 触发从上至下覆盖屏幕的动画
                const overlayAnimation = document.getElementById('overlayAnimation');
                const loadingImage = document.querySelector('.loading-image');
                
                // 隐藏图标
                loadingImage.style.opacity = '0';
                
                // 开始覆盖动画
                overlayAnimation.classList.add('cover');
                
                // 在覆盖动画进行到一半时显示loading文字
                setTimeout(() => {
                    const loadingTextContainer = document.querySelector('.loading-text-container');
                    const loadingText = document.getElementById('loadingText');
                    
                    // 显示loading-text容器
                    loadingTextContainer.classList.add('show');
                    
                    // 显示loading...字样
                    loadingText.classList.add('show');
                    
                    // Step 3: 0.5秒后进入软件
                    setTimeout(() => {
                        const loadingOverlay = document.getElementById('loadingOverlay');
                        loadingOverlay.classList.add('fade-out');
                    }, 500);
                }, 400); // 在覆盖动画进行到一半时（400ms）显示文字
            }, 700);
        });
        //window.addEventListener('load', () => {
        //    const downloadBtn = document.getElementById('downloadUpdateBtn');
        //    if (downloadBtn) {
        //        downloadBtn.addEventListener('click', () => {
        //            window.open('https://imusicapp.netlify.app/', '_blank');
        //        });
        //    }
        //});
        window.updatePlaylist = updatePlaylist;
        window.renderSortableList = renderSortableList;
        
        
        
        
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
        
        
        document.addEventListener('DOMContentLoaded', function() {
            const streamerModeToggle = document.getElementById('streamerModeToggle');
            const watermarkText = document.getElementById('watermarkText');
            const savedStreamerMode = localStorage.getItem('streamerMode') === 'true';
            const savedWatermarkText = localStorage.getItem('watermarkText') || '©iw46Team 2025';
            const savedWatermarkPosition = JSON.parse(localStorage.getItem('watermarkPosition') || '{"bottom":"0","left":"50%"}');
            streamerModeToggle.checked = savedStreamerMode;
            watermarkText.value = savedWatermarkText;
            const watermarkDisplay = document.createElement('div');
            watermarkDisplay.className = 'streamer-watermark-display';
            watermarkDisplay.id = 'streamerWatermarkDisplay';
          
            watermarkDisplay.style.bottom = savedWatermarkPosition.bottom;
            watermarkDisplay.style.left = savedWatermarkPosition.left;
            
            if (savedWatermarkPosition.left !== '50%') {
                watermarkDisplay.style.transform = 'none';
            }
            updateWatermarkContent(savedWatermarkText);
            
            document.body.appendChild(watermarkDisplay);
            watermarkDisplay.style.display = savedStreamerMode ? 'block' : 'none';
            
            streamerModeToggle.addEventListener('change', function() {
                const isEnabled = this.checked;
                localStorage.setItem('streamerMode', isEnabled);
                watermarkDisplay.style.display = isEnabled ? 'block' : 'none';
            });
            
            watermarkText.addEventListener('input', function() {
                const text = this.value || '©iw46Team 2025';
                localStorage.setItem('watermarkText', text);
                updateWatermarkContent(text);
            });
            let isDragging = false;
            let offsetX, offsetY;
            
            watermarkDisplay.addEventListener('mousedown', function(e) {
                isDragging = true;
                const rect = this.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                this.style.opacity = '0.5'; 
            });
            
            document.addEventListener('mousemove', function(e) {
                if (!isDragging) return;
                e.preventDefault();
                const newLeft = e.clientX - offsetX;
                const newBottom = window.innerHeight - (e.clientY - offsetY);
                
                const limitedLeft = Math.max(0, Math.min(window.innerWidth - watermarkDisplay.offsetWidth, newLeft));
                const limitedBottom = Math.max(0, Math.min(window.innerHeight - 10, newBottom));
             
                watermarkDisplay.style.left = limitedLeft + 'px';
                watermarkDisplay.style.bottom = limitedBottom + 'px';
                watermarkDisplay.style.transform = 'none'; 
            });
            
            document.addEventListener('mouseup', function() {
                if (!isDragging) return;
                isDragging = false;
                watermarkDisplay.style.opacity = '0.8'; 
                const position = {
                    bottom: watermarkDisplay.style.bottom,
                    left: watermarkDisplay.style.left
                };
                localStorage.setItem('watermarkPosition', JSON.stringify(position));
            });
            function updateWatermarkContent(text) {
                watermarkDisplay.innerHTML = '';
                if (text.includes('<') && text.includes('>')) {
                    try {
                        const tempDiv = document.createElement('div');
                        const svgRegex = /<svg[^>]*>.*?<\/svg>/si;
                        const pathRegex = /<path[^>]*>/gi;
                        let watermarkContainer = watermarkDisplay;
                        watermarkContainer.innerHTML = '';
                        
                        if (svgRegex.test(text)) {
                            const svgMatch = text.match(svgRegex);
                            const svgContent = svgMatch[0];
                            const svgIndex = text.indexOf(svgContent);
                            const textBeforeSvg = text.substring(0, svgIndex).trim();
                            const textAfterSvg = text.substring(svgIndex + svgContent.length).trim();
                            
                            if (textBeforeSvg) {
                                watermarkContainer.appendChild(document.createTextNode(textBeforeSvg));
                                watermarkContainer.appendChild(document.createTextNode(' '));
                            }
                            tempDiv.innerHTML = svgContent;
                            const svgElement = tempDiv.firstElementChild.cloneNode(true);
                            watermarkContainer.appendChild(svgElement);
                            if (textAfterSvg) {
                                watermarkContainer.appendChild(document.createTextNode(' '));
                                watermarkContainer.appendChild(document.createTextNode(textAfterSvg));
                            }
                        } 
                        else if (pathRegex.test(text) && !text.includes('<svg')) {
                            const pathMatches = text.match(pathRegex);
                            const pathsContent = pathMatches.join('');
                            const pathIndices = [];
                            let tempText = text;
                            let match;
                            while ((match = pathRegex.exec(text)) !== null) {
                                pathIndices.push({start: match.index, length: match[0].length});
                            }
                            if (pathIndices.length > 0) {
                                const firstPathIndex = pathIndices[0].start;
                                const lastPathIndex = pathIndices[pathIndices.length - 1].start + pathIndices[pathIndices.length - 1].length;
                                
                                const textBeforePath = text.substring(0, firstPathIndex).trim();
                                const textAfterPath = text.substring(lastPathIndex).trim();
                                
                                if (textBeforePath) {
                                    watermarkContainer.appendChild(document.createTextNode(textBeforePath));
                                    watermarkContainer.appendChild(document.createTextNode(' '));
                                }
                                const svgWrapper = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">${pathsContent}</svg>`;
                                tempDiv.innerHTML = svgWrapper;
                                const svgElement = tempDiv.firstElementChild.cloneNode(true);
                                watermarkContainer.appendChild(svgElement);
                                if (textAfterPath) {
                                    watermarkContainer.appendChild(document.createTextNode(' '));
                                    watermarkContainer.appendChild(document.createTextNode(textAfterPath));
                                }
                            }
                        }
                        if (watermarkContainer.children.length === 0 && !watermarkContainer.textContent.trim()) {
                            watermarkContainer.textContent = text;
                        }
                        
                        addDebugLog('SVG/HTML内容已成功解析并显示');
                    } catch (error) {
                        watermarkDisplay.textContent = text;
                        addDebugLog(`SVG/HTML解析失败: ${error.message}`);
                    }
                } else {
                    watermarkDisplay.textContent = text;
                }
            }
            function addDebugLog(message) {
                if (console && console.log) {
                    console.log(`[水印调试] ${message}`);
                }
            }
        })
document.addEventListener('DOMContentLoaded', function() {
    const scrollPanel = document.getElementById('scrollPanel');
    let scrollPanelVisible = false;
    document.addEventListener('keydown', function(event) {
        if ((event.key === 'c' || event.key === 'C') && !event.ctrlKey && !event.altKey && !event.shiftKey) {

            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.contentEditable === 'true')) {
                return;
            }
            
            event.preventDefault();
            if (scrollPanelVisible) {
                scrollPanel.classList.remove('visible');
                scrollPanelVisible = false;
            } else {
                scrollPanel.classList.add('visible');
                scrollPanelVisible = true;
            }
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    const miniPlayerToggle = document.getElementById('miniPlayerToggle');
    const savedMiniPlayerState = localStorage.getItem('showMiniPlayer') === 'true';
    if (miniPlayerToggle) {
        miniPlayerToggle.checked = savedMiniPlayerState;
        miniPlayerToggle.addEventListener('change', function() {
            const isEnabled = this.checked;
            localStorage.setItem('showMiniPlayer', isEnabled);
        });
    }
    function updateMiniPlayerState() {
        const currentSong = playlist[currentSongIndex];
        const songInfo = {
            name: currentSong ? currentSong.name : '暂无歌曲',
            artist: currentSong ? currentSong.artist || '未知的音乐人' : '未知的音乐人',
            cover: document.getElementById('coverImage') ? document.getElementById('coverImage').src : '',
            isPlaying: isPlaying,
            playMode: playMode ? playMode.value : 'list',
            currentTime: audioPlayer ? audioPlayer.currentTime : 0,
            duration: audioPlayer ? audioPlayer.duration || 0 : 0
        };
        let currentLyric = '';
        if (lyricsData && lyricsData.length > 0 && currentLyricIndex >= 0 && currentLyricIndex < lyricsData.length) {
            currentLyric = lyricsData[currentLyricIndex].text;
        }
        if (typeof window.require !== 'undefined') {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('update-mini-player', {
                songInfo: songInfo,
                currentLyric: currentLyric
            });
        }
    }
    if (audioPlayer) {
        audioPlayer.addEventListener('play', updateMiniPlayerState);
        audioPlayer.addEventListener('pause', updateMiniPlayerState);
        audioPlayer.addEventListener('timeupdate', updateMiniPlayerState);
        audioPlayer.addEventListener('loadedmetadata', updateMiniPlayerState);
    }
    if (playBtn) {
        playBtn.addEventListener('click', updateMiniPlayerState);
    }
    if (playMode) {
        playMode.addEventListener('change', updateMiniPlayerState);
    }
    const originalPlaySong = window.playSong;
    if (originalPlaySong) {
        window.playSong = function(idx) {
            originalPlaySong(idx);
            setTimeout(updateMiniPlayerState, 100);
        };
    }
    const originalUpdateLyrics = window.updateLyrics;
    if (originalUpdateLyrics) {
        window.updateLyrics = function() {
            originalUpdateLyrics();
            updateMiniPlayerState();
        };
    }
    if (typeof window.require !== 'undefined') {
        const { ipcRenderer } = window.require('electron');
        ipcRenderer.on('get-player-data', () => {
            updateMiniPlayerState();
        });
        ipcRenderer.on('player-control', (event, command, ...args) => {
            switch(command) {
                case 'toggle-play':
                    if (!audioPlayer.src) return;
                    
                    if (isPlaying) {
                        pauseSong();
                    } else {
                        audioPlayer.play();
                        playBtn.textContent = '⏸';
                        albumCover.classList.add('rotating');
                        isPlaying = true;
                        addDebugLog(`开始播放: ${playlist[currentSongIndex]?.name || '未知歌曲'}`);
                        updateMiniPlayerState();
                    }
                    break;
                case 'prev':
                    playPrevSong();
                    break;
                case 'next':
                    playNextSong();
                    break;
                case 'change-mode':
                    if (playMode) {
                        const modes = ['list', 'single', 'random'];
                        const currentIndex = modes.indexOf(playMode.value);
                        const nextIndex = (currentIndex + 1) % modes.length;
                        playMode.value = modes[nextIndex];
                        updateMiniPlayerState();
                    }
                    break;
            }
        });
    }
    window.addEventListener('beforeunload', function() {
        if (typeof window.require !== 'undefined') {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('main-window-closing');
        }
    });
});
