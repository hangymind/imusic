// 导出歌单功能
document.getElementById('exportPlaylistBtn').addEventListener('click', exportPlaylist);

function exportPlaylist() {
    if (playlist.length === 0) {
        alert('播放列表为空，无法导出！');
        return;
    }
    const exportData = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        playlistName: 'Imusic 播放列表',
        songs: playlist.map((song, index) => ({
            id: index,
            name: song.name,
            url: song.url,
            cover: document.getElementById('coverImage').src || '',
            order: index + 1
        }))
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Imusic_歌单_${new Date().toLocaleDateString().replace(/\//g, '-')}.json`;
    document.body.appendChild(a);
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}
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
                if (!importData.songs || !Array.isArray(importData.songs)) {
                    throw new Error('无效的歌单文件格式！');
                }
                const importedSongs = importData.songs.map(song => ({
                    name: song.name || '未知歌曲',
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