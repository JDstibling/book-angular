import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Book } from '../models/Book.model';
import { BookService } from '../services/books.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, OnDestroy {

  books: Book[] = [];
  booksSubscription: Subscription = new Subscription;

  constructor(private booksService: BookService, private Router: Router) { }

  ngOnInit(): void {
    this.booksSubscription = this.booksService.booksSubject.subscribe(
      (books: Book[]) => {
        this.books = books;
      }
    );
    this.booksService.getBooks();
    this.booksService.emitBooks();
    
  }

  onNewBook() {
    this.Router.navigate(['/books', 'new']);

  }

  onDeletebook(book: Book) {
    this.booksService.removeBook(book);
  }

  onViewBook(id : number) {
    this.Router.navigate(['/books', 'view', id]);
  }

  ngOnDestroy() {
    this.booksSubscription.unsubscribe();
  }

}
