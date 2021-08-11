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
                console.log('Création user');
              },
              (error) => {
                reject(error);
                console.log('Une erreur a été rencontré lors de la création d\'un user' +error);
              }
            );
          }
        );
    }

    signInUser(email: string, password: string) {
        return new Promise<void>(
          (resolve, reject) => {
            firebase.auth().signInWithEmailAndPassword(email, password).then(
              () => {
                resolve();
                console.log('Connexion user');
              },
              (error) => {
                reject(error);
                console.log('Une erreur a été rencontré lors de la connexion' +error);
              }
            );
          }
        );
    }

    signOutUser() {
        firebase.auth().signOut();
    }
    
}