
function getTargetDate() {
  const savedTargetDate = getSetting('targetDate', '2028-06-10');
  return new Date(savedTargetDate + 'T00:00:00');
}

let targetDate = getTargetDate();
const daysCountElement = document.getElementById('daysCount');
const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');
const settingsOption = document.getElementById('settingsOption');
const aboutOption = document.getElementById('aboutOption');// 获取设置面板元素
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsButton = document.getElementById('closeSettings');
const alwaysOnTopCheckbox = document.getElementById('alwaysOnTop');
const autoStartCheckbox = document.getElementById('autoStart');
const showPreciseTimeCheckbox = document.getElementById('showPreciseTime');
const fixedPositionCheckbox = document.getElementById('fixedPosition');
const backgroundOpacitySlider = document.getElementById('backgroundOpacity');
const fontColorPicker = document.getElementById('fontColor');
const rainbowModeCheckbox = document.getElementById('rainbowMode');
let rainbowAnimationId = null;

const { ipcRenderer } = window.nodeRequire('electron');

// 固定起始日期：2025年9月1日
const startDate = new Date('2025-09-01T00:00:00');
const targetDateInput = document.getElementById('targetDate');
function updateTargetDate() {
  const newTargetDate = targetDateInput.value;
  setSetting('targetDate', newTargetDate);
  targetDate = new Date(newTargetDate + 'T00:00:00');
  updateTitle();
  updateCountdown();
}
function updateTitle() {
  const titleElement = document.querySelector('.title');
  if (titleElement) {
    titleElement.textContent = `距离${targetDate.getFullYear()}年${targetDate.getMonth() + 1}月${targetDate.getDate()}日还有`;
  }
}
function getSetting(key, defaultValue) {
  const value = localStorage.getItem(`countdown_${key}`);
  if (value === null) return defaultValue;
  if (typeof defaultValue === 'boolean') {
    return value === 'true';
  }
  return value;
}
function setSetting(key, value) {
  localStorage.setItem(`countdown_${key}`, value);
}
function updateAlwaysOnTop() {
  const isAlwaysOnTop = alwaysOnTopCheckbox.checked;
  console.log('更新窗口置顶设置:', isAlwaysOnTop);
  setSetting('alwaysOnTop', isAlwaysOnTop);
  ipcRenderer.send('update-settings', {
    alwaysOnTop: isAlwaysOnTop
  });
}
function updateAutoStart() {
  const isAutoStart = autoStartCheckbox.checked;
  setSetting('autoStart', isAutoStart);
  ipcRenderer.send('update-settings', {
    autoStart: isAutoStart
  });
}
function updateShowPreciseTime() {
  const isShowPreciseTime = showPreciseTimeCheckbox.checked;
  setSetting('showPreciseTime', isShowPreciseTime);
  updateCountdown();
}

