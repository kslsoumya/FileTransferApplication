const readline = require('readline');
const fs = require('fs')

// Readline Interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to check if an input is empty

let trim = (x) => {
  let value = String(x)
  return value.replace(/^\s+|\s+$/gm, '')
}
let isEmpty = (value) => {
  if (value === null || value === undefined || trim(value) === '' || value.length === 0) {
    return true
  } else {
    return false
  }
}

// Function ended-----

// Global variables-----
let dirs, filesInDir, fileIndex, destFolder, srcFolder;

// reads directories in the project
fs.readdir('./', (err, result) => {
  dirs = result
})

// returns a promise for the question

let question = function (q) {
  return new Promise((res, rej) => {
    rl.question(q, answer => {
      res(answer);
    })
  });
};

// Async function main----

async function main() {
  while (isEmpty(srcFolder)) {
    srcFolder = await question('Please specify the Source Directory' + '\n');
  }
  while (dirs.indexOf(srcFolder) === -1) {
    srcFolder = await question('Source Directory Not Found!!'+'\n'+
    'Please specify a valid Directory from the Project' + '\n')
  }
  fs.readdir('./' + srcFolder, (err, files) => {
    if (err) console.log(err);
    if (files.length > 0) {
      console.log(`Files in ${srcFolder} are: \n`)
      filesInDir = files
      files.forEach((file, index) => {
        console.log((index + 1) + ' ' + file)
      })
      console.log('\n');
      findSerialNo();
    } else {
      console.log('Source Directory is Empty!! Please try with another Directory!!')
      rl.close();
    }
  })
}

// Aync Function to find the serailNo of the file ----
async function findSerialNo() {
  while (isEmpty(fileIndex)) {
    fileIndex = await question('Please enter the serial number of the file to copy' + '\n');
  }
  while (fileIndex <= 0 || fileIndex > (filesInDir.length - 1)) {
    fileIndex = await question('Serial Number doesnt Exist in the directory'+'\n'+
    'Please Enter a valid serial number of the file to copy' + '\n');
  }
  copyToDest();
}


// Async Function to copy Files to destination----

async function copyToDest() {
  while (isEmpty(destFolder)) {
    destFolder = await question('Please enter the Destination Directory to transfer' + '\n');
  }
  while (dirs.indexOf(destFolder) === -1) {
    destFolder = await question('Destination Directory Not Found!!'+'\n'+
    'Please specify a valid Directory from the Project' + '\n');
  }
  const ws = fs.createWriteStream('./' + destFolder + '/' + filesInDir[fileIndex - 1])
  const rs = fs.createReadStream('./' + srcFolder + '/' + filesInDir[fileIndex - 1])
  rs.on('data', (chunk) => {
    ws.write(chunk);
  })
  rs.on('end', () => {
    ws.end();
    console.log('----------Successfully copied--------')
    rl.close()
  })
}

// Function call to main---

main();



