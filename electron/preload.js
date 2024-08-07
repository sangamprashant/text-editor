const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  saveFile: (content) => ipcRenderer.invoke("save-file-dialog", content),
  openFile: () => ipcRenderer.invoke("open-file-dialog"),
  cut: (text) => ipcRenderer.invoke("clipboard-cut", text),
  copy: (text) => ipcRenderer.invoke("clipboard-copy", text),
  paste: () => ipcRenderer.invoke("clipboard-paste"),
  getTheme: async () => {
    return await ipcRenderer.invoke("get-theme");
  },
  setTheme: async (theme) => {
    return await ipcRenderer.invoke("set-theme", theme);
  },
  saveAsPDF: (content) => ipcRenderer.invoke("save-as-pdf", content)
});
