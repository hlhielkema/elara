
![banner](media/logo/banner.svg)

Elara enables creating a Windows/MacOS like window manager experience inside a web browser. This JavaScript library is written with performances and compatibility in mind. No third-party libraries or frameworks are needed to use Elara.

[![ESLint](https://github.com/hlhielkema/elara/workflows/ESLint/badge.svg)](https://github.com/hlhielkema/elara/actions?query=workflow%3AESLint)
[![](https://img.shields.io/badge/Demo-Open%20live%20demo-brightgreen)](https://hlhielkema.github.io/elara/)
![license](https://img.shields.io/badge/License-MIT-green)

---

## 🌈 Live demo

Open the [LIVE DEMO](https://hlhielkema.github.io/elara/) to try Elara yourself.

*Scroll down for some screenshots.*

> The demo site is hosted using GitHub pages. Running Elara requires no back-end code besides static file hosting.

![screenshot A](media/screenshots/screenshot_a.png)

> [View more](#screenshots)

---

## ✨ Features
-	Move windows around the screen.
-	Resize windows from all sides.
-	Maximize/Minimize/Close windows.
-	Dock windows on the sides or in the corners of the screen.
-	Double click the top of the window to maximize it.
-	Select windows with the taskbar on the bottom of the screen.
-	Switch between unlimited workspaces, each with their own set of active windows.
-	Grab windows to bring them to the top level.
-	Animations and smooth movement.
-	Split windows, cascade windows, maximize/minimize/show all.

## 🖥 Environment Support
- Supports all major web browsers.
- Can run directly on [Electron](http://electron.atom.io/), [CEF](https://github.com/chromiumembedded/cef) and other Web standards-based environments.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions


## 📦 Build
Bundling the Elara code into a single Javascript and CSS file with **Webpack** requires **Node.js**. [Install Node.js](https://nodejs.org/en/) and run the command below to bundle Elara. The files that can be used for distribution will be placed in the `/dist` directory.

```
npm run build
```

Grab the files from the `/dist` directory if you want only to use Elara without modifying it.


## ✔️ Linting
<img src="media/third-party/eslint.png" width="200">

Use this command to run ESLint:

```
npm run lint
```

> Use `eslint --fix ./src/` for automated fixing (where possible).

## ❓ Community Support
Please create a [new issue](https://github.com/hlhielkema/elara/issues/new) if you encounter any issues with this project.

## 🤝 Contributing
Contributing to the project in welcome and appreciated. If you would like to contribute, feel free to create a [pull request](https://github.com/hlhielkema/elara/pulls) or [bug report](https://github.com/hlhielkema/elara/issues/new). Code contributors will be listed in the README.

## 💻 Screenshots

| | |
|:---|:---|
| ![screenshot 1](media/screenshots/screenshot_1.png) | ![screenshot 2](media/screenshots/screenshot_2.png) |
| ![screenshot 3](media/screenshots/screenshot_3.png) | ![screenshot 4](media/screenshots/screenshot_4.png) |

[View more](media/screenshots/)


## ⚙️ Run local demo server
The Elara library itself does not require any backend to work. However, just opening *index.html* on your local system will not work properly. This repository contains 3 implementations of simple servers to try or test Elara. Each server is written in a different programming language. Please use the server implementation you prefer. Use the online live demo described earlier in this document if you just want to try the last stable version of Elara. The server implementations are written in:

- Node.js
- ASP.NET Core
- Go

---

### Node.js demo server

<img src="media/third-party/nodejs.png" width="200">

*Command:*
``` ps
node demo\nodejs\server.js
```

*Output:*
```
Routes:
"/"       ->: D:\GitHub Workspace\elara\demo\shared\index.html
"/dist/*" ->: D:\GitHub Workspace\elara\dist
"/*"      ->: D:\GitHub Workspace\elara\demo\shared

Elara demo server running at http://127.0.0.1:3000/
```

> TIP: Press Ctrl+C to shut down.

---

### ASP.NET Core demo server

<img src="media/third-party/aspnetcore.png" width="200">

*Command:*
``` ps
dotnet run --project .\demo\aspnetcore\ElaraDemo
```

*Output:*
```
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: https://localhost:5001
info: Microsoft.Hosting.Lifetime[0]
      Now listening on: http://localhost:5000 
info: Microsoft.Hosting.Lifetime[0]
      Application started. Press Ctrl+C to shut down.
info: Microsoft.Hosting.Lifetime[0]
      Hosting environment: Development
info: Microsoft.Hosting.Lifetime[0]
      Content root path: D:\GitHub Workspace\elara\demo\aspnetcore\ElaraDemo
```

> TIP: Press Ctrl+C to shut down.

---

### Go demo server

<img src="media/third-party/golang.png" width="200">

*Command:*
```
cd demo/go
go build server.go
.\server.exe
```

*Output:*
```
2020/03/07 13:50:14 Listening on :3500..
```

> TIP: Press Ctrl+C to shut down.

---

## 🔗 Third-party resources

### Feather
Some of the icons used in the demo are from the Feather icon pack. Feather is licensed under the MIT License.

- Website: [feathericons.com](https://feathericons.com)
- GitHub: [feathericons/feather](https://github.com/feathericons/feather)