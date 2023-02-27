const { app, BrowserWindow } = require("electron");
const path = require("path");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  win.setResizable(false);
  win.loadFile("index.html");
  win.webContents.openDevTools(); // TODO: delete this - debug only!
};

// This will re-launch electron if we quit using Cmd/Ctrl-Q. Helps with reloading during development
app.relaunch();

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
