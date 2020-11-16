# React Starter

This script allows you to create a new React project using [CRA](https://create-react-app.dev/), adding preselected modules & predefined file structure.

## Getting started

1. Clone / Download the project (you can also just copy-paste the script)  
2. Be sure the script is executable
3. Call it to create a new React application
4. Follow script instructions & that's it !

## Benefits of this script

### File structure

You can define your file structure & create automatically needed files & folders.

I give my folder structure. You don't like it ? Create yours by modifying `folders` variable in the script & build yours.

```bash
projectRoot/
    ├── jsconfig.json|tsconfig.json - with absolute paths feature
    └── src
        ├── App/
        ├── assets/
        │   ├── data/
        │   │   └── layouts/
        │   ├── img/
        │   │   ├── views/
        │   │   └── imgEx.png
        │   └── styling/
        │       ├── effects/
        │       ├── functions/
        │       ├── mixins/
        │       └── variables/
        │
        ├── components/
        │   └── <ComponentFolder>
        │       ├── <componentFile>
        │       └── <componentFile>
        │
        ├── index.[js|ts]
        ├── reset.css
        │
        ├── layouts/
        │   ├── views/
        │   │   └── <ViewLayoutFolder>
        │   └── <LayoutFolder>
        │
        ├── services/
        │   ├── <serviceFile.js>
        │   └── <otherServiceFile.js>
        │
        └── store/
```

### External modules

There are some modules you always, or often use with React. With the script, user says yes or not for each of them & modules are installed automatically.

If TypeScript is set, types are installed too.

Just like `folders` variable you can edit `modules` to replace my example modules by yours.

In this case, please respect this pattern:

```js
const modules = {
  scss: {
    label: "SCSS",            // label used by prompt
    cmd: {
      js: "node-sass",        // package name
      ts: "@types/node-sass"  // package types
    },
    isDev: true               // say true if it is a dev dependency
  }
}
```

### Absolute paths

Let's be brief. Which one is better ?

```js
import Annoying from '../../../components/Annoying'
import { notOptimized } from '../../../service/bad-service.js'
import boring from '../../../assets/img/boring.jpg'
```

```js
import Amazing from 'components/Amazing'
import { greatJob } from 'service/good-service.js'
import exciting from 'assets/img/exciting.png'
```

You can use "absolute" paths to import components & files, instead of using multiple `../../` to get back.

In my opinion, it's just like swapping a kart for a Formula one.

## Conclusion

Feel free to give a feedback or update this script the ways you want.

Support my work if you can.

Take care of your loved ones. Take care of you.
