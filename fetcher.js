const urlAndPath = process.argv.slice(2);
const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const writeFileFunc = (filePath, fileContent) => {
  fs.writeFile(filePath, fileContent, err => {
    // if there's a file path error, return the error message, close program, and stop function
    if (err) {
      console.log(err);
      rl.close();
      return;
    }
    // to get the number of bytes (characters)
    let bytes = 0;
    for (const char in fileContent) {
      bytes += 1;
    }
    // print the # of bytes written to path and close program
    console.log(`Downloaded and saved ${bytes} bytes to ${urlAndPath[1]}`);
    rl.close();
  });
};

request(urlAndPath[0], (error, response, body) => {
  // if there's a URL error, print the error, close program, and stop function
  if (error) {
    console.log(error);
    rl.close();
    return;
  }
  // checking to see if the file exists already
  fs.exists(urlAndPath[1], (exists) => {
    // if it exists, ask user if they want to overwrite
    if (exists) {
      rl.question('This file already exists! Would you like to overwrite it? Enter Y for Yes/N for No: ', (answer) => {
        // if entered Y, call writeFile
        if (answer === 'Y') {
          writeFileFunc(urlAndPath[1], body, error);
        // if entered N, close the program and stop function
        } else if (answer === 'N') {
          console.log('OK - file not written');
          rl.close();
          return;
        }
      });
    // if file does not exist, run writeFileFunc
    } else {
      writeFileFunc(urlAndPath[1], body, error);
    }
  });
});