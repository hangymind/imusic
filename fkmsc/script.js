document.addEventListener('DOMContentLoaded', function() {
    // 依旧DOM元素
    const playBtn = document.getElementById('play-btn');
    const resetBtn = document.getElementById('reset-btn');
    const exportBtn = document.getElementById('export-btn');
    const tempoSlider = document.getElementById('tempo-slider');
    const tempoValue = document.getElementById('tempo-value');
    const keyboardStatus = document.getElementById('keyboard-status');
    const tracks = document.querySelectorAll('.track');
    const drumSamples = {
        kick: 'kick.wav',
        clap: 'clap.wav',
        'closed-hat': 'hat.wav',
        'open-hat': 'bbl.wav'
    };
    const audioCache = {};
    let isPlaying = false;
    let currentStep = 0;
    let stepInterval;
    const totalSteps = 16;
    let keyboardEnabled = false;
    tracks.forEach(track => {
        const stepsContainer = track.querySelector('.steps');
        for (let i = 0; i < totalSteps; i++) {
            const step = document.createElement('div');
            step.classList.add('step');
            step.dataset.step = i;
            step.addEventListener('click', () => {
                step.classList.toggle('active');
            });
            stepsContainer.appendChild(step);
        }
    });
    function initAudioCache() {
        for (const [instrument, url] of Object.entries(drumSamples)) {
            audioCache[instrument] = new Audio(url);
            audioCache[instrument].preload = 'auto';
        }
    }
    initAudioCache();
    function playSound(instrument) {
        if (Object.keys(audioCache).length === 0) {
            initAudioCache();
        }
        if (audioCache[instrument]) {
            const audio = audioCache[instrument].cloneNode();
            audio.volume = 0.5; 
            audio.play().catch(error => {
                console.error('播放音频失败:', error);
            });
        } else {
            console.warn('没有找到该乐器的音频样本:', instrument);
        }
    }
    function updateStepDisplay() {
        tracks.forEach(track => {
            const steps = track.querySelectorAll('.step');
            steps.forEach(step => {
                const stepIndex = parseInt(step.dataset.step);
                if (stepIndex === currentStep) {
                    step.style.boxShadow = '0 0 5px #fff';
                } else {
                    step.style.boxShadow = 'none';
                }
            });
        });
    }
    function playCurrentStep() {
        tracks.forEach(track => {
            const instrument = track.dataset.instrument;
            const steps = track.querySelectorAll('.step');
            const currentStepElement = steps[currentStep];
            
            if (currentStepElement.classList.contains('active')) {
                playSound(instrument);
            }
        });
        
        updateStepDisplay();
        currentStep = (currentStep + 1) % totalSteps;
    }
    function togglePlayback() {
        if (isPlaying) {
            clearInterval(stepInterval);
            playBtn.textContent = '播放';
        } else {
            const tempo = parseInt(tempoSlider.value);
            const intervalTime = 60000 / (tempo * 4); 
            stepInterval = setInterval(playCurrentStep, intervalTime);
            playBtn.textContent = '暂停';
        }
        isPlaying = !isPlaying;
    }
    function resetSequencer() {
        clearInterval(stepInterval);
        isPlaying = false;
        currentStep = 0;
        playBtn.textContent = '播放';
        updateStepDisplay();
    }
    function exportToMp3() {
        alert('正在生成MP3文件，请稍候...');
        let audioContext;
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
        } catch (error) {
            console.error('创建AudioContext失败:', error);
            alert('无法初始化音频系统，请重试。');
            return;
        }
        const tempo = parseInt(tempoSlider.value);
        const intervalTime = 60000 / (tempo * 4); 
        
        const duration = totalSteps * intervalTime / 1000; 
        const bufferLength = Math.ceil(audioContext.sampleRate * duration);
        const audioBuffer = audioContext.createBuffer(1, bufferLength, audioContext.sampleRate);
        const channelData = audioBuffer.getChannelData(0);
        
        loadAndMixAudioFiles(tempo, audioContext, channelData).then(() => {
            console.log('音频混合完成，开始转换MP3');
            return convertBufferToMp3(audioBuffer);
        }).then(mp3Blob => {
            console.log('MP3转换完成，准备下载');
            const url = URL.createObjectURL(mp3Blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `节奏_${tempo}BPM.mp3`;
            document.body.appendChild(a);
            setTimeout(() => {
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                    audioContext.close();
                    alert('MP3文件导出成功！');
                }, 100);
            }, 100);
        }).catch(error => {
            console.error('导出过程出错:', error);
            if (error.name === 'NetworkError' || error.message.includes('fetch')) {
                alert('音频文件加载失败，请确保所有WAV文件存在并且浏览器有权限访问它们。\n建议：使用本地HTTP服务器运行本应用。');
            } else if (error.message.includes('lamejs')) {
                alert('MP3编码库加载失败，请检查网络连接。');
            } else {
                alert('导出失败，请重试。错误信息：' + error.message);
            }
            audioContext.close();
        });
    }
    async function loadAndMixAudioFiles(tempo, audioContext, channelData) {
        const intervalTime = 60000 / (tempo * 4);
        const sampleRate = audioContext.sampleRate;
        const audioBuffers = {};
        const loadPromises = [];
        for (const [instrument, url] of Object.entries(drumSamples)) {
            console.log(`尝试加载音频文件: ${instrument} - ${url}`);
            const loadPromise = fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`无法加载音频文件 ${url}，状态码: ${response.status}`);
                    }
                    return response.arrayBuffer();
                })
                .then(arrayBuffer => {
                    console.log(`成功加载音频文件: ${url}`);
                    return audioContext.decodeAudioData(arrayBuffer);
                })
                .then(buffer => {
                    console.log(`成功解码音频文件: ${url}`);
                    audioBuffers[instrument] = buffer;
                })
                .catch(error => {
                    console.error(`加载音频文件失败 ${instrument} (${url}):`, error);
                    throw new Error(`加载${getInstrumentDisplayName(instrument)}音频失败: ${error.message}\n\n提示: 直接通过文件系统打开HTML可能会有安全限制，请使用本地HTTP服务器。`);
                });
            
            loadPromises.push(loadPromise);
        }
        await Promise.all(loadPromises);
        
        console.log('所有音频文件加载完成，开始混合音频');
        tracks.forEach(track => {
            const instrument = track.dataset.instrument;
            const steps = track.querySelectorAll('.step');
            
            steps.forEach((step, stepIndex) => {
                if (step.classList.contains('active') && audioBuffers[instrument]) {
                    const startTimeInSeconds = (stepIndex * intervalTime) / 1000;
                    const startOffset = Math.floor(startTimeInSeconds * sampleRate);
                    const sourceBuffer = audioBuffers[instrument];
                    const sourceData = sourceBuffer.getChannelData(0);
                    for (let i = 0; i < sourceData.length; i++) {
                        const bufferIndex = startOffset + i;
                        if (bufferIndex < channelData.length) {
                            channelData[bufferIndex] += sourceData[i] * 0.5;
                            if (channelData[bufferIndex] > 1) channelData[bufferIndex] = 1;
                            if (channelData[bufferIndex] < -1) channelData[bufferIndex] = -1;
                        }
                    }
                }
            });
        });
        
        console.log('音频混合完成');
    }
    function getInstrumentDisplayName(instrument) {
        const displayNames = {
            'kick': '底鼓',
            'clap': '掌声',
            'closed-hat': '闭镲',
            'open-hat': '泡泡'
        };
        return displayNames[instrument] || instrument;
    }
    function convertBufferToMp3(audioBuffer) {
        return new Promise((resolve, reject) => {
            try {
                const sampleRate = audioBuffer.sampleRate;
                const channels = audioBuffer.numberOfChannels;
                const encoder = new lamejs.Mp3Encoder(channels, sampleRate, 128); 
                const buffer = [];
                const samplesPerFrame = 1152;
                const wavData = convertFloat32ToInt16(audioBuffer.getChannelData(0));
                for (let i = 0; i < wavData.length; i += samplesPerFrame) {
                    const chunk = wavData.subarray(i, i + samplesPerFrame);
                    const mp3buf = encoder.encodeBuffer(chunk);
                    if (mp3buf.length > 0) {
                        buffer.push(new Int8Array(mp3buf));
                    }
                }
                const mp3buf = encoder.flush();
                if (mp3buf.length > 0) {
                    buffer.push(new Int8Array(mp3buf));
                }
                let totalLength = 0;
                for (let i = 0; i < buffer.length; i++) {
                    totalLength += buffer[i].length;
                }
                
                const result = new Int8Array(totalLength);
                let offset = 0;
                for (let i = 0; i < buffer.length; i++) {
                    result.set(buffer[i], offset);
                    offset += buffer[i].length;
                }
                resolve(new Blob([result], { type: 'audio/mpeg' }));
            } catch (error) {
                reject(error);
            }
        });
    }
    function convertFloat32ToInt16(buffer) {
        const len = buffer.length;
        const output = new Int16Array(len);
        for (let i = 0; i < len; i++) {
            const s = Math.max(-1, Math.min(1, buffer[i]));
            output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        return output;
    }
    function toggleKeyboardControl() {
        keyboardEnabled = !keyboardEnabled;
        keyboardStatus.textContent = keyboardEnabled ? 'ON' : 'OFF';
        keyboardStatus.style.color = keyboardEnabled ? '#4a90e2' : '#aaa';
    }
    playBtn.addEventListener('click', togglePlayback);
    resetBtn.addEventListener('click', resetSequencer);
    exportBtn.addEventListener('click', exportToMp3);
    tempoSlider.addEventListener('input', function() {
        tempoValue.textContent = this.value;
        if (isPlaying) {
            clearInterval(stepInterval);
            const intervalTime = 60000 / (parseInt(this.value) * 4);
            stepInterval = setInterval(playCurrentStep, intervalTime);
        }
    });
    document.querySelector('.keyboard-toggle').addEventListener('click', toggleKeyboardControl);
    
    document.addEventListener('keydown', function(e) {
        if (!keyboardEnabled) return;
        
        switch (e.key.toLowerCase()) {
            case '1':
                playSound('kick');
                break;
            case '2':
                playSound('clap');
                break;
            case '3':
                playSound('closed-hat');
                break;
            case '4':
                playSound('open-hat');
                break;
        }
    });
    updateStepDisplay();
});