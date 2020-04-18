const electron = require("electron");
const { v4: uuidv4 } = require("uuid");
uuidv4();
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

let fileWindow;
let createWindow;
let listdataWindow;

let penyewaanMobil = []

app.on("ready", () => {
    fileWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        title: "Aplikasi Rental Mobil"
    });

    fileWindow.loadURL(`file://${__dirname}/file.html`);
    fileWindow.on("closed", () => {

        app.quit();
        fileWindow = null;
    });

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

const listdataWindowCreator = () => {
    listdataWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Pengecekan Data"
    });

    listdataWindow.setMenu(null);
    listdataWindow.loadURL(`file://${__dirname}/listdata.html`);
    listdataWindow.on("closed", () => (listdataWindow = null))
};
const createWindowCreator = () => {
    createWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 600,
        height: 400,
        title: "Data"
    });

    createWindow.setMenu(null);
    createWindow.loadURL(`file://${__dirname}/create.html`);
    createWindow.on("closed", () => (createWindow = null))
};

ipcMain.on("rentalcar:create", (event, rentalcar) => {
    rentalcar["id"] = uuidv4();
    rentalcar["done"] = 0;
    penyewaanMobil.push(rentalcar);

    createWindow.close();

    console.log(penyewaanMobil);
});

ipcMain.on("rentalcar:request:listdata", event => {
    listdataWindow.webContents.send('rentalcar:response:listdata', penyewaanMobil);
});

ipcMain.on("rentalcar:request:file", event => {
    console.log("here2");
});

ipcMain.on("rentalcar:done", (event, id) => {
    console.log("here3");
});

const menuTemplate = [{
        label: "Cara Sewa",
        submenu: [{
                label: "Daftar",

                click() {
                    createWindowCreator();
                }
            },
            {
                label: "List daftar",
                click() {
                    listdataWindowCreator();
                }
            },
            {
                label: "Quit",
                accelerato: process.platform === "darwin" ? "Command+Q" : "Ctrl + Q",
                click() {
                    app.quit();
                }
            }
        ]
    },

    {
        label: "View",
        submenu: [{ role: "reload" }, { role: "toggledevtools" }]
    },
];