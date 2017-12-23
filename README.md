# ReactJS Typescript Microsoft Teams Tab TODO MVC/O365 Outlook Tasks

A bare minimum react-webpack-typescript boilerplate with TodoMVC example integrated into Microsoft Teams as a TAB and Access to Office 365 Graph API specifically __OUTLOOK Tasks__.

Note that this project does not include **Server-Side Rendering**,  **Testing Frameworks** and other stuffs that makes the package unnecessarily complicated.

Ideal for creating React apps from the scratch.

## Setup

Create APP on apps.dev.microsoft.com (have the appropriate "admin" permissions for __Delegated Permissions__ (User.Read, Tasks.ReadWrite)

Setup __properties.ts__ in the SRC Directory.<br/>
Setup __mainifest.json__ in the Manifest Directory.

```
$ npm install
```

## Running

```
$ npm start
```

## Build

```
$ npm run build
```
## Contains

- [x] [Typescript](https://www.typescriptlang.org/) 2.5
- [x] [React](https://facebook.github.io/react/) 16.0
- [x] [Redux](https://github.com/reactjs/redux) 3.7
- [x] [React Router](https://github.com/ReactTraining/react-router) 4.2
- [x] [Redux DevTools Extension](https://github.com/zalmoxisus/redux-devtools-extension)
- [x] [TodoMVC example](http://todomvc.com)

### Build tools

- [x] [Webpack](https://webpack.github.io) 3
  - [x] [Tree Shaking](https://medium.com/@Rich_Harris/tree-shaking-versus-dead-code-elimination-d3765df85c80)
  - [x] [Webpack Dev Server](https://github.com/webpack/webpack-dev-server)
- [x] [Awesome Typescript Loader](https://github.com/s-panferov/awesome-typescript-loader)
- [x] [PostCSS Loader](https://github.com/postcss/postcss-loader)
  - [x] [CSS next](https://github.com/MoOx/postcss-cssnext)
  - [x] [CSS modules](https://github.com/css-modules/css-modules)
- [x] [React Hot Loader](https://github.com/gaearon/react-hot-loader)
- [x] [ExtractText Plugin](https://github.com/webpack/extract-text-webpack-plugin)
- [x] [HTML Webpack Plugin](https://github.com/ampedandwired/html-webpack-plugin)



# License

MIT
