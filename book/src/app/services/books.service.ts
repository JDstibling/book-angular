import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Book } from "../models/Book.model";
import firebase from 'firebase';

@Injectable()
export class BookService {

    books: Book[] = [];
    booksSubject = new Subject<Book[]>();

    constructor() {}

    emitBooks() {
        this.booksSubject.next(this.books);
    }

    saveBooks() {
        // enregistrer les livres en BDD
        // .set réagi comme une requête .put en http (écrasement des datas si existant)
        firebase.database().ref('/books').set(this.books)
    }

    getBooks() {
        firebase.database().ref('/books')
        // .on permet de réagir aux modif de la BDD (voir doc firebase) en temps réel
          .on('value', (data) => {
              this.books = data.val() ? data.val() : [];
              this.emitBooks();
            }
          );
      }
    
      getSingleBook(id: number): Promise<Book> {
        // afin de s'assurer de retourner un objet Book, ajout de "Promise<book>"
        return new Promise(
          (resolve, reject) => {
              // la méthode .once utilisé pour récupèrer les data une seule fois
            firebase.database().ref('/books/' + id).once('value').then(
              (data) => {
                resolve(data.val());
              }, (error) => {
                reject(error);
              }
            );
          }
        );
      }

      createNewBook(newBook: Book) {
          this.books.push(newBook);
          this.saveBooks();
          this.emitBooks();

      }

      removeBook(book: Book) {
          const bookINdexToRemove = this.books.findIndex(
              (bookEl) =>{
                if(bookEl === book) {
                    return true;
                }else {
                    return false;
                }
              }
          );
          this.books.splice(bookINdexToRemove, 1);
          this.saveBooks();
          this.emitBooks();
          

      }

      uploadFile(file: File) {
        return new Promise(
          (resolve, reject) => {
            // création d'un nom de fichier unique (via les millisecondes inclu dans la méthode now)
            const almostUniqueFileName = Date.now().toString();
            //création de l'upload du fichier
            const upload = firebase.storage().ref()   // ref sans argument rend la racine du storage
            .child('images/' + almostUniqueFileName + file.name)
            // enregistrement du file dans le dossier, (au nom de fichier choisis) comme sous dossier de la racine du storage
            .put(file);
            // Réagir aux différents événements lié à l'upload (les inclures dans les paramètres de la méthode "on")
            upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
              // ajout des 3 méthodes nécessaire (pendant, si erreur et si resolve)
              () => {
                console.log('chargement...');
              },
              (error) => {
                console.log('l\'erreur ' + error + 'a été rencontrée');
                reject();
              },
              () => {
                //resolve(upload.snapshot.downloadURL); // ancienne méthode buggué 
                //  doc : https://firebase.google.com/docs/storage/web/upload-files
                resolve(upload.snapshot.ref.getDownloadURL());
              }

            );
          }
        )
      }
    
}