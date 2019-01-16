import { remote, ipcRenderer } from 'electron'
import fs from 'fs'
// import path from 'path'

let isSave = true
let currentFile = null
const TEXT_AREA = document.querySelector('#txtEditor')
TEXT_AREA.addEventListener('input', ()=> {
    isSave = false
    if(!currentFile) {
        document.title = `无标题*`
    }else
    document.title = `${currentFile}*`
})

ipcRenderer.on('file', (e, payload) => {
    switch (payload) {
        case 'new': {
            createNew()
            break
        }
        case 'open': {
            openFile()
            break
        }
        case 'save': {
            saveFile()
            break
        }
    }
})

function openFile() {
    if(!isSave) {
        const response=remote.dialog.showMessageBox(remote.getCurrentWindow(), {
            message: '你还没有保存，是否需要保存?',
            type: 'question',
            buttons: [ '是', '否' ]
        });
        response == 0? saveFile(): ''
    }
    const files = remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
        filters: [
            { name: "Text Files", extensions: ['txt', 'js', 'html', 'md', 'css'] },
            { name: 'All Files', extensions: ['*'] }],
        properties: ['openFile']
    })
    currentFile = files[0]
    if (files.length) {
        TEXT_AREA.value = fs.readFileSync(currentFile)
    }
    document.title = currentFile
}

function saveFile() {
    if(!currentFile) {
        const file = remote.dialog.showSaveDialog(remote.getCurrentWindow(), {
            filters: [
                { name: "Text Files", extensions: ['txt', 'js', 'html', 'md', 'css'] },
                { name: 'All Files', extensions: ['*'] }],
        })
        if(file) {
            currentFile = file
        }
    }
    document.title = currentFile
    fs.writeFileSync(currentFile, TEXT_AREA.value, 'utf8')
    isSave = true
    
}
function createNew() {
    if(!isSave) {
        const response=remote.dialog.showMessageBox(remote.getCurrentWindow(), {
            message: '你还没有保存，是否需要保存?',
            type: 'question',
            buttons: [ '是', '否' ]
        });
        response == 0? saveFile(): ''
    }
    currentFile = null
    TEXT_AREA.value = ''
    document.title = `无标题*`
}