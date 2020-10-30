#!/usr/bin/env node

(async function() {
  const fs = require('fs')
  const { execSync } = require('child_process')
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  const questions = [
    ['name', "Which name for the project ? "],
    ["ts", "Do you want to use TypeScript ? "],
    ["sass", "Do you want to use SASS ? "],
    ["routing", "Do you want to use React routing ? "],
    ["redux", "Do you want to use Redux ? "],
  ]

  const folders = [
    'assets/styles', 
    'assets/data', 
    'components', 
    'services', 
    'layouts',
    'store',
    'App'
  ]
  
  const getUserInput = (question, isBool) => new Promise(
    (resolve) => {
      rl.question(question, (answer) => {
        resolve(isBool 
          ? answer.charAt(0).toLowerCase() === 'y' ? true : false 
          : answer.toLowerCase()
        )
      })
    }
  )

  const userInputs = {}
  for (const question of questions) {
    userInputs[question[0]] = await getUserInput(question[1], question[0] !== "name")
    question[0] === "name" && console.log("Answer with 'y' (yes) or 'n' (no) for next questions:")
  }
  rl.close()

  console.log(`Building React project...`);
  console.log(userInputs);

  const executeCommand = (cmd, npm = true, dev = false) => {
    const tool = npm
    ? `npm install${dev ? ' --save-dev':''}`
    : "npx create-react-app" 

    const command = `${tool} ${cmd}`
    const options = { 
      stdio: 'pipe',
      cwd: npm ? `./${userInputs.name}`: undefined
    }
    execSync(command, options)
  }

  executeCommand(`${userInputs.name} ${userInputs.ts && '--template typescript'}`, false)
  console.log(`React project ${userInputs.name} set ! Now installing modules ...`)

  if(userInputs.sass) {
    executeCommand(`node-sass ${userInputs.ts && '@types/node-sass'}`, true, true)
    console.log('SASS installed ...')
  }
  
  if(userInputs.routing) {
    executeCommand('react-router-dom')
    userInputs.ts && executeCommand('@types/react-router-dom', true, true)
    console.log(`Router ${userInputs.ts && '& types '}installed ...`)
  }

  if(userInputs.redux) {
    executeCommand('redux react-redux')
    userInputs.ts && executeCommand('@types/redux @types/react-redux', true, true)
    console.log(`Redux ${userInputs.ts && '& types '}installed ...`)
  }


  for (const path of folders) {
    fs.mkdirSync(`./${userInputs.name}/src/${path}`, { recursive: true })
  }
  console.log('Src folders set ...')


  if(userInputs.ts) {
    const fileSrc = `./${userInputs.name}/tsconfig.json`
    const tsconfig = JSON.parse(fs.readFileSync(fileSrc, 'utf-8'))

    tsconfig.compilerOptions.baseUrl = "src"
    fs.writeFileSync(
      fileSrc, 
      JSON.stringify(tsconfig, null, 2)
    )

    console.log('tsconfig.json updated !');
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
    
    console.log("jsconfig.json has been created !")
  }
  console.log("Your project is now ready ! Good work !")

  process.exit(0)
})()
