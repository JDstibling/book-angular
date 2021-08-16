# book-angular

**Structure de l'application**
-

- **User** :
	- un component pour la création d'un new user
   - un component pour s'authentifier
   - un service pour gérer les interactions avec le back end.

- **Book** : 
	- un component pour consulter et afficher la liste complète
	 - un component pour pour la vue individuelle
	 - un component pour la création / modification
	 - un service pour gérer les fonctionnalités liées aux components  + les interactions avec le serveur

- **Nav** : 
	- Component dédié à la navigation pour une logique séparé

- **Model**:
	- un model pour les livres comportant simplement le titre, l'auteur  et la photo qui sera facultative

- **Routing** :
	- Création d'un routing permettant l'accès aux différentes parties avec une guard pour toutes les routes sauf authentification.



**Etape 1**
*Structurer l'application* 
-
- Utilisation du cli pour la création des components : 

    ng g c auth/signup
    ng g c auth/signin
    ng g c book-list 
    ng g c book-list/single-book
    ng g c book-list/book-form
    ng g c header
    ng g s services/auth
    ng g s services/books
    ng g s services/auth-guard
    

> Attention, le CLI ne créer pas correctement les services, mieux vaut les créer manuellement !

- Ajout des services dans l'array **providers** d'**appModule**

- Ajout  de **FormsModule**, **reactiveModule** et **HttpClientModule** dans Import de **app.module**

> Ne pas oublier d'ajouter les imports en haut du fichier !

**Etape 2**
*Intégration du router (sans guard afin de tester toutes les routes)* 
-
    const appRoutes: Routes = [
    { path: 'auth/signup', component: SignupComponent },
    { path: 'auth/signin', component: SigninComponent },
    { path: 'books', component: BookListComponent },
    { path: 'books/new', component: BookFormComponent },
    { path: 'books/view/:id', component: SingleBookComponent },
      { path: '', redirectTo: 'books', pathMatch: 'full' },
    { path: '**', redirectTo: 'books' }
    ];

- Imports du router dans **imports** de **app.module**

    imports: [

        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes)
    ],

- Générer un dossier **Models** et créer le fichier model pour les books exemple *book.model.ts*

- Eventuellement, installation de boostrap

    *npm install bootstrap@3.3.7 --save*

- Modifier le fichier angular.json


    "styles": [
            "../node_modules/bootstrap/dist/css/bootstrap.css",
            "styles.css"
    ],

- Préparer  HeaderComponent  avec un menu de navigation, avec les  routerLink  et AppComponent qui l'intègre avec le  router-outlet.

**Etape 3**
*Intéger Firebase à l'application et paramètrage* 
-
*npm install firebase --save*

- Choisir "Ajouter Firebase à votre application Web" et copier-coller la configuration dans le constructeur du AppComponent  
(en ajoutant  import firebase from 'firebase';  en haut du fichier, mettant à disposition la méthode  initializeApp() ) : 

**Etape 4**
*AuthService* 
-
- Création de la méthode createNewUser() qui prendra comme argument une adresse mail et un mot de passe, et qui retournera une Promise qui résoudra si la création réussit, et sera rejetée avec le message d'erreur si elle ne réussit pas.

*Toutes les méthodes liées à l'authentification Firebase se trouvent dans  firebase.auth()*

**Etape 5**
*signInUser* et *signOutUser*
-
*méthode très similaire, qui s'occupera de connecter un utilisateur déjà existant ainsi qu'une méthode simple pour déconnecter un user*



**Etape 6**
-

- Création des components signupComponent et signInComponent
    -   Dans ce component :il faut générer le formulaire selon la méthode réactive. 
    Les deux champs,  email  et  password , sont requis 
    - Le champ  email  utilise  Validators.email  pour obliger un string sous format d'adresse email
    - le champ  password  emploie  Validators.pattern  pour obliger au moins 6 caractères alphanumériques, ce qui correspond au minimum requis par Firebase

    - Gérer la soumission du formulaire, envoyant les valeurs rentrées par l'utilisateur à la méthode  createNewUser().

    - si la création fonctionne, redirection de l'utilisateur vers  /books.

    - Si elle ne fonctionne pas, affichage du message d'erreur renvoyé par Firebase.

    - Intégration de l'authentification dans le component header afin de montrer les bon liens et implémenter Authguard pour protéger la route /books et toutes les sous routes.

- Créer le template correspondant + copie quasi identique pour le template pour signInComponent pour la connexion d'un utilisateur déjà existant.
    
    *Il suffit de renommer  signupForm  en  signinForm  et d'appeler la méthode  signInUser()  plutôt que  createNewUser()*

