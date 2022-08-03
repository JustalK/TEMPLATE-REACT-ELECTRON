import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as url from 'url';

let win: BrowserWindow, serve: boolean, ext_install: boolean;
const args = process.argv.slice(1);
serve = args.some((val) => val === '--serve');
ext_install = args.some((val) => val === '--ext-install');

const createWindow = async () => {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: path.join(
        __dirname,
        '/../../../',
        'node_modules',
        '.bin',
        'electron'
      ),
      hardResetMethod: 'exit',
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(
      url.format({
        pathname: path.join(
          __dirname,
          '/../../../',
          'dist/apps/react/index.html'
        ),
        protocol: 'file:',
        slashes: true,
      })
    );
  }

  //[IMPORTANT] CALL THIS ONCE ONLY
  if (ext_install) {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    Promise.all(
      extensions.map((name) =>
        installer.default(installer[name], forceDownload)
      )
    )
      .then(() => {
        console.log('Extensions Installed, Closing App');
        app.exit();
      })
      .catch(console.log);
  }
};

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
} catch (e) {
  console.log(e);
  throw e;
}