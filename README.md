# TEMPLATE-REACT-ELETRON

This project is a template setting up an `electron` app working with a `react` app in a monorepository managed with `nx`. The setup has been made to easily switch the app showned in the electron app with any technologies such as `Angular` or `Next`.

Propulsed by `nx`, the app can serve or build in a single command. The dependencies between the project and the command for build are all been setup to make this command using the `nx` organization.

## Organization

#### Development Environment

![Alt text](documentation/graph_dev.jpg?raw=true "Documentation")
For development, the electron app connect to the react app url. Using the `electron-reload` package, every modification will make the app to reload automatically making the modification easy to follow.

#### Production Environment

![Alt text](documentation/graph_prod.jpg?raw=true "Documentation")

For production, the scenario is a bit tricky for making it work properly with `nx`. The app has his own project. When we build it using the nx command, the bundle of our react app will be created in the electron app. Once there, using `electron-forge`, the bundle of our react app will be included inside our bundle of our electron app.

#### Code

**React**

The react app has been generated using the `@nrwl/react` package present in `nx`.

```bash
$ nx generate @nrwl/react:application react
```

The app can be served using the command below:

```bash
$ nx serve react
```

The result can be seen on the browser at the url: [http://localhost:4200/](http://localhost:4200/)

**Electron**

The electron app has been generated using the `@nrwl/node`. This package is not present in `nx` by default, so it need to be install first:

```bash
$ npm install -D @nrwl/node
```

Once install, the app has been generated using the `nx` command ()

```bash
$ nx generate @nrwl/node:app electron
```

The code for the electron has been built inside the `main.js`, this is where we find the connection between the electron app and the react app using the previous url:

```
mainWindow.loadURL('http://localhost:4200');
```

**Config NX**

This is where a lot has been made to make everything work properly all together.
The first problem when trying to serve both project was the fact that electron need to wait for react to be deploy before running.

For doing so, I have installed `wait-on` inside the electron project in the start script of the package.json for waiting the 4200 to be fully available: wait-on tcp:4200
For running, the script, I changed the executor of `nx` for electron project to `nx:run-script` in order to run the script of the package.json relative to the electron project. It has the default to create a second node_modules but it gives the opportunities to run the command that I want.

For the production build, I got into a lot more trouble. The first step was to move the output of the react bundle to the electron app for the react app to be available in the bundle of electron when built. It was just a modification in the `project.json` of the react project.

```json
"outputPath": "apps/electron/react"
```

Next, since we dont have a package.json inside the react project. I cannot specify the base url using the "homepage" field in the package.json. So I needed to create a script modifying the `index.html` of the react bundle. The script is inside the `script` folder of the electron app. The purpose of this script is just to change the path of the base. One problem that still can popup is the fact that the script need to have a certain kind of condition:

```bash
chmod +x react.sh
```

Once done, the script can be run using the package.json of the electron folder in the command premake called in the make command.

Next step was to separate the place from where electron will load the app. In the development environment, the app was load using the url. In production, it will load the app from the compiled bundle. For this, I created a variable "isDev" that I export in the package.json and reuse inside the main.js for conditionning the loading of the file or url.

```js
if (isDev) {
  mainWindow.loadURL("http://localhost:4200");
} else {
  mainWindow.loadFile(nodePath.join(__dirname, "react/index.html"));
}
```

The last step was to build the project in the right order for `electron-forge` to work properly. For doing so, I limited the number of project built in parallele to 1 using the parameter of `nx`. I give a dependency to the eletron app using the tags given to each project inside the `project.json`:

```json
  "tags": ["scope:electron"],
  "implicitDependencies": ["react"]
```

After all of that, serving or building work using the `nx` commands.

## Running

**All NX commands need to be executed from inside the `PROJECT` folder!**

- For running the dev environment:

```bash
$ nx run-many --target=serve --projects=react,electron
```

- For building the application:

```bash
$ nx run-many --target=build --projects=react,electron --parallele=1
```