- Modifier le component header pour afficher de manière contextuelle les liens de connexion
    - Utilisation de onAuthStateChanged() (méthode native de firebase) qui permet d'observer l'état de l'authentification de l'user à chaque changement d'état.
    Si l'utilisateur est bien authentifié, onAuthStateChanged() reçoit l'objet de type firebase.user correspondant à l'user.
    Modification de la variable locale isAuth en fonction du résultat de cet état.

- Création de AuthGuardService (en asynchrone donc avec une promise)
    - puis appliquer le guard aux routes concernées 


**Etape 7** 
*base de données*
-

- Création de BookService 
    - Créer un array local et un subject pour l'emettre
    - Créer les méthodes nécessaires :
        - Enregistrement de la liste des livres sur le serveur :
            - Méthode native de firebase pour enregistrer la liste sur un node de la bdd, *la méthode set()* retourne une référence au node demandé de la base de données, et  set()  fonctionne plus ou moins comme  put()  pour le HTTP : il écrit et remplace les données au node donné.
        - Récupération de la liste des livres depuis le serveur
            - Pour  getBooks() , utilisation de la méthode  *on()* . 
            > Ajouter un constructor au service pour appeler  getBooks()  au démarrage de l'application 
        - Récupérer un seul livre :
            - La fonction  getSingleBook()  récupère un livre selon son id, qui est simplement ici son index dans l'array enregistré.  Utiliser la méthode native de firebase  *once()* , qui ne fait qu'une seule requête de données.  Du coup, elle ne prend pas une fonction callback en argument mais retourne une Promise, permettant l'utilisation de  .then()  pour retourner les données reçues.
        - Créer un nouveau livre
        - Supprimer un livre existant

**Etape 8** 
*BookListComponent*
-
- Souscrit au Subject du service et déclenche sa premiere émission
- Affiche la liste des livres, où chaque livre peut être cliqué pour voir la page SingleBookComponent
- Permet de supprimer chaque livre en utilisant removeBook()
Permet de naviguer vers BookFormComponent pour la création d'un nouveau livre


    @Component({
    selector: 'app-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.css']
    })
    export class BookListComponent implements OnInit, OnDestroy {

    books: Book[];
    booksSubscription: Subscription;

    constructor(private booksService: BooksService, private router: Router) {}

    ngOnInit() {
        this.booksSubscription = this.booksService.booksSubject.subscribe(
        (books: Book[]) => {
            this.books = books;
        }
        );
        this.booksService.emitBooks();
    }

    onNewBook() {
        this.router.navigate(['/books', 'new']);
    }

    onDeleteBook(book: Book) {
        this.booksService.removeBook(book);
    }

    onViewBook(id: number) {
        this.router.navigate(['/books', 'view', id]);
    }
    
    ngOnDestroy() {
        this.booksSubscription.unsubscribe();
    }
    }

**Etape 9** 
*singleBookComponent*
-
- Récupération du livre demandé par son id grace à getSingleBook()

    @Component({
    selector: 'app-single-book',
    templateUrl: './single-book.component.html',
    styleUrls: ['./single-book.component.css']
    })
    export class SingleBookComponent implements OnInit {

    book: Book;

    constructor(private route: ActivatedRoute, private booksService: BooksService,
                private router: Router) {}

    ngOnInit() {
        this.book = new Book('', '');
        const id = this.route.snapshot.params['id'];
        this.booksService.getSingleBook(+id).then(
        (book: Book) => {
            this.book = book;
        }
        );
    }

    onBack() {
        this.router.navigate(['/books']);
    }
    }

- Puis affichage dans le template

**Etape 10** 
*BookFormComponent*
-
- Formulaire (méthode réactive) qui enregistre les données reçues grace à createNewBook()

    @Component({
    selector: 'app-book-form',
    templateUrl: './book-form.component.html',
    styleUrls: ['./book-form.component.css']
    })
    export class BookFormComponent implements OnInit {

    bookForm: FormGroup;

    constructor(private formBuilder: FormBuilder, private booksService: BooksService,
                private router: Router) { }
                
    ngOnInit() {
        this.initForm();
    }
    
    initForm() {
        this.bookForm = this.formBuilder.group({
        title: ['', Validators.required],
        author: ['', Validators.required],
        synopsis: ''
        });
    }
    
    onSaveBook() {
        const title = this.bookForm.get('title').value;
        const author = this.bookForm.get('author').value;
        const synopsis = this.bookForm.get('synopsis').value;
        const newBook = new Book(title, author);
        newBook.synopsis = synopsis;
        this.booksService.createNewBook(newBook);
        this.router.navigate(['/books']);
    }
    }

**Etape 11** 
*Storage*
-
Utilisation de l'API Firebase pour permettre à l'user d'ajouter une photo du livre et de l'afficher dans singleBookComponent et de la supprimer si on supprime le livre pour ne pas laisser des photos inutilisées sur le serveur.

- Méthode pour uploader une image

    uploadFile(file: File) {
        return new Promise(
        (resolve, reject) => {
            const almostUniqueFileName = Date.now().toString();
            const upload = firebase.storage().ref()
            .child('images/' + almostUniqueFileName + file.name).put(file);
            upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
            () => {
                console.log('Chargement…');
            },
            (error) => {
                console.log('Erreur de chargement ! : ' + error);
                reject();
            },
            () => {
                resolve(upload.snapshot.ref.getDownloadURL());
            }
            );
        }
        );
    }

    - Méthode asynchrone qui prends en argumenbt un fichier de type file.
    - Pour créer un nom de fichier unique, utilisation d'un string à partir de Date.now .
    Création ensuite d'une tâche de chargement (upload)
        - firebase.storage().ref() retourne une référence à la racine du bucket Firebase.
        - La méthode child() retourne une référence au sous dossier images et à un nouveau fichier dont le nom est l'identifiant unique + le nom original du fichier (permettant de garder le format d'origine également)
        - Utilisation de la méthode on() de la tâche upload pour en suivre l'état en y passant 3 fonctions :
            - la première est déclenchée à chaque fois que les données sont envoyées vers le serveur
            - la deuxième est déclenchée si le serveur renvoie une erreur
            - La troisième est déclenchée lorsque le chargement est terminé et permet de retourner l'URL unique du fichier chargé.
> Pour des applications à très grande échelle, la méthode  Date.now()  ne garantit pas à 100% un nom de fichier unique, mais pour une application de cette échelle, cette méthode suffit largement.


**Etape 12** 
*Ajout de fonctionnalités à BookFormComponent*
-

    bookForm: FormGroup;
    fileIsUploading = false;
    fileUrl: string;
    fileUploaded = false;

- Créer la méthode qui déclenchera uploadfile() et qui en récupérera l'URL retourné


    onUploadFile(file: File) {

        this.fileIsUploading = true;
        this.booksService.uploadFile(file).then(
        (url: string) => {
            this.fileUrl = url;
            this.fileIsUploading = false;
            this.fileUploaded = true;
        }
        );
    }

>Utilisation de fileIsUploading pour desactiver le bouton submit du template pendant le chargement du fichier afin d'éviter toute erreur. Une fois l'upload terminé, le component enregistre l'URL retourné dans fileUrl et modifie l'état du component pour dire que le chargement est terminé.

**Etape 13** 
*books-list-component*
-
- Modification légère de onSaveBook pour prendre en compte l'URL de la photo si elle existe*

    onSaveBook() {
        const title = this.bookForm.get('title').value;
        const author = this.bookForm.get('author').value;
        const synopsis = this.bookForm.get('synopsis').value;
        const newBook = new Book(title, author);
        newBook.synopsis = synopsis;
        if(this.fileUrl && this.fileUrl !== '') {
        newBook.photo = this.fileUrl;
        }
        this.booksService.createNewBook(newBook);
        this.router.navigate(['/books']);
    }
- Création d'une méthode qui permet de lier le input de type file à la méthode onUploadFile()

    detectFiles(event) {

        this.onUploadFile(event.target.files[0]);
    }
    
> Dans le template : Dès que l'utilisateur choisit un fichier, l'événement est déclenché et le fichier est uploadé.  Le texte "Fichier chargé !" est affiché lorsque  fileUploaded  est  true , et le bouton est désactivé quand le formulaire n'est pas valable ou quand  fileIsUploading  est  true .

>Puis si l'image existe, l'afficher dans le component SingleBookComponent

Il faut également prendre en compte que si un livre est supprimé, il faut également en supprimer la photo.  La nouvelle méthode  removeBook()  est la suivante :

    removeBook(book: Book) {
        if(book.photo) {
        const storageRef = firebase.storage().refFromURL(book.photo);
        storageRef.delete().then(
            () => {
            console.log('Photo removed!');
            },
            (error) => {
            console.log('Could not remove photo! : ' + error);
            }
        );
        }
        const bookIndexToRemove = this.books.findIndex(
        (bookEl) => {
            if(bookEl === book) {
            return true;
            }
        }
        );
        this.books.splice(bookIndexToRemove, 1);
        this.saveBooks();
        this.emitBooks();
    }

>Puisqu'il faut une référence pour supprimer un fichier avec la méthode  delete() , vous passez l'URL du fichier à  refFromUrl()  pour en récupérer la référence.























