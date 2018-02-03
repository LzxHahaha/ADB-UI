## ADB UI

An ADB client.

### Directory structure

```
├─ app      electron client code
|   ├─ adb      libs
|   └─ ipc      communication code
└─ ui       ui code
    ├─ config   webpack config
    ├─ public   static resources
    ├─ scripts  build scripts
    └─ src      react.js code
```

### install

```bash
$ yarn
```

### development

```bash
$ cd ./ui
$ yarn start  # start dev-server to build pages
$ cd ..
$ yarn start # run client
```

### build

```bash
$ cd ./ui
$ yarn run build
$ cd ..
$ yarn run build
$ yarn run pack
```

setup.exe will generate to `dist/`.

### LICENSE

[MIT](https://github.com/LzxHahaha/ADB-UI/blob/master/LICENSE)
