// 收藏功能管理
document.addEventListener('DOMContentLoaded', function() {
    // 初始化收藏列表
    let favorites = JSON.parse(localStorage.getItem('musicFavorites')) || [];
    
    // 保存收藏列表到本地存储
    function saveFavorites() {
        localStorage.setItem('musicFavorites', JSON.stringify(favorites));
    }
    
    // 添加歌曲到收藏
    window.addToFavorites = function(song) {
        // 检查是否已经收藏
        const isAlreadyFavorited = favorites.some(fav => fav.url === song.url);
        if (isAlreadyFavorited) {
            showTopRightToast('该歌曲已在收藏列表中');
            return;
        }
        
        // 添加到收藏列表
        favorites.push({
            name: song.name,
            url: song.url,
            artist: song.artist || '未知的音乐人',
            addedDate: new Date().toISOString()
        });
        
        // 保存到本地存储
        saveFavorites();
        
        // 更新收藏列表显示
        updateFavoritesDisplay();
        
        // 显示提示
        showTopRightToast(`已收藏: ${song.name}`);
    };
    
    // 从收藏中移除歌曲
    window.removeFromFavorites = function(songUrl) {
        favorites = favorites.filter(song => song.url !== songUrl);
        saveFavorites();
        updateFavoritesDisplay();
        showTopRightToast('已从收藏中移除');
    };
    
    // 获取收藏列表
    window.getFavorites = function() {
        return [...favorites];
    };
    
    // 检查歌曲是否已收藏
    window.isFavorited = function(songUrl) {
        return favorites.some(song => song.url === songUrl);
    };
    
    // 更新收藏列表显示
    function updateFavoritesDisplay() {
        const favoritesContainer = document.getElementById('favoritesContainer');
        if (!favoritesContainer) return;
        
        if (favorites.length === 0) {
            favoritesContainer.innerHTML = '<div class="no-favorites">暂无收藏的歌曲</div>';
            return;
        }
        
        const viewMode = document.getElementById('favoritesViewToggle').getAttribute('data-view') || 'grid';
        
        if (viewMode === 'grid') {
            renderGridView(favoritesContainer);
        } else {
            renderListView(favoritesContainer);
        }
    }
    
    // 网格视图渲染
    function renderGridView(container) {
        container.innerHTML = '';
        container.className = 'favorites-grid';
        
        favorites.forEach((song, index) => {
            const songCard = document.createElement('div');
            songCard.className = 'favorite-item';
            
            const songTitle = document.createElement('div');
            songTitle.className = 'song-title';
            songTitle.textContent = song.name;
            songCard.appendChild(songTitle);
            
            const songArtist = document.createElement('div');
            songArtist.className = 'song-artist';
            songArtist.textContent = song.artist;
            songCard.appendChild(songArtist);
            
            const songUrl = document.createElement('div');
            songUrl.className = 'song-url';
            songUrl.textContent = song.url;
            songCard.appendChild(songUrl);
            
            const addToPlaylistBtn = document.createElement('button');
            addToPlaylistBtn.className = 'add-to-playlist';
            addToPlaylistBtn.textContent = '添加到播放列表';
            addToPlaylistBtn.title = '添加到播放列表';
            addToPlaylistBtn.addEventListener('click', function() {
                // 检查歌曲是否已在播放列表中
                const isInPlaylist = window.playlist.some(playlistSong => playlistSong.url === song.url);
                if (isInPlaylist) {
                    showTopRightToast('该歌曲已在播放列表中');
                    return;
                }
                
                // 添加到播放列表
                window.playlist.push({
                    name: song.name,
                    url: song.url,
                    artist: song.artist,
                    cover: song.cover || '',
                    lyric: song.lyric || ''
                });
                
                // 更新播放列表显示
                window.updatePlaylist();
                window.renderSortableList();
                
                showTopRightToast(`已添加到播放列表: ${song.name}`);
            });
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-favorite';
            removeBtn.textContent = '✕';
            removeBtn.title = '从收藏中移除';
            removeBtn.addEventListener('click', function() {
                window.removeFromFavorites(song.url);
            });
            
            songCard.appendChild(addToPlaylistBtn);
            songCard.appendChild(removeBtn);
            container.appendChild(songCard);
        });
    }
    
    // 列表视图渲染
    function renderListView(container) {
        container.innerHTML = '';
        container.className = 'favorites-list';
        
        favorites.forEach((song, index) => {
            const songCard = document.createElement('div');
            songCard.className = 'favorite-item';
            
            // 创建歌曲信息容器
            const songInfo = document.createElement('div');
            songInfo.className = 'song-info';
            
            const songTitle = document.createElement('div');
            songTitle.className = 'song-title';
            songTitle.textContent = song.name;
            songInfo.appendChild(songTitle);
            
            const songArtist = document.createElement('div');
            songArtist.className = 'song-artist';
            songArtist.textContent = song.artist;
            songInfo.appendChild(songArtist);
            
            const songUrl = document.createElement('div');
            songUrl.className = 'song-url';
            songUrl.textContent = song.url;
            songInfo.appendChild(songUrl);
            
            songCard.appendChild(songInfo);
            
            // 创建操作按钮容器
            const songActions = document.createElement('div');
            songActions.className = 'song-actions';
            
            const addToPlaylistBtn = document.createElement('button');
            addToPlaylistBtn.className = 'add-to-playlist';
            addToPlaylistBtn.textContent = '添加到播放列表';
            addToPlaylistBtn.title = '添加到播放列表';
            addToPlaylistBtn.addEventListener('click', function() {
                // 检查歌曲是否已在播放列表中
                const isInPlaylist = window.playlist.some(playlistSong => playlistSong.url === song.url);
                if (isInPlaylist) {
                    showTopRightToast('该歌曲已在播放列表中');
                    return;
                }
                
                // 添加到播放列表
                window.playlist.push({
                    name: song.name,
                    url: song.url,
                    artist: song.artist,
                    cover: song.cover || '',
                    lyric: song.lyric || ''
                });
                
                // 更新播放列表显示
                window.updatePlaylist();
                window.renderSortableList();
                
                showTopRightToast(`已添加到播放列表: ${song.name}`);
            });
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-favorite';
            removeBtn.textContent = '✕';
            removeBtn.title = '从收藏中移除';
            removeBtn.addEventListener('click', function() {
                window.removeFromFavorites(song.url);
            });
            
            songActions.appendChild(addToPlaylistBtn);
            songActions.appendChild(removeBtn);
            songCard.appendChild(songActions);
            
            container.appendChild(songCard);
        });
    }
    
    // 切换视图模式
    window.toggleFavoritesView = function() {
        const toggle = document.getElementById('favoritesViewToggle');
        const currentView = toggle.getAttribute('data-view') || 'grid';
        const newView = currentView === 'grid' ? 'list' : 'grid';
        
        toggle.setAttribute('data-view', newView);
        toggle.innerHTML = newView === 'grid' ? 
            '<i class="fa fa-th-large" aria-hidden="true"></i> 网格视图' : 
            '<i class="fa fa-list" aria-hidden="true"></i> 列表视图';
        
        updateFavoritesDisplay();
    };
    
    // 更新播放列表中的收藏按钮状态
    window.updateFavoriteButtons = function() {
        const playlistItems = document.querySelectorAll('.playlist-item');
        playlistItems.forEach((item, index) => {
            if (window.playlist[index]) {
                const song = window.playlist[index];
                const favoriteBtn = item.querySelector('.favorite-btn');
                
                if (favoriteBtn) {
                    const isFavorited = window.isFavorited(song.url);
                    favoriteBtn.innerHTML = isFavorited ? '❤' : '♡';
                    favoriteBtn.title = isFavorited ? '取消收藏' : '收藏';
                    favoriteBtn.className = isFavorited ? 'favorite-btn favorited' : 'favorite-btn';
                }
            }
        });
    };
    window.initFavoritesPage = function() {
        // 获取视图切换按钮
        const viewToggle = document.getElementById('favoritesViewToggle');
        if (viewToggle) {
            viewToggle.addEventListener('click', window.toggleFavoritesView);
        }
        
        // 获取收藏容器
        const favoritesContainer = document.getElementById('favoritesContainer');
        
        // 添加导入导出按钮事件监听
        const importBtn = document.getElementById('importFavoritesBtn');
        const exportBtn = document.getElementById('exportFavoritesBtn');
        
        if (importBtn) {
            importBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                window.importFavorites();
            });
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                window.exportFavorites();
            });
        }
        
        // 更新收藏列表显示
        updateFavoritesDisplay();
    };
    
    // 导出收藏列表
    window.exportFavorites = function() {
        if (favorites.length === 0) {
            showTopRightToast('收藏列表为空');
            return;
        }
        
        const dataStr = JSON.stringify(favorites, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `music-favorites-${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showTopRightToast('收藏列表已导出');
    };
    
    // 导入收藏列表
    window.importFavorites = function() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const importData = JSON.parse(ev.target.result);
                    let songList = [];
                    
                    if (importData.songs && Array.isArray(importData.songs)) {
                        songList = importData.songs;
                    } else if (Array.isArray(importData)) {
                        songList = importData;
                    } else {
                        throw new Error('无效的收藏文件格式！请确保是JSON格式的歌曲列表。');
                    }
                    
                    const importedSongs = songList.map(song => ({
                        name: song.name || song.title || '未知歌曲',
                        url: song.url || '',
                        artist: song.artist || '未知的音乐人',
                        cover: song.cover || '',
                        lyric: song.lyric || '',
                        addedDate: new Date().toISOString()
                    })).filter(song => song.url && song.url.trim() !== '');
                    
                    if (importedSongs.length === 0) {
                        throw new Error('没有找到有效的歌曲URL');
                    }
                    
                    // 合并收藏列表，避免重复
                    importedSongs.forEach(importedSong => {
                        if (!window.isFavorited(importedSong.url)) {
                            favorites.push(importedSong);
                        }
                    });
                    
                    saveFavorites();
                    updateFavoritesDisplay();
                    
                    showTopRightToast(`成功导入 ${importedSongs.length} 首歌曲到收藏！`);
                    
                } catch (error) {
                    showTopRightToast(`导入失败：${error.message}`);
                    console.error('导入收藏错误:', error);
                }
            };
            
            reader.readAsText(file);
        });
        fileInput.click();
    };
    
    // 在页面加载完成后初始化收藏功能
    document.addEventListener('DOMContentLoaded', function() {
        // 初始化收藏页面
        window.initFavoritesPage();
    });
});