import firebase from 'firebase-admin'
import { FIREBASE_PRIVATE_KEY } from '../config'
import secureFile from './secureFile' // replace with your location

const secureFileName = FIREBASE_PRIVATE_KEY! // replace with your filename

;async () => {}

export = async () => {
  const jsonStr = await secureFile.decryptToString(secureFileName)
  const serviceAccount = JSON.parse(jsonStr)

  firebase.initializeApp({
    credential: firebase.credential.cert(
      serviceAccount as firebase.ServiceAccount
    ),
  })
  console.log('Initialized Firebase SDK')
}
