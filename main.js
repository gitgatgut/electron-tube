// Modules to control application life and create native browser window
const {app, session, BrowserWindow, globalShortcut, Notification} = require('electron')
const path = require('path')
const electron = require('electron')
const { fork } = require('child_process')
const static = require('node-static');
const file = new static.Server(`${__dirname}/miniyt`)
const port = 8888
const server = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response)
    }).resume()
});
server.listen(port);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function decodeEntities(encodedString) {
    var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    var translate = {
        "nbsp":" ",
        "amp" : "&",
        "quot": "\"",
        "lt"  : "<",
        "gt"  : ">"
    };
    return encodedString.replace(translate_re, function(match, entity) {
        return translate[entity];
    }).replace(/&#(\d+);/gi, function(match, numStr) {
        var num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
}

function createWindow () {
    let mainWindow = new BrowserWindow({ width: 800, height: 600 });
    //mainWindow.loadURL('https://mechamug.github.io/miniyt/')
    mainWindow.loadURL('http://localhost:' + port);
    mainWindow.on('closed', function () { mainWindow = null });
    
    globalShortcut.register('Control+Shift+\\', () => {
        mainWindow.webContents.executeJavaScript('playNextVideoContext()');
    });
    globalShortcut.register('Control+Shift+P', () => {
        mainWindow.webContents.executeJavaScript('togglePausePlay()');
    });
    globalShortcut.register('Control+Shift+O', () => {
        mainWindow.webContents.executeJavaScript('playlist[playIndex]["title"]').then(
            (result) => {
                let n = new Notification({silent: true, body: decodeEntities(result)});
                n.show();
            });
        });
    }
    
    app.on('ready', createWindow);
    app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });
    app.on('activate', function () {
        if (mainWindow === null) {
            createWindow();
        }
    });
    