import { networkInterfaces } from 'os';

const nets = networkInterfaces();

export const networkIfaces = () => {
  // let res: {name: string[]} = {} as any;
  let res = {} as any;
  for (const name of Object.keys(nets)) {
    if(typeof nets === undefined) return "";
      for (const net of nets[name] as any) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
          const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
          if (net.family === familyV4Value && !net.internal) {
              if (!res[name]) {
                  res[name] = [];
              }
              res[name].push(net.address);
          }
      }
  }
  return res
}




// TODO: Make it so that when the code is run, these options are listed for the user to choose between
console.log(networkIfaces());

