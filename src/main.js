const { app, BrowserWindow, crashReporter } = require("electron");
const { systemPreferences } = require("electron");
// crashReporter.start();
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

const access = systemPreferences.getMediaAccessStatus("camera");
if (access != "granted") {
  systemPreferences.askForMediaAccess("camera");
}

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != "darwin") {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", function () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 540,
    height: 360,
    frame: false,
    resizable: true,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true, // is default value after Electron v5
      contextIsolation: false, // protect against prototype pollution
    },
  });

  require("@electron/remote/main").enable(mainWindow.webContents);
  require("@electron/remote/main").initialize();

  // and load the index.html of the app.
  mainWindow.loadURL("file://" + __dirname + "/index.html");

  // Open the DevTools.
  // mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on("closed", function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});
