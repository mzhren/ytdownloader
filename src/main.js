const { app, BrowserWindow, session, shell} = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 1800,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
      webviewTag: true,
      contextIsolation: false
  	}
  });
  win.loadFile('src/index.html');
  return win;
}

app.whenReady().then(() => {
    //handle link to my github
    const handleRedirect = (e, url) => {
        if (url !== e.sender.getURL()) {
            e.preventDefault();
            shell.openExternal(url);
        }
    }
    let win = createWindow();
    win.webContents.on('will-navigate', handleRedirect);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
})
