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
    
      getSingleBook(id: number) {
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
    
}