/*
 *  Nodepg Copyright (C) 2018 linlurui <rockylin@qq.com>
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

const electron = require('electron');
// Module to control application life.
const app = electron.app;
const globalShortcut = electron.globalShortcut;
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;

const config = require('./package.json');

const proxy = require('./proxy.js');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var adminWindow;

electron.ipcMain.on('error', function(event, err) {
  if(err.code == "EADDRINUSE"){
    console.error('ERROR: listen port '+err.port+' has been used!');
  }else{
    console.error(err);
  }
});

process.on('uncaughtException', function (err) {
  error(err);
});

function onReady () {

  globalShortcut.register('CommandOrControl+Q', function () {
	app.quit();
  });

  //tray
  var appIcon = new electron.Tray(__dirname + '/app.png');
  const contextMenu = electron.Menu.buildFromTemplate([
    {label: '管理中心(Admin)', click:function(){
		createAdmin(true);
	}},
	{label:'-',type:'separator'},
    {label: '开启服务(Start)', click:function(){
		proxy.start(electron);
	}},
    {label: '停止服务(Stop)',click:function(){
		proxy.stop(electron);
	}},
	{label:'-',type:'separator'},
    {label: '退出(Quit)',click:function(){
		app.quit();
	}}
  ]);
  appIcon.setToolTip('Node Page Server');
  appIcon.setContextMenu(contextMenu);
  appIcon.on('balloon-closed', function(){
	  appIcon.displayBalloon();
  });
  appIcon.on('double-click', function(){
	  createAdmin(true);
  });

  try
  {
    proxy.start(electron);
    createAdmin();
  }
  catch(e)
  {
    console.log(e);
    return;
  }


}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
function createAdmin(isShow){

  if(isShow && adminWindow){
	  adminWindow.show();
	  return;
  }

  // Create the browser window.
  adminWindow = new BrowserWindow({width: 1024, height: 768, show:isShow});

  // and load the index.html of the app.
  adminWindow.loadURL('file://' + __dirname + '/admin/main.html');

  // Open the DevTools.
  //adminWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  adminWindow.on('closed', function () {
    adminWindow = null;
  });

  adminWindow.on('close', function(event){
	  event.returnValue = false;
	  adminWindow.hide();
  });
}

app.on('before-quit', function () {
    // Stop server.
    proxy.stop(electron);
});

app.on('will-quit', function () {
  // Unregister all shortcuts.
  globalShortcut.unregisterAll();
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (adminWindow === null) {
    createAdmin();
  }
});

// Quit when all windows do not closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    createAdmin(false);
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', onReady);
