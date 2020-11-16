#!/usr/bin/env node

(async function() {
  const fs = require('fs')
  const { execSync } = require('child_process')
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const log = console.log

  

  /*---------------*/
  /* SCRIPT INPUTS */
  /*---------------*/


  
  /** External modules list you want to install during project init */
  const modules = {
    scss: {
      label: "SCSS",
      cmd: {
        js: "node-sass",
        ts: "@types/node-sass"
      },
      isDev: true
    },
    ricons: {
      label: "React-icons",
      cmd: {
        js: "react-icons",
        ts: "@types/react-icons"
      }
    },
    routing: {
      label: "React front-routing",
      cmd: {
        js: "react-router-dom",
        ts: "@types/react-router-dom"
      }
    },
    redux: {
      label: "Redux",
      cmd: {
        js: "redux react-redux",
        ts: "@types/redux @types/react-redux"
      }
    },
  }

  /** Folders list you want to add to ./src/ */
  const folders = [
    'assets/styling', 
    'assets/styling/variables', 
    'assets/styling/functions', 
    'assets/styling/effects', 
    'assets/styling/mixins', 
    'assets/data', 
    'assets/data/views/', 
    'assets/img/', 
    'assets/img/views/', 
    'components', 
    'layouts',
    'layouts/views',
    'services', 
    'store',
  ]



  /*----------------*/
  /* SCRIPT METHODS */
  /*----------------*/



  const getUserInput = (moduleLabel, isName = false) => new Promise(
    (resolve) => {
      const promptSentence = isName ? moduleLabel
      : `Do you want to use ${moduleLabel} ? `

      rl.question(
        promptSentence, (answer) => {
          resolve(!isName 
            ? answer.charAt(0).toLowerCase() === 'y' ? true : false 
            : answer.toLowerCase()
          )
        }
      )
    }
  )

  const executeModuleCommand = (module) => {
    const isDevDependency = module.isDev ? '--save-dev ':''
    const computeFullCmd = (cmd) => `npm install ${isDevDependency}${cmd}`
    const options = {
      stdio: "pipe",
      cwd: `./${userInputs.name}`
    }

    execSync(
      computeFullCmd(module.cmd.js), 
      options
    )

    if(userInputs.ts) {
      execSync(
        computeFullCmd(module.cmd.ts),
        options
      )  
    }

    log(`- ${module.label} module${userInputs.ts ? ' & types':''} installed...`)
  }
  
  /** Adds folders to fill src/ */
  function addFolders() {
    for (const path of folders) {
      const folderPath = `./${userInputs.name}/src/${path}`
      fs.mkdirSync(
        folderPath,
        { recursive: true }
      )
      log(`- ${folderPath} folder created`)
    }
  }

  /** Adds a reset.css file to the project root */
  function addResetCss() {
    const pathToSrc = `./${userInputs.name}/src`
    const resetRules = `
    /* http://meyerweb.com/eric/tools/css/reset/ 
      v2.0 | 20110126
      License: none (public domain)
      */
      
    html, body, div, span, applet, object, iframe,
    h1, h2, h3, h4, h5, h6, p, blockquote, pre,
    a, abbr, acronym, address, big, cite, code,
    del, dfn, em, img, ins, kbd, q, s, samp,
    small, strike, strong, sub, sup, tt, var,
    b, u, i, center,
    dl, dt, dd, ol, ul, li,
    fieldset, form, label, legend,
    table, caption, tbody, tfoot, thead, tr, th, td,
    article, aside, canvas, details, embed, 
    figure, figcaption, footer, header, hgroup, 
    menu, nav, output, ruby, section, summary,
    time, mark, audio, video {
      margin: 0;
      padding: 0;
      border: 0;
      font-size: 100%;
      font: inherit;
      vertical-align: baseline;
    }
    /* HTML5 display-role reset for older browsers */
    article, aside, details, figcaption, figure, 
    footer, header, hgroup, menu, nav, section {
      display: block;
    }
    body {
      line-height: 1;
    }
    ol, ul {
      list-style: none;
    }
    blockquote, q {
      quotes: none;
    }
    blockquote:before, blockquote:after,
    q:before, q:after {
      content: '';
      content: none;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
    }`
    
    fs.writeFileSync(
      `${pathToSrc}/reset.css`,
      resetRules
    )

    const indexFile = `${pathToSrc}/index.${userInputs.ts ? 'tsx':'js'}`
    const fileData = fs.readFileSync(indexFile, 'utf-8')

    fs.writeFileSync(
      indexFile,
      fileData.replace('index.css', 'reset.css')
    )

    fs.unlinkSync(`${pathToSrc}/index.css`)

    log("- reset.css replaces index.css")
  }

  /** Fills user inputs settings */
  async function askUserInputs() {
    userInputs.name = await getUserInput(
      "Which name for the project ? ",
      true
    )
  
    log("Answer with 'y' (yes) or 'n' (no) for next questions: ")

    userInputs.ts = await getUserInput("TypeScript")
  
    // get user input for each external module & close rl
    for(const moduleKey of Object.keys(modules)) {
      const moduleLabel = modules[moduleKey].label
      userInputs[moduleKey] = await getUserInput(moduleLabel)
    }
    rl.close()
  }

  /** Gets CRA command to build the project */
  function buildReactProject() {
    execSync(
      `npx create-react-app ${userInputs.name} ${userInputs.ts ? '--template typescript':''}`,
      { stdio: 'pipe' }
    )
  }

  /** Installs user's selected external modules in the project */
  function installModules() {
    for(const moduleKey of Object.keys(modules)) {
      if(userInputs[moduleKey]) {
        const module = modules[moduleKey]
        executeModuleCommand(module)
      }
    }    
  }

  /** Creates an App folder & stores <App> files */
  function setAppFolder() {
    const indexExtension = userInputs.ts ? "tsx" : "js"
    const tempFolderName = "tempFolder"

    fs.mkdirSync(`${pathToSrc}/${tempFolderName}`)

    execSync(`mv ${pathToSrc}/App* ${pathToSrc}/${tempFolderName}`)

    fs.renameSync(
      `${pathToSrc}/${tempFolderName}/App.${indexExtension}`,
      `${pathToSrc}/${tempFolderName}/index.${indexExtension}`
    )

    fs.renameSync(
      `${pathToSrc}/${tempFolderName}`,
      `${pathToSrc}/App`
    )

    fs.renameSync(
      `${pathToSrc}/logo.svg`,
      `${pathToSrc}/App/logo.svg`
    )

    log("- App folder created & filled")  
  }

  /** Allows to use absolute paths in imports */
  function useAbsolutePaths() {
    if(userInputs.ts) {
      const fileSrc = `./${userInputs.name}/tsconfig.json`
      const tsconfig = JSON.parse(
        fs.readFileSync(fileSrc, 'utf-8')
      )
  
      tsconfig.compilerOptions.baseUrl = "src"
      fs.writeFileSync(
        fileSrc, 
        JSON.stringify(tsconfig, null, 2)
      )
  
      log('tsconfig.json updated !');
    } else {
      const jsconfig = {
        compilerOptions: {
          baseUrl: "src",
        },
        include: ["src"]
      }
  
      fs.writeFileSync(
        `./${userInputs.name}/jsconfig.json`, 
        JSON.stringify(jsconfig, null, 2)
      )
      
      log("jsconfig.json has been created !")
    }
  }



  /*----------------*/
  /* SCRIPT RUNTIME */
  /*----------------*/


  
  /** Fill user inputs to get project settings */
  log("Welcome to the React project configurator !")
  log(" ")
  const userInputs = {}
  await askUserInputs()

  /** Build React project calling CRA */
  log(" ")
  log(`Building ${userInputs.name} new React project...`)
  log(userInputs)
  const pathToSrc = `./${userInputs.name}/src`

  buildReactProject()

  log(`React project ${userInputs.name} set !`)
  log(" ")

  /** Install users selected modules in the new project */
  log("Now installing modules ...")

  installModules()
  
  log("Modules are set !")
  log(" ")

  /** Add folders to src/ & edit files */  
  log("Now standardizing ./src...")

  addFolders()  
  setAppFolder()
  addResetCss()
  
  log('Src is set & ready!')
  log(' ')

  /** Set a config file to be able to use */
  log('Now add absolute paths feature...')

  useAbsolutePaths()

  log('Absolute paths feature is set !')
  log(' ')

  /** End */
  log("Your project is now ready ! Good work !")

  process.exit(0)
})()
