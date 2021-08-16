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




















