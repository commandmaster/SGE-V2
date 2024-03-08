const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const { exec } = require('child_process');

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
        label:'Package',
        submenu:[
            {
                label: 'Package Game',
                click(){
                    packageGame();
                }
            },
        ]
    },
    {
        label:'Scripting',
        submenu:[
            {
                label: 'Open GameState',
                click(){
                    if (currentProject.projectName === null || currentProject.projectPath === null){
                        dialog.showErrorBox('Error', 'No project loaded');
                        return;
                    }
        
                    const filePath = path.join(currentProject.projectPath, 'build/gameState.js');
        
                    const command = `code ${filePath}`;
        
                    exec(command, (error,) => {
                    if (error) {
                        console.error(`Error opening file: ${error}`);
                        dialog.showErrorBox('Error', 'Script failed to open in VS Code, please check if it is installed and try again.');
                        return;
                    }
                        console.log(`File opened successfully in VS Code`);
                    });
                }
            }
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
                    if (currentProject.projectName === null || currentProject.projectPath === null){
                        dialog.showErrorBox('Error', 'No project loaded');
                        return;
                    }

                    let gameWindow = new BrowserWindow({width: 800, height: 800});
                    gameWindow.loadURL(url.format({
                        pathname: path.join(currentProject.projectPath, 'build/index.html'),
                        protocol:'file:',
                        slashes: true
                    }));
                }
            }
        ]
    }

];

async function packageGame(){
    if (currentProject.projectName === null || currentProject.projectPath === null){
        dialog.showErrorBox('Error', 'No project loaded');
        return;
    }

    const packagePath = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
    const folderPath = packagePath.filePaths[0];

    fs.mkdirSync(path.join(folderPath, currentProject.projectName + "-packaged"), (err) => {
        if (err) {
            console.log(err);
            return;
        }
    });

    fsExtra.copySync(path.join(currentProject.projectPath, "build"), path.join(folderPath, currentProject.projectName + "-packaged"));
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

function loadProject(){
    console.log('Loading Project');
    dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }).then(result => {
        const folderPath = result.filePaths[0];
        const folderName = path.basename(folderPath);

        currentProject.projectName = folderName;
        currentProject.projectPath = folderPath;
    });
}