function updateRainbowMode() {
  const isRainbowMode = rainbowModeCheckbox.checked;
  setSetting('rainbowMode', isRainbowMode);
  updateFontColor();
}
let previousTimeValues = {
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  percentage: 0
};
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function updateCountdown() {
  const now = new Date();
  const timeDiff = targetDate.getTime() - now.getTime();
  const showPreciseTime = getSetting('showPreciseTime', true);
  
  let currentTimeValues = {};
  
  if (showPreciseTime) {
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    currentTimeValues = {
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds
    };
    animateTimeValues(currentTimeValues);
  } else {
    const days = Math.round(timeDiff / (1000 * 60 * 60 * 24));
    currentTimeValues.days = days;
    if (previousTimeValues.days !== currentTimeValues.days) {
      daysCountElement.innerHTML = `<span class="time-value changed">${days}</span><span class="time-unit day">Day</span>`;
    } else {
      daysCountElement.innerHTML = `<span class="time-value">${days}</span><span class="time-unit day">Day</span>`;
    }
  }
  const totalTime = targetDate.getTime() - startDate.getTime();
  const elapsedTime = now.getTime() - startDate.getTime();
  const progressPercentage = Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
  animateProgressBar(progressPercentage);
  previousTimeValues = {...currentTimeValues, percentage: progressPercentage};
}
function animateTimeValues(targetValues) {
  const startTime = Date.now();
  const duration = 500; // 动画持续时间
  
  const initialValues = {
    days: previousTimeValues.days,
    hours: previousTimeValues.hours,
    minutes: previousTimeValues.minutes,
    seconds: previousTimeValues.seconds
  };
  const changedValues = {
    days: initialValues.days !== targetValues.days,
    hours: initialValues.hours !== targetValues.hours,
    minutes: initialValues.minutes !== targetValues.minutes,
    seconds: initialValues.seconds !== targetValues.seconds
  };
  
  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    const currentDays = initialValues.days + (targetValues.days - initialValues.days) * easedProgress;
    const currentHours = initialValues.hours + (targetValues.hours - initialValues.hours) * easedProgress;
    const currentMinutes = initialValues.minutes + (targetValues.minutes - initialValues.minutes) * easedProgress;
    const currentSeconds = initialValues.seconds + (targetValues.seconds - initialValues.seconds) * easedProgress;
    
    let htmlString = '';
    if (changedValues.days) {
      htmlString += `<span class="time-value changed">${Math.floor(currentDays)}</span>`;
    } else {
      htmlString += `<span class="time-value">${Math.floor(currentDays)}</span>`;
    }
    htmlString += `<span class="time-unit day">Day</span>`;
    htmlString += `<span class="time-value ${changedValues.hours ? 'changed' : ''}">${Math.floor(currentHours).toString().padStart(2, '0')}</span>`;
    htmlString += `<span class="time-separator">:</span>`;
    htmlString += `<span class="time-value ${changedValues.minutes ? 'changed' : ''}">${Math.floor(currentMinutes).toString().padStart(2, '0')}</span>`;
    htmlString += `<span class="time-separator">:</span>`;
    htmlString += `<span class="time-value ${changedValues.seconds ? 'changed' : ''}">${Math.floor(currentSeconds).toString().padStart(2, '0')}</span>`;
    htmlString += `<span class="time-unit"></span>`;
    daysCountElement.innerHTML = htmlString;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      let finalHtmlString = '';
      finalHtmlString += `<span class="time-value">${targetValues.days}</span>`;
      finalHtmlString += `<span class="time-unit day">Day</span>`;
      finalHtmlString += `<span class="time-value">${targetValues.hours.toString().padStart(2, '0')}</span>`;
      finalHtmlString += `<span class="time-separator">:</span>`;
      finalHtmlString += `<span class="time-value">${targetValues.minutes.toString().padStart(2, '0')}</span>`;
      finalHtmlString += `<span class="time-separator">:</span>`;
      finalHtmlString += `<span class="time-value">${targetValues.seconds.toString().padStart(2, '0')}</span>`;
      finalHtmlString += `<span class="time-unit"></span>`;
      
      daysCountElement.innerHTML = finalHtmlString;
      const changedElements = daysCountElement.querySelectorAll('.time-value.changed');
      changedElements.forEach(el => {
      });
    }
  }
  
  requestAnimationFrame(update);
}
function animateProgressBar(targetPercentage) {
  const startTime = Date.now();
  const duration = 800; 
  const startPercentage = previousTimeValues.percentage;
  
  function update() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(progress);
    const currentPercentage = startPercentage + (targetPercentage - startPercentage) * easedProgress;
    
    const progressFillElement = document.getElementById('progressFill');
    if (progressFillElement) {
      progressFillElement.style.width = `${currentPercentage}%`;
    }
    const percentageElement = document.getElementById('percentage');
    if (percentageElement) {
      percentageElement.textContent = `${currentPercentage.toFixed(2)}%`;
    }
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      if (progressFillElement) {
        progressFillElement.style.width = `${targetPercentage}%`;
      }
      if (percentageElement) {
        percentageElement.textContent = `${targetPercentage.toFixed(2)}%`;
      }
    }
  }
  
  requestAnimationFrame(update);
}
function animateValue(element, start, end, duration, isDays = false) {
  if (start === end) return;
  
  const range = end - start;
  let current = start;
  const increment = range / (duration / 16); 
  const startTime = Date.now();
  
  const timer = setInterval(function() {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    current = start + range * easeProgress;
    
    if (progress >= 1) {
      clearInterval(timer);
      current = end;
    }
    
    if (isDays) {
      element.textContent = current.toFixed(2);
    } else {
      element.textContent = String(Math.round(current)).padStart(3, '0');
    }
    if (element.id === 'daysCount') {
      const now = new Date();
      const totalTime = targetDate.getTime() - startDate.getTime();
      const elapsedTime = now.getTime() - startDate.getTime();
      const progressPercentage = Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
      const progressFillElement = document.getElementById('progressFill');
      if (progressFillElement) {
        progressFillElement.style.width = `${progressPercentage}%`;
      }
      const percentageElement = document.getElementById('percentage');
      if (percentageElement) {
        percentageElement.textContent = `${progressPercentage.toFixed(2)}%`;
      }
    }
  }, 16); 
}
function updateBackgroundOpacity() {
  const opacityValue = backgroundOpacitySlider.value / 100;
  document.body.style.backgroundColor = `rgba(0, 0, 0, ${opacityValue})`;
}
function updateFontColor() {
  const isRainbowMode = getSetting('rainbowMode', false);
  
  if (isRainbowMode) {
    startRainbowAnimation();
    return;
  } else {
    stopRainbowAnimation();
  }
  
  let colorValue = '#ffffff'; 
  
  if (fontColorPicker) {
    colorValue = fontColorPicker.value;
  } else {
    colorValue = getSetting('fontColor', '#ffffff');
  }
  
  const daysCountElement = document.getElementById('daysCount');
  const titleElement = document.querySelector('.title');
  const percentageElement = document.getElementById('percentage');
  
  if (daysCountElement) daysCountElement.style.color = colorValue;
  if (titleElement) titleElement.style.color = colorValue;
  if (percentageElement) percentageElement.style.color = colorValue;
  const settingLabels = document.querySelectorAll('.setting-label');
  settingLabels.forEach(label => {
    label.style.color = colorValue;
  });
}

