// 导出歌单功能 -由豆包ai自行管理
window.exportPlaylist = function() {
    try {
        console.log('导出歌单函数被调用');
        const currentPlaylist = window.playlist || [];
        console.log('当前播放列表:', currentPlaylist);
        
        if (!currentPlaylist || currentPlaylist.length === 0) {
            alert('播放列表为空，无法导出！');
            return;
        }
        const exportData = currentPlaylist.map(song => ({
            title: song.title || '未知标题',
            artist: song.artist || '未知艺术家',
            url: song.url || '',
            cover: song.cover || '',
            lyric: song.lyric || ''
        }));
        const jsonStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `歌单_${new Date().toLocaleDateString()}.json`;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
    } catch (error) {
        console.error('导出歌单出错:', error);
        alert('导出歌单时发生错误，请查看控制台获取详细信息。');
    }
};
document.addEventListener('DOMContentLoaded', function() {
    const exportBtn = document.getElementById('exportPlaylistBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            window.exportPlaylist();
        });
    }
});
document.getElementById('importPlaylistBtn').addEventListener('click', () => {
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
                    throw new Error('无效的歌单文件格式！请确保是JSON格式的歌曲列表。');
                }
                
                const importedSongs = songList.map(song => ({
                    name: song.name || song.title || '未知歌曲',
                    url: song.url || ''
                })).filter(song => song.url && song.url.trim() !== ''); 
                
                if (importedSongs.length === 0) {
                    alert('导入的歌单中没有有效的歌曲！');
                    return;
                }
                if (playlist.length > 0 && confirm('是否清空现有播放列表？\n点击"确定"清空并导入，点击"取消"追加到现有列表。')) {
                    playlist = importedSongs;
                    currentSongIndex = 0;
                    if (playlist.length > 0) {
                        audioPlayer.src = playlist[0].url;
                        document.getElementById('songTitle').textContent = playlist[0].name;
                        isPlaying = false;
                        playBtn.textContent = '▶';
                        albumCover.classList.remove('rotating');
                    }
                } else {
                    playlist = [...playlist, ...importedSongs];
                    if (importedSongs.length > 0) {
                        currentSongIndex = playlist.length - importedSongs.length;
                        audioPlayer.src = playlist[currentSongIndex].url;
                        document.getElementById('songTitle').textContent = playlist[currentSongIndex].name;
                        isPlaying = false;
                        playBtn.textContent = '▶';
                        albumCover.classList.remove('rotating');
                    }
                }
                const hasLocalPaths = playlist.some(song => 
                    song.url.startsWith('file://') || 
                    /^[a-zA-Z]:\\|^\\\\/.test(song.url)
                );
                
                if (hasLocalPaths) {
                    alert('注意：浏览器出于安全限制，可能无法直接播放本地文件路径的音乐。\n建议使用"添加URL"功能或重新上传音乐文件。');
                }
                updatePlaylist();
                renderSortableList();
                
                alert(`成功导入 ${importedSongs.length} 首歌曲！`);
                
            } catch (error) {
                alert(`导入失败：${error.message}`);
                console.error('导入歌单错误:', error);
            }
        };
        
        reader.readAsText(file);
    });
    fileInput.click();
});