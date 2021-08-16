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
    { path: 'books/view/:id', component: SingleBookComponent }
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

- Préparez  HeaderComponent  avec un menu de navigation, avec les  routerLink  et AppComponent qui l'intègre avec le  router-outlet.





