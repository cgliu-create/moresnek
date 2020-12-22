const {app, BrowserWindow} = require('electron')      
const path = require('path')

function createWindow () {   
  // Create the browser window.     
  win = new BrowserWindow({
    width: 800, 
    height: 800,
  })
  win.loadURL(`file://${path.join(__dirname, 'index.html')}`)
  //win.loadFile('index.html')   
  //win.loadURL('http://localhost:3000/')
  //win.webContents.openDevTools()
}      
app.on('ready', createWindow)

