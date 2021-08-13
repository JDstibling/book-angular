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

  // status pour le download d'images
  fileIsUploading = false;
  
  fileURL :string = '';

  url : string = '';

  // fin de download du fichier 
  fileUploaded = false;

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

    // si présence d'un url d'un fichier
    if(this.fileURL && this.fileURL !== ''){
      newBook.photo = this.url;
    }

    this.booksService.createNewBook(newBook);
    this.router.navigate(['/books']);
  }

  onUploadFile(file: File) {
    // déclanchement de la méthode du service et MàJ du dom en temps réel
    this.fileIsUploading = true;
    this.booksService.uploadFile(file).then(
      // si la méthode réussis, récupération d'un url
        (url: any) => {
          console.log(url);                                          // A CORRIGER
          this.fileURL = url ;
          this.fileIsUploading = false;
          this.fileUploaded = true;
        }

    )

  }

  detectFiles(event:any) { // après plusieurs recherche, ajout de any au event!)
    //utilisation de la méthode onUpFile avec l'event du dom en argument
    // lors de l'utilisation d'un input de type file il comporte un target avec un array files
    this.onUploadFile(event.target.files[0]);
  }

}
