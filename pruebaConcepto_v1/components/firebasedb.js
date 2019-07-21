import * as firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDJnyFCWeJiu_XJg5Fx6MYIf8kaUlANmhk",
    authDomain: "cursopw-16b3f.firebaseapp.com",
    databaseURL: "https://cursopw-16b3f.firebaseio.com",
    projectId: "cursopw-16b3f",
    storageBucket: "cursopw-16b3f.appspot.com",
    messagingSenderId: "927915806207"
};
firebase.initializeApp(config);


export default firebase;