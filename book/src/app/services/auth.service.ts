import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import firebase from 'firebase/app';



//import { Promise } from 'dns';
//import * as firebase from 'firebase';

@Injectable()
export class AuthService {

    constructor() {}

    createNewUser(email: string, password: string) {
        return new Promise<void>(
          (resolve, reject) => {
            firebase.auth().createUserWithEmailAndPassword(email, password).then(
              () => {
                resolve();
              },
              (error) => {
                reject(error);
              }
            );
          }
        );
    }
    
}