##  Electron hello world
>   api
```
    import { app, BrowserWindow,Menu, MenuItem, dialog, ipcMain,remote } from 'electron';
```

>   window

通过BrowserWindow类创建浏览器窗口实例
```
    window = new BrowserWindow({width: int, height: int})
```

这些窗口由主进程创建和管理，每个窗口使用一个独立的渲染进程

>   Menu

menu可通过模板进行构建
```
    menu = Menu.buildFromTemplate(template)

    the fllowing is template format
    [{
            label: 'File',  //  main menu
            submenu: [
            
            ]
        },
        {
            label: 'Edit',
            submenu: [
                    {
                        role: 'undo'
                    }
                ]
        }
    ]

```
我们也可以设置事件监听器在相应的菜单栏上，比如click事件监听器:

```
    [{
        label: 'like',
        click() {

        },
        accelerator: 'CmdOrCtrl+O' //设置快捷键，这里是Ctrl+O
    }]
```

当然了，如果需要编程式的添加子菜单选项的话可以通过一下方式
```
    enu.items[0].submenu.append(submenu: object)
```


>   window events

*   close
```
    window.on('close', handler: function)
```

*   
```
   //  ipcRenderer,表示当前渲染进程，监听主进程发来的消息
    ipcRenderer.on(eventName: string, handler: function(event, payload){})
```

>   ipc(inter process communicate)

*   主进程=》渲染进程

```
//  这里window代表创建的一个窗口
    window.wenContents.send(eventName: string, payload: any)
```

*   渲染进程=》 主进程
```
    ipcRenderer.sendSync(eventName, payload);
```

*   资源共享
在渲染进程中不能直接访问菜单，对话框等，它们只存在于主进程中，但可以通过remote来使用这些资源。

```
    import { ipcRenderer, remote } from 'electron';
    const { Menu, MenuItem, dialog } = remote;
```

1.  文件打开对话框

```
    remote.dialog.showOpenDialog
```
2.  文件保存对话框

```
    remote.dialog.showSaveDialog
```

3.  右键菜单
```
    //  contextMenu 通过Menu.buildFromTemplate(template: array)创建
    contextMenu.popup(remote.getCurrentWindow())
```

4.  打开文件

```
    const files =  remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            filters: [
                { name: "Text Files", extensions: ['txt', 'js', 'html', 'md'] }, 
                { name: 'All Files', extensions: ['*'] } ],
            properties: ['openFile']
    })
    //  files是一个文件地址数组，我们这里以第一个文件作为示例
    if(files){
            let currentFile=files[0]; //    currentFile表示第一个选择的文件地址，之后可以通过fs等模块进行操作,fs.read...
            
        
        }

```

5.  弹窗
```
    const response=remote.dialog.showMessageBox(remote.getCurrentWindow(), {
        message: 'Do you want to save the current document?',
        type: 'question',
        buttons: [ 'Yes', 'No' ]
    });
    // response 代表相应值，0这里指Yes
```

6.  在主进程中使用webContents.executeJavascript方法可以访问渲染进程

