import secureFile from './startup/secureFile'
const encryptFile = secureFile.encryptFile

let method = process.argv[2]
let inFile = process.argv[3]

if (method === 'encryptFile') {
  encryptFile(inFile)
}
