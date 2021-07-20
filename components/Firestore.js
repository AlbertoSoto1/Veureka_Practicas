import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyBpdD8oCwjvozKy_XMaEK_Dr1X8jNr_N0g",
    authDomain: "veurekadb.firebaseapp.com",
    databaseURL: "https://veurekadb.firebaseio.com",
    projectId: "veurekadb",
    storageBucket: "veurekadb.appspot.com",
    messagingSenderId: "489766611323",
    appId: "1:489766611323:web:07a93f24d6f6cc28"
  };

  firebase.initializeApp(firebaseConfig);
  export default firebase;