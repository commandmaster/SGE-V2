const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');

const Database = require('@bennettf/simpledb');

const {dialog, app, BrowserWindow, Menu, shell, ipcMain, nativeTheme, BrowserView} = electron;

let mainWindow;
let currentProject = {projectName: null, projectPath: null};



app.on('ready', function(){

    nativeTheme.themeSource = 'dark';


    mainWindow = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
          }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'levelEditor/index.html'),
        protocol:'file:',
        slashes: true
    }));

    mainWindow.on('closed', () => {
        app.quit();
    })

    

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    Menu.setApplicationMenu(mainMenu);
});

const mainMenuTemplate = [
    {
        label:'File',
        submenu:[
            {
                label: 'New Project',
                click(){createNewProject();}
            },

            {
                label: 'Save Project',
                click(){saveProject();}
            },

            {
                label: 'Load Project',
                click(){loadProject();}
            },

            {
                label: 'Quit',
                click(){app.quit();}
            }
        ]
    },
    {
        label:'Build',
        submenu:[
            {
                label: 'Build Game',
                click(){
                    buildGame();
                }
            },
        ]
    },
    {
        label:'View',
        submenu:[
            {
                label: 'Toggle DevTools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                label: 'View Game',
                click(){
                    let gameWindow = new BrowserWindow({width: 800, height: 800});
                    gameWindow.loadURL(url.format({
                        pathname: path.join(__dirname, 'gameRenderer/index.html'),
                        protocol:'file:',
                        slashes: true
                    }));
                }
            }
        ]
    }

];

function buildGame(){
    console.log('Building Game');
}

function createNewProject() {
    return new Promise(async (resolve, reject) => {
        console.log('Creating New Project');
        const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });

        const folderPath = result.filePaths[0]
        const folderName = path.basename(folderPath);

    

        fs.mkdir(folderPath + '/build', (err) => {
            if (err) {
                console.log(err);
                reject();
            }

            fsExtra.copySync(path.join(__dirname, 'gameRenderer'), path.join(folderPath, 'build'));
        });

        currentProject.projectName = folderName;
        currentProject.projectPath = folderPath;

        resolve();
    });
}

async function saveProject(){
    console.log('Saving Project');
    
}

function loadProject(){
    console.log('Loading Project');
    dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }).then(result => {
        const folderPath = result.filePaths[0];
        const folderName = path.basename(folderPath);

        currentProject.projectName = folderName;
        currentProject.projectPath = folderPath;
    });
}