function startRainbowAnimation() {
  if (rainbowAnimationId) return;
  
  let hue = 0;
  
  function animate() {
    hue = (hue + 1) % 360;
    const color = `hsl(${hue}, 100%, 50%)`;
    
    const daysCountElement = document.getElementById('daysCount');
    const titleElement = document.querySelector('.title');
    const percentageElement = document.getElementById('percentage');
    
    if (daysCountElement) daysCountElement.style.color = color;
    if (titleElement) titleElement.style.color = color;
    if (percentageElement) percentageElement.style.color = color;
    
    const settingLabels = document.querySelectorAll('.setting-label');
    settingLabels.forEach(label => {
      label.style.color = color;
    });
    
    rainbowAnimationId = requestAnimationFrame(animate);
  }
  
  animate();
}

function stopRainbowAnimation() {
  if (rainbowAnimationId) {
    cancelAnimationFrame(rainbowAnimationId);
    rainbowAnimationId = null;
  }
}
function toggleMenu() {
  menu.classList.toggle('hidden');
}
function handleClickOutside(event) {
  if (!menu.contains(event.target) && !menuButton.contains(event.target)) {
    menu.classList.add('hidden');
  }
}
function handleSettingsClick(event) {
  event.preventDefault();
  menu.classList.add('hidden');
  showSettingsPanel();
}
function showSettingsPanel() {
  alwaysOnTopCheckbox.checked = getSetting('alwaysOnTop', false);
  autoStartCheckbox.checked = getSetting('autoStart', false);
  showPreciseTimeCheckbox.checked = getSetting('showPreciseTime', true);
  fixedPositionCheckbox.checked = getSetting('fixedPosition', false);
  const savedBackgroundOpacity = getSetting('backgroundOpacity', 95);
  backgroundOpacitySlider.value = savedBackgroundOpacity;
  
  const savedFontColor = getSetting('fontColor', '#ffffff');
  if (fontColorPicker) {
    fontColorPicker.value = savedFontColor;
  }
  
  // 初始化彩虹模式
  rainbowModeCheckbox.checked = getSetting('rainbowMode', false);
  
  const savedTargetDate = getSetting('targetDate', '2028-06-10');
  if (targetDateInput) {
    targetDateInput.value = savedTargetDate;
  }
  
  updateBackgroundOpacity();
  updateFontColor();
  const body = document.body;
  if (fixedPositionCheckbox.checked) {
    body.classList.add('fixed-position');
  } else {
    body.classList.remove('fixed-position');
  }
  settingsPanel.classList.remove('hidden');
}
function hideSettingsPanel() {
  settingsPanel.classList.add('hidden');
}
function saveAllSettings() {
  updateAlwaysOnTop();
  updateAutoStart();
  updateShowPreciseTime();
  setSetting('fixedPosition', fixedPositionCheckbox.checked);
  setSetting('backgroundOpacity', backgroundOpacitySlider.value);
  setSetting('fontColor', fontColorPicker.value);
  setSetting('rainbowMode', rainbowModeCheckbox.checked);
  if (targetDateInput) {
    setSetting('targetDate', targetDateInput.value);
    targetDate = new Date(targetDateInput.value + 'T00:00:00');
    updateTitle();
  }
}
function handleAboutClick(event) {
  event.preventDefault();
  menu.classList.add('hidden');
  alert('这个地方是关于，我懒得写ui，用这个凑活一下。\n我知道各位新高一最喜欢高考了(bushi，不仅是人生的进步，更是为了达成一些久违的愿望。我不妨来猜想一下，当实现它的那一刻，也许是留住了童年，或是为童年的臆想留下了能回忆的影子\n软件制作:iw46\n©iw46Team 2025，保留所有权利。');
}
function initApp() {
  updateTitle(); // 初始化标题
  updateFontColor(); // 初始化字体颜色（包括彩虹模式）
  updateCountdown();
  setInterval(updateCountdown, 1000);
  const savedBackgroundOpacity = getSetting('backgroundOpacity', 95);
  const backgroundOpacitySlider = document.getElementById('backgroundOpacity');
  if (backgroundOpacitySlider) {
    backgroundOpacitySlider.value = savedBackgroundOpacity;
  }
  updateBackgroundOpacity();
  const savedFontColor = getSetting('fontColor', '#ffffff');
  const fontColorPicker = document.getElementById('fontColor');
  if (fontColorPicker) {
    fontColorPicker.value = savedFontColor;
  }
  if (savedFontColor) {
    const daysCountElement = document.getElementById('daysCount');
    const titleElement = document.querySelector('.title');
    const percentageElement = document.getElementById('percentage');
    
    if (daysCountElement) daysCountElement.style.color = savedFontColor;
    if (titleElement) titleElement.style.color = savedFontColor;
    if (percentageElement) percentageElement.style.color = savedFontColor;
  }
  const fixedPosition = getSetting('fixedPosition', false);
  const body = document.body;
  if (fixedPosition) {
    body.classList.add('fixed-position');
  } else {
    body.classList.remove('fixed-position');
  }
  menuButton.addEventListener('click', toggleMenu);
  settingsOption.addEventListener('click', handleSettingsClick);
  aboutOption.addEventListener('click', handleAboutClick);
  closeSettingsButton.addEventListener('click', function() {
    saveAllSettings();
    hideSettingsPanel();
  });
  alwaysOnTopCheckbox.addEventListener('change', updateAlwaysOnTop);
  autoStartCheckbox.addEventListener('change', updateAutoStart);
  showPreciseTimeCheckbox.addEventListener('change', updateShowPreciseTime);
  fixedPositionCheckbox.addEventListener('change', () => {
    setSetting('fixedPosition', fixedPositionCheckbox.checked);
    const body = document.body;
    if (fixedPositionCheckbox.checked) {
      body.classList.add('fixed-position');
      ipcRenderer.send('update-settings', {
        fixedPosition: true
      });
    } else {
      body.classList.remove('fixed-position');
      ipcRenderer.send('update-settings', {
        fixedPosition: false
      });
    }
  });

  backgroundOpacitySlider.addEventListener('input', () => {
    setSetting('backgroundOpacity', backgroundOpacitySlider.value);
    updateBackgroundOpacity();
  });

  fontColorPicker.addEventListener('input', () => {
    setSetting('fontColor', fontColorPicker.value);
    updateFontColor();
  });
  
  // 彩虹模式事件监听
  rainbowModeCheckbox.addEventListener('change', updateRainbowMode);
  
  // 目标日期输入框事件监听
  if (targetDateInput) {
    targetDateInput.addEventListener('change', updateTargetDate);
  }
  
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('click', function(event) {
    if (!settingsPanel.contains(event.target) && 
        !settingsOption.contains(event.target) &&
        !settingsPanel.classList.contains('hidden')) {
      saveAllSettings();
      hideSettingsPanel();
    }
  });
}
document.addEventListener('DOMContentLoaded', initApp);