import firebase from 'firebase-admin'
import { FIREBASE_PRIVATE_KEY } from '../config'

const serviceAccount = FIREBASE_PRIVATE_KEY!
export = () => {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
  })
  console.log('Initialized Firebase SDK')
}
