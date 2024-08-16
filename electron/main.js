const { app, BrowserWindow, dialog, ipcMain, clipboard } = require("electron");
const path = require("path");
const fs = require("fs");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    icon: path.join(__dirname, "icon.ico"),
    title: "Text Editor",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Remove menu options
  mainWindow.removeMenu();
  mainWindow.webContents.openDevTools();

  mainWindow.loadURL("http://localhost:5173");
  // mainWindow.loadFile(path.join(__dirname, "..","dist/index.html"));

  ipcMain.handle("save-file-dialog", async (event, content) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: "Save text file",
      defaultPath: path.join(app.getPath("desktop"), "myTextFile.txt"),
      filters: [{ name: "Text Files", extensions: ["txt"] }],
    });

    if (!result.canceled) {
      fs.writeFileSync(result.filePath, content);
      return result.filePath;
    }
    return null;
  });

  ipcMain.handle("open-file-dialog", async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters: [{ name: "Text Files", extensions: ["txt"] }],
    });

    if (!result.canceled) {
      const content = fs.readFileSync(result.filePaths[0], "utf-8");
      return content;
    }
    return null;
  });

  ipcMain.handle("save-as-pdf", async (event, content) => {
    const result = await dialog.showSaveDialog(mainWindow, {
      title: "Save PDF",
      defaultPath: path.join(app.getPath("desktop"), "document.pdf"),
      filters: [{ name: "PDF Files", extensions: ["pdf"] }],
    });

    if (!result.canceled) {
      const pdfPath = result.filePath;
      const printWindow = new BrowserWindow({ show: false });

      printWindow.loadURL(
        `data:text/html;charset=utf-8,<html><body>${content}</body></html>`
      );
      printWindow.webContents.on("did-finish-load", () => {
        const options = {
          marginsType: 0,
          pageSize: "A4",
          printBackground: true,
        };

        printWindow.webContents
          .printToPDF(options)
          .then((pdfData) => {
            fs.writeFileSync(pdfPath, pdfData);
            event.sender.send("pdf-saved", pdfPath);
            printWindow.close();
          })
          .catch((error) => {
            console.error("Failed to save PDF:", error);
            printWindow.close();
          });
      });
    }

    return null;
  });

  // Handle clipboard operations
  ipcMain.handle("clipboard-cut", async (event, text) => {
    clipboard.writeText(text);
    return true;
  });

  ipcMain.handle("clipboard-copy", async (event, text) => {
    clipboard.writeText(text);
    return true;
  });

  ipcMain.handle("clipboard-paste", async () => {
    return clipboard.readText();
  });

  ipcMain.handle("get-theme", () => {
    const theme = fs.readFileSync(
      path.join(app.getPath("userData"), "theme.txt"),
      "utf-8"
    );
    return theme;
  });

  ipcMain.handle("set-theme", (event, theme) => {
    fs.writeFileSync(path.join(app.getPath("userData"), "theme.txt"), theme);
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
