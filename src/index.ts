import * as readline from 'readline'
import { networkIfaces } from './network';
import sACNReceiver from './sACN';
function checkArguments() {
  let tooFewArgs = args.length < 1;
  if(tooFewArgs) {
    console.error("Not enough arguments, must be 1")
    process.exit();
  }
  let argsOnlyContainNumbers = onlyNumbers(args[0])
  if(!argsOnlyContainNumbers) {
    console.error("Arguments must only contain numbers");
    process.exit();
  };
  let argsOutOfBounds = parseInt(args[0]) < 1 || parseInt(args[0]) > 512;
  if(argsOutOfBounds) {
    console.error("DMX channel out of bounds, must be between 1-512");
    process.exit()
  }
}

function onlyNumbers(str: string) {
  return /^[0-9]*$/.test(str);
}

function askQuestion(query: string): Promise<number>{
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, answer => {
      rl.close();
      let ans = parseInt(answer)
      resolve(ans);
  }))
}

const args = process.argv.slice(2);
if(args.length < 1){
  // Interactive
  askQuestion("Listen for Art-Net(0) or sACN(1)? ").then((answer) => {
    startListener(answer)
  })
} else {
  // Easier with nodemon
  checkArguments()
  if(args){}
  startListener(parseInt(args[0]))
}



function startListener(type:number) {
  console.log(networkIfaces());
  switch (type) {
    case 0:
      // Art-Net
      // TODO: run Art-Net client
      break;

    case 1:
      // sACN
      // TODO: run sACN client
      new sACNReceiver("169.254.203.26", 1, 1)
      break;
  
    default:
      console.log("Wrong");
      break;
  }
}