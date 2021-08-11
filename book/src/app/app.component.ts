import { Component } from '@angular/core';
//import * as firebase from 'firebase';     // import plus d'actualité
import { firebase } from '@firebase/app'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(){
  // Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyDCG439pa6Q-6seMPIPB9qeyMLLfRddOII",
    authDomain: "books-cf306.firebaseapp.com",
    databaseURL: "https://books-cf306-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "books-cf306",
    storageBucket: "books-cf306.appspot.com",
    messagingSenderId: "869907877033",
    appId: "1:869907877033:web:7947347edbde35023b2db8"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  }
  
}
