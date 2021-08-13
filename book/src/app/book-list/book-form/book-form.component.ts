import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/Book.model';
import { BookService } from 'src/app/services/books.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.scss']
})
export class BookFormComponent implements OnInit {

  // form reactive donc besoin d'ajouter formbuilder dans le constructor + initform dans ngoninit
  bookForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private booksService: BookService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    //initialisation du form reactive
    this.bookForm = this.formBuilder.group(
      {
        title: ['', Validators.required],
        author: ['', Validators.required]
      }
    );
  }

  onSaveBook() {
    //récupération des datas, création d'un book et redirection
    const title = this.bookForm.get('title')?.value;
    const author = this.bookForm.get('author')?.value;
    const newBook = new Book(title, author);
    this.booksService.createNewBook(newBook);
    this.router.navigate(['/books']);
  }

}
