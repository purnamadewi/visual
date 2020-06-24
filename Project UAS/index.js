const electron = require("electron");
const { v4: uuidv4 } = require("uuid");
uuidv4();
const fs = require("fs");
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;

let fileWindow;
let createWindow;
let listdataWindow;

let penyewaanMobil = [];

fs.readFile("pd.json", (err, jsonrentalcar) => {
    if(!err){
        const oldrentalcar = JSON.parse(jsonrentalcar);
        penyewaanMobil = oldrentalcar;
    }
});

app.on("ready", () => {
    fileWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        title: "Aplikasi Rental Mobil"
    });

    fileWindow.loadURL(`file://${__dirname}/file.html`);
    fileWindow.on("closed", () => {

        const jsonrentalcar = JSON.stringify(penyewaanMobil);
        fs.writeFileSync("pd.json", jsonrentalcar);

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
    sendfilerentalcar();

    createWindow.close();

    console.log(penyewaanMobil);
});

ipcMain.on("rentalcar:request:listdata", event => {
    listdataWindow.webContents.send('rentalcar:response:listdata', penyewaanMobil);
});

ipcMain.on("rentalcar:request:file", event => {
    sendfilerentalcar();
    console.log("berhasil")
});

ipcMain.on("rentalcar:done", (event, id) => {
    penyewaanMobil.forEach((rentalcar) => {
        rentalcar.done = 1 
    })
  
    sendfilerentalcar()
})

const sendfilerentalcar = () => {
    const file = new Date().toISOString().slice(0, 10);
    const filtered = penyewaanMobil.filter(
        rentalcar => rentalcar.date1 === file
    );
    fileWindow.webContents.send("rentalcar:response:file", filtered);
};

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