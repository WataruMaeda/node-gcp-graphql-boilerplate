import * as firebase from 'firebase-admin'
import config from './config'

const serviceAccount = {
  ...config.firebase,
  private_key: config.firebase.private_key.replace(/\\n/g, '\n'),
}

// initialize firebase admin
firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
})
