# LABORATORY-REACT-ELETRON

## Organization

#### Development

![Alt text](documentation/graph_dev.jpg?raw=true "Documentation")
For development, the electron app connect to the react app url. Using the `electron-reload` package, every modification will make the app to reload automatically making the modification easy to follow.

#### Production

![Alt text](documentation/graph_prod.jpg?raw=true "Documentation")

For production, the scenario is a bit tricky for making it work properly with `nx`. The app has his own project. When we build it using the nx command, the bundle of our react app will be created in the electron app. Once there, using `electron-forge`, the bundle of our react app will be included inside our bundle of our electron app.

## Running

ALL NX COMMANDS NEED TO BE EXECUTED IN THE `PROJECT` FOLDER!

- For running the dev environment:

```bash
$ nx run-many --target=serve --projects=react,electron
```

- For building the application:

```bash
$ nx run-many --target=build --projects=react,electron --parallele=1
```
