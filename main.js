var app = require('app')  // Module to control application life.
var BrowserWindow = require('browser-window')  // Module to create native browser window.

// Report crashes to our server.
// require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit()
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html')

  // Open the DevTools.
  //mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // Start and stop daemon
  var ipfsd = require('ipfsd-ctl')
  var home = require('osenv').home()
  var configPath = home + '/.applesauce-ipfs'

  ipfsd.local(configPath, function (err, ipfs) {
    if (err) { throw err }

    if ( ipfs.initialized ) {
      startDaemon()
    } else {
      console.log('Initializing IPFS')
      ipfs.init(function (err) {
        if (err) { throw err }
        startDaemon()
      })
    }

    function startDaemon() {
      console.log('Starting IPFS Daemon')
      ipfs.startDaemon(function (err, api) {
        if (err) { throw err }

        api.version(function (err, version) {
          if (err) { throw err }

          console.log(version)

          mainWindow.loadUrl('http://127.0.0.1:5001/webui')
        })
      })
    }

  })

})
