const { app, BrowserWindow, Menu } = require('electron');
  const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1090,
    height: 630,
    titleBarStyle: 'standard',
    webPreferences: {
   
      nodeIntegration: true
    },
    icon: path.join(__dirname, 'icons/icon.ico')
  });

  mainWindow.loadFile('index.html');
  Menu.setApplicationMenu(null);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
