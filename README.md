[![Netlify Status](https://api.netlify.com/api/v1/badges/0de2ab52-9ef9-4a42-bc3b-117ea726814a/deploy-status)](https://app.netlify.com/sites/ejelome-react-chat/deploys)

# react-chat

Learn [React](https://reactjs.org) and [Firebase](https://firebase.google.com) with a chatroom

---

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->

**Table of Contents**

- [react-chat](#react-chat)
  - [Demo](#demo)
  - [Setup](#setup)
  - [Usage](#usage)
  - [Lessons](#lessons)
    - [1. Setup Firebase](#1-setup-firebase)
    - [2. Setup Cloud Firestore](#2-setup-cloud-firestore)
    - [3. Setup Authentication](#3-setup-authentication)
      - [3.1. Facebook](#31-facebook)
    - [4. Setup Netlify](#4-setup-netlify)
      - [4.1. Facebook](#41-facebook)
    - [5. Write, read, delete](#5-write-read-delete)
  - [References](#references)
  - [License](#license)

<!-- markdown-toc end -->

---

## Demo

See <https://ejelome-react-chat.netlify.app>.

---

## Setup

| Command                                            | Description          |
| :------------------------------------------------- | :------------------- |
| `npm [install`&vert;`isntall`&vert;`add`&vert;`i]` | Install dependencies |

---

## Usage

| Command                          | Description       |
| :------------------------------- | :---------------- |
| `npm start`                      | Start dev server  |
| `npm [test`&vert;`tst`&vert;`t]` | Start test runner |
| `npm run build`                  | Build app bundle  |

---

## Lessons

### 1. Setup Firebase

<details>
  <summary>1.1. Setup remote</summary>

- 1.1.1. Sign in on [Firebase](https://firebase.google.com)
- 1.1.2. Go to [Firebase console](https://console.firebase.google.com)
- 1.1.3. Click `Create a project`

  - 1.1.3.1. Enter the project name (e.g. `<username>-react-chat`)
  - 1.1.3.2. Click `Continue`
  - 1.1.3.3. Uncheck `Enable Google Analytics for this project`
  - 1.1.3.4. Click `Create project`

- 1.1.4. On `Overview - Firebase console` page, click `</>` (Web) icon

  - 1.1.4.1. Enter `App nickname` (e.g. `react-chat`)
  - 1.1.4.2. Click `Register app`
  - 1.1.4.3. Copy `firebaseConfig` object
  - 1.1.4.4. Click `Continue to console`

</details>

<details>
  <summary>1.2. Setup local</summary>

- 1.2.1. Write `firebaseConfig` values

  ```diff
  --- .env.local
  +++ .env.local
  @@ -0,0 +1,7 @@
  +REACT_APP_FIREBASE_API_KEY=<apiKey>
  +REACT_APP_FIREBASE_AUTH_DOMAIN=<authDomain>
  +REACT_APP_FIREBASE_DATABASE_URL=<databaseURL>
  +REACT_APP_FIREBASE_PROJECT_ID=<projectId>
  +REACT_APP_FIREBASE_STORAGE_BUCKET=<storageBucket>
  +REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
  +REACT_APP_FIREBASE_APP_ID=<appId>
  ```

- 1.2.2. Install `firebase`

  ```shell
  $ npm i firebase
  ```

- 1.2.3. Initialize `firebase`

  ```diff
  --- src/firebase.js
  +++ src/firebase.js
  @@ -0,0 +1,11 @@
  +import firebase from "firebase/app";
  +
  +firebase.initializeApp({
  +  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  +  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  +  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  +  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  +  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  +  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  +  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  +});
  ```

  > **NOTES**
  >
  > - `initializeApp` creates and initializes a firebase `app` instance
  > - `app` contains initialization information of collection of services
  > - `app` should not be called directly, use `initializeApp` to create `app`

</details>

### 2. Setup Cloud Firestore

<details>
  <summary>2.1. Setup database</summary>

- 2.1.1. Go back to `Project Overview`
- 2.1.2. Click `Cloud Firestore`
- 2.1.3. Click `Create database`
- 2.1.4. Select `Start in production mode` then click `Next`
- 2.1.5. Select a `Cloud Firestore location` (e.g. `asia-southeast2`) the click `Enable`

> **NOTES**
>
> - `Cloud Firestore` (new) is the successor of `Realtime Database` (old)
> - The `Cloud Firestore location` must be where the app be mostly used

</details>

<details>
  <summary>2.2. Setup rules</summary>

- 2.2.1. Click `Data`
- 2.2.2. Write `Edit rules`

  ```diff
  --- Edit rules
  +++ Edit Rules
  @@ -1,8 +1,13 @@
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
  -    match /{document=**} {
  -      allow read, write: if false;
  +    match /users/{uid} {
  +      allow update, delete: if request.auth != null && request.auth.uid == uid;
  +      allow create, read: if request.auth != null;
  +    }
  +    match /messages/{id} {
  +      allow update, delete: if request.auth != null && request.auth.uid == resource.data.uid;
  +      allow create, read: if request.auth != null;
       }
     }
   }
  ```

  > **NOTES**
  >
  > - `request.auth != null` only allows action if authenticated
  > - `request.auth.uid == uid` only allows action if authenticated `uid` is the `Document ID`
  > - `request.auth.uid == resource.data.uid` only allows action if authenticated user owns the document

- 2.2.3. Click `Publish`

</details>

### 3. Setup Authentication

<details>
  <summary>3.1. Setup remote</summary>

- 3.1.1. On `Project Overview`, click `Authentication`
- 3.1.2. Click `Get started`
- 3.1.3. Click `Sign-in method`
- 3.1.4. Under `Sign-in providers`, click a provider (e.g. `Facebook`)

  - 3.1.4.1. Click `Enable`
  - 3.1.4.2. Provide required details
  - 3.1.4.3. Click `Save`

#### 3.1. Facebook

- 3.1.1. Log in on [Facebook for Developers](https://developers.facebook.com)
- 3.1.2. Click `My Apps`
- 3.1.3. Click `Create App`

  - 3.1.3.1. Click `Build Connected Experiences`
  - 3.1.3.2. Write `App Display Name` (e.g. `react-chat`)
  - 3.1.3.3. Click `Create App`
  - 3.1.3.4. Pass `Security Check` then click `Submit`

- 3.1.4. Click `Setup` under `Facebook Login`
- 3.1.5. Click `www` (Web) icon

  - 3.1.5.1. Write `Site URL` (e.g. http://localhost:3000)
  - 3.1.5.2. Click `Save`

- 3.1.6. Click `Settings` then `Basic`

  - 3.1.6.1. Copy and paste `App ID` on `App ID` in `Facebook`'s `Sign-in providers`
  - 3.1.6.2. Click `Show` on `App Secret`
  - 3.1.6.3. Copy and paste `App ID` on `App secret` in `Facebook`'s `Sign-in providers`

- 3.1.7. Under `PRODUCTS`, click `Facebook Login` then `Settings`

  - 3.1.7.1. Copy `OAuth redirect URI` from `Facebook`'s `Sign-in providers`
  - 3.1.7.2. Paste it on `Valid OAuth Redirect URIs`
  - 3.1.7.3. Click `Save Changes`

</details>

<details>
  <summary>3.2. Setup local</summary>

- 3.2.1. Export `auth` and provider (e.g. `Facebook*`)

  ```diff
  --- src/firebase.js
  +++ src/firebase.js
  @@ -1,11 +1,16 @@
  +import "firebase/auth";
  +
   import firebase from "firebase/app";

   firebase.initializeApp({
     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
     databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.REACT_APP_FIREBASE_APP_ID,
   });
  +
  +export const auth = firebase.auth();
  +export const provider = { facebook: new firebase.auth.FacebookAuthProvider() };
  ```

  > **NOTES**
  >
  > - `auth` gets the `Auth` service of the default (or given) `app`
  > - `Auth` is the firebase Auth service interface
  > - `Auth` should not be called directly, use `auth` instead to get `Auth`
  > - `FacebookAuthProvider` is the Facebook auth provider

- 3.2.2. Use `auth` with provider

  ```diff
  --- src/App.js
  +++ src/App.js
  @@ -1,25 +1,32 @@
  -import logo from './logo.svg';
  -import './App.css';
  +import { useState } from "react";

  -function App() {
  -  return (
  -    <div className="App">
  -      <header className="App-header">
  -        <img src={logo} className="App-logo" alt="logo" />
  -        <p>
  -          Edit <code>src/App.js</code> and save to reload.
  -        </p>
  -        <a
  -          className="App-link"
  -          href="https://reactjs.org"
  -          target="_blank"
  -          rel="noopener noreferrer"
  -        >
  -          Learn React
  -        </a>
  -      </header>
  -    </div>
  +import { auth, provider } from "./firebase";
  +
  +const App = () => {
  +  const initialState = { currentUser: null };
  +  const [data, setData] = useState(initialState);
  +
  +  const handleFacebookSignIn = ({ facebook }) =>
  +    auth
  +      .signInWithPopup(facebook)
  +      .then(({ user, credential }) => {
  +        const { uid, email, displayName: name, photoURL: avatar } = user;
  +        const { accessToken } = credential;
  +        const newUser = { uid, email, name, avatar, accessToken };
  +
  +        setData((prevData) => ({ ...prevData, currentUser: newUser }));
  +      })
  +      .catch((error) => console.error(error));
  +
  +  const { currentUser } = data;
  +
  +  return currentUser ? (
  +    <h1>Hello {currentUser.name}!</h1>
  +  ) : (
  +    <button onClick={() => handleFacebookSignIn(provider)}>
  +      Sign in with Facebook
  +    </button>
     );
  -}
  +};

   export default App;
  ```

  > **NOTES**
  >
  > - `signInWithPopup` authenticates with pop-up based OAuth authenticaion flow
  > - `signInWithPopup` returns `user`, `credential`, `additionalUserInfo` and `operationType` if successful
  > - `signInWithPopup` returns an `error` object if unsuccessful
  > - `user` and `additionalUserInfo` objects contain user information
  > - `user` is where to get the `uid` that can be used with firebase
  > - `additionalUserInfo` is where to know if a user is a newly registered user
  > - `credential` object contains tokens, provider ID and sign in method used
  > - `credential` is where to obtain `accessToken` used to display profile image
  > - `operationType` is a string containing type of operation used (e.g. `signIn`)

- 3.2.3 Resolve authentication on re-render

  ```diff
  --- src/App.js
  +++ src/App.js
  @@ -1,32 +1,40 @@
  -import { useState } from "react";
  +import { useEffect, useState } from "react";

   import { auth, provider } from "./firebase";

   const App = () => {
     const initialState = { currentUser: null };
     const [data, setData] = useState(initialState);

  +  useEffect(() => {
  +    const unsubscribe = auth.onAuthStateChanged((user) =>
  +      setData((prevData) => ({ ...prevData, currentUser: user }))
  +    );
  +
  +    return unsubscribe;
  +  });
  +
     const handleFacebookSignIn = ({ facebook }) =>
       auth
         .signInWithPopup(facebook)
         .then(({ user, credential }) => {
           const { uid, email, displayName: name, photoURL: avatar } = user;
           const { accessToken } = credential;
           const newUser = { uid, email, name, avatar, accessToken };

           setData((prevData) => ({ ...prevData, currentUser: newUser }));
         })
         .catch((error) => console.error(error));

     const { currentUser } = data;

     return currentUser ? (
       <h1>Hello {currentUser.name}!</h1>
     ) : (
       <button onClick={() => handleFacebookSignIn(provider)}>
         Sign in with Facebook
       </button>
     );
   };

   export default App;
  ```

  > **NOTES**
  >
  > - `onAuthStateChanged` adds an observer that triggers on user's sign-in/out state
  > - Assigning and returning its callback ensures cleanup when components re-render

- 3.2.4 Store authenticated user to database

  > **NOTES**
  >
  > - `collection` gets a `CollectionReference` object
  > - `CollectionReference` is used for adding, getting and querying documents
  > - `doc` gets a `DocumentReference` object within the collection
  > - `DocumentReference` refers to a document location in firestore
  > - `get` returns query results as `QuerySnapshot`
  > - `QuerySnapshot` returns zero or more `DocumentSnapshot` objects
  > - `DocumentSnapshot` returns document data that can be read with `data()` or `get()`
  > - `data()` returns the whole document while `get()` returns the specific document field
  > - `exists` can be used to verify if a document exists before further access
  > - `set` creates (if none existing) or overwrites the whole document
  > - `set` with the option `merge` will only overwrite specified document fields
  > - `update` updates only the specified document fields, fails if document don't exist
  > - Since _writes_ are twice as expensive than _reads_, avoid unnecessary writes (`set`, `update`)

- 3.2.5. Include signing out

  ```diff
  --- src/App.js
  +++ src/App.js
  @@ -1,64 +1,70 @@
   import { useEffect, useState } from "react";

   import { auth, db, provider } from "./firebase";

   const App = () => {
     const initialState = { user: null };
     const [data, setData] = useState(initialState);
     const { user } = data;

     useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged((user) => {
         if (user) {
           const { uid } = user;

           db.collection("users")
             .doc(uid)
             .get()
             .then((doc) =>
               setData((prevData) => ({ ...prevData, user: doc.data() }))
             )
             .catch((error) => console.log(error));
         }
       });

       return unsubscribe;
     }, []);

     const handleFacebookSignIn = () => {
       const { facebook } = provider;

       auth
         .signInWithPopup(facebook)
         .then(({ user, credential }) => {
           const { uid, email, displayName: name, photoURL: avatar } = user;
           const { accessToken } = credential;
           const newUser = { uid, email, name, avatar, accessToken };

           db.collection("users")
             .doc(uid)
             .get()
             .then(({ exists }) => {
               if (!exists) {
                 db.collection("users").doc(uid).set(newUser);
               } else {
                 db.collection("users").doc(uid).update({ accessToken });
               }

               setData((prevData) => ({ ...prevData, user: newUser }));
             })
             .catch((error) => console.log(error));
         })
         .catch((error) => console.error(error));
     };

  +  const handleSignOut = () => {
  +    auth.signOut().catch((error) => console.error(error));
  +    setData(initialState);
  +  };
  +
     return user && Object.keys(user).length ? (
       <h1>
         <span>Hello {user.name}!</span>
  +      <button onClick={handleSignOut}>Sign Out</button>
       </h1>
     ) : (
       <button onClick={handleFacebookSignIn}>Sign in with Facebook</button>
     );
   };

   export default App;
  ```

  > **NOTE** <br />
  > The `signOut`, as the name implies, signs out the signed-in user.

</details>

### 4. Setup Netlify

<details>
  <summary>4.1. Setup domain</summary>

- 4.1.1. Go back to `Project Overview`
- 4.1.2. Click `Authentication`
- 4.1.3. Click `Sign-in method`
- 4.1.4. Under `Sign-in providers`, select provider (e.g. `Facebook`)
- 4.1.5. Click `Add domain`
- 4.1.6. Enter domain (e.g. `<username>-react-chat.netlify.app`)
- 4.1.7. Click `Add`

</details>

#### 4.1. Facebook

<details>
  <summary>4.1.1. Setup tester</summary>

- 4.1.1.1. Go back to app's `Dashboard`
- 4.1.1.2. Click `Roles` then `Roles`
- 4.1.1.3. Under `Testers`, click `Add Tester`
- 4.1.1.4. Enter user
- 4.1.1.5. Click `Submit`

> **NOTE** <br />
> The user(s) will receive a verification on Facebook that must be confirmed.

</details>

### 5. Write, read, delete

> `add`, `get`, `set`, `update` and `delete`.

<details>
  <summary>5.1. Write (<code>add</code>, <code>set</code> or <code>update</code>)</summary>

- 5.1.1. Export `firebase`

  ```diff
  --- src/firebase.js
  +++ src/firebase.js
  @@ -1,24 +1,24 @@
   import "firebase/auth";
   import "firebase/firestore";

   import firebase from "firebase/app";

   firebase.initializeApp({
     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
     databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
     projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
     storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
     messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
     appId: process.env.REACT_APP_FIREBASE_APP_ID,
   });

   const auth = firebase.auth();

   const provider = {
     facebook: new firebase.auth.FacebookAuthProvider(),
   };

   const db = firebase.firestore();

  -export { auth, db, provider };
  +export { auth, db, firebase, provider };
  ```

  > **NOTE** <br />
  > Export `firebase` to later generate timestamps from `FieldValue.serverTimestamp`.

- 5.1.2. Use `add` with a timestamp

  ```diff
  --- src/App.js
  +++ src/App.js
  @@ -1,72 +1,110 @@
  -import { useEffect, useState } from "react";
  +import { useEffect, useRef, useState } from "react";

  -import { auth, db, provider } from "./firebase";
  +import { auth, db, firebase, provider } from "./firebase";

   const App = () => {
  -  const initialState = { user: null };
  +  const initialState = {
  +    user: null,
  +    messages: [],
  +  };
     const [data, setData] = useState(initialState);
     const { user } = data;

  +  const inputRef = useRef();
  +
     useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged((user) => {
         if (user) {
           const { uid } = user;

           db.collection("users")
             .doc(uid)
             .get()
             .then((doc) =>
               setData((prevData) => ({ ...prevData, user: doc.data() }))
             )
             .catch((error) => console.log(error));
         }
       });

       return unsubscribe;
     }, []);

     const handleFacebookSignIn = () => {
       const { facebook } = provider;

       auth
         .signInWithPopup(facebook)
         .then(({ user, credential }) => {
           const { uid, email, displayName: name, photoURL: avatar } = user;
           const { accessToken } = credential;
           const newUser = { uid, email, name, avatar, accessToken };

           db.collection("users")
             .doc(uid)
             .get()
             .then(({ exists }) => {
               if (!exists) {
                 db.collection("users").doc(uid).set(newUser);
               } else {
                 db.collection("users").doc(uid).update({ accessToken });
               }

               setData((prevData) => ({ ...prevData, user: newUser }));
             })
             .catch((error) => console.log(error));
         })
         .catch((error) => console.error(error));
     };

     const handleSignOut = () => {
       auth.signOut().catch((error) => console.error(error));
       setData(initialState);
     };

  +  const handleSend = () => {
  +    const { value: text } = inputRef.current;
  +    const { uid, avatar, name } = user;
  +    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
  +    const message = { uid, avatar, name, text, timestamp };
  +
  +    const docRef = db.collection("messages").doc();
  +    const newDoc = { id: docRef.id, ...message };
  +
  +    docRef
  +      .set(newDoc)
  +      .then(() =>
  +        setData((prevData) => ({
  +          ...prevData,
  +          messages: [newDoc, ...prevData.messages],
  +        }))
  +      )
  +      .catch((error) => console.log(error));
  +
  +    inputRef.current.value = "";
  +  };
  +
  +  const handleSendEnter = ({ key }) => {
  +    const sendInputRefValue = inputRef.current.value.trim();
  +
  +    sendInputRefValue && key.toLowerCase() === "enter" && handleSend();
  +  };
  +
     return user && Object.keys(user).length ? (
       <>
         <h1>
           <span>Hello {user.name}!</span>
           <button onClick={handleSignOut}>Sign Out</button>
         </h1>
  +      <div>
  +        <h2>Message</h2>
  +        <input ref={inputRef} onKeyDown={handleSendEnter} />
  +        <button onClick={handleSend}>Send</button>
  +      </div>
       </>
     ) : (
       <button onClick={handleFacebookSignIn}>Sign in with Facebook</button>
     );
   };

   export default App;
  ```

  > **NOTES**
  >
  > - `FieldValue` provides sentinel values (e.g. flags, dummy data, etc.)
  > - `serverTimestamp` returns a server-generated timestamp
  > - `serverTimestamp` is commonly used as `Document ID`s for sort/order-ing
  > - `add` adds a new document to the specified collection
  > - `[message, ...prevData.messages]` _prepends_ the item to the array
  > - `?access_token` is required from Facebook to display the profile photo

</details>

<details>
  <summary>5.2. Read (<code>get</code>)</summary>

- 5.2.1. Display messages

  ```diff
  --- src/App.js
  +++ src/App.js
  @@ -1,110 +1,139 @@
   import { useEffect, useRef, useState } from "react";

   import { auth, db, firebase, provider } from "./firebase";

   const App = () => {
     const initialState = {
       user: null,
       messages: [],
     };
     const [data, setData] = useState(initialState);
  -  const { user } = data;
  +  const { user, messages } = data;

     const inputRef = useRef();

     useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged((user) => {
         if (user) {
           const { uid } = user;

           db.collection("users")
             .doc(uid)
             .get()
             .then((doc) =>
               setData((prevData) => ({ ...prevData, user: doc.data() }))
             )
             .catch((error) => console.log(error));
         }
       });

       return unsubscribe;
     }, []);

  +  useEffect(() => {
  +    db.collection("messages")
  +      .orderBy("timestamp", "desc")
  +      .get()
  +      .then((qs) => {
  +        const messages = [];
  +
  +        qs.forEach((doc) => messages.push(doc.data()));
  +
  +        setData((prevData) => ({ ...prevData, messages }));
  +      })
  +      .catch((error) => console.log(error));
  +  }, []);
  +
     const handleFacebookSignIn = () => {
       const { facebook } = provider;

       auth
         .signInWithPopup(facebook)
         .then(({ user, credential }) => {
           const { uid, email, displayName: name, photoURL: avatar } = user;
           const { accessToken } = credential;
           const newUser = { uid, email, name, avatar, accessToken };

           db.collection("users")
             .doc(uid)
             .get()
             .then(({ exists }) => {
               if (!exists) {
                 db.collection("users").doc(uid).set(newUser);
               } else {
                 db.collection("users").doc(uid).update({ accessToken });
               }

               setData((prevData) => ({ ...prevData, user: newUser }));
             })
             .catch((error) => console.log(error));
         })
         .catch((error) => console.error(error));
     };

     const handleSignOut = () => {
       auth.signOut().catch((error) => console.error(error));
       setData(initialState);
     };

     const handleSend = () => {
       const { value: text } = inputRef.current;
       const { uid, avatar, name } = user;
       const timestamp = firebase.firestore.FieldValue.serverTimestamp();
       const message = { uid, avatar, name, text, timestamp };

       const docRef = db.collection("messages").doc();
       const newDoc = { id: docRef.id, ...message };

       docRef
         .set(newDoc)
         .then(() =>
           setData((prevData) => ({
             ...prevData,
             messages: [newDoc, ...prevData.messages],
           }))
         )
         .catch((error) => console.log(error));

       inputRef.current.value = "";
     };

     const handleSendEnter = ({ key }) => {
       const sendInputRefValue = inputRef.current.value.trim();

       sendInputRefValue && key.toLowerCase() === "enter" && handleSend();
     };

     return user && Object.keys(user).length ? (
       <>
         <h1>
           <span>Hello {user.name}!</span>
           <button onClick={handleSignOut}>Sign Out</button>
         </h1>
         <div>
           <h2>Message</h2>
           <input ref={inputRef} onKeyDown={handleSendEnter} />
           <button onClick={handleSend}>Send</button>
  +        <ul>
  +          {messages.map(({ id, avatar, name, text }) => {
  +            avatar = `${avatar}?access_token=${user.accessToken}`;
  +
  +            return (
  +              <li key={id}>
  +                <div>
  +                  <img src={avatar} alt="" />
  +                </div>
  +                <em>{name} says:</em>
  +                <p>{text}</p>
  +              </li>
  +            );
  +          })}
  +        </ul>
         </div>
       </>
     ) : (
       <button onClick={handleFacebookSignIn}>Sign in with Facebook</button>
     );
   };

   export default App;
  ```

  > **NOTES**
  >
  > - `orderBy` creates and returns a sorted Query by specified field
  > - `orderBy` defaults to `asc` if not specified
  > - `get` reads document(s) from a collection
  > - `get` returns a `Promise` containing `DocumentSnapshot`
  > - `DocumentSnapshot` contains data read from documents
  > - `forEach` is a `QuerySnapshot`-specific method not JavaScript
  > - `QuerySnapshot` is an object not an array (`forEach` was an coincidental method name)
  > - `QuerySnapshot` has no corresponding array methods (e.g. `map`, `filter`, `reduce`)

</details>

<details>
  <summary>5.3. Delete (<code>delete</code>)</summary>

- 5.3.1. Delete a message

  ```diff
  --- src/App.js
  +++ src/App.js
  @@ -1,139 +1,154 @@
   import { useEffect, useRef, useState } from "react";

   import { auth, db, firebase, provider } from "./firebase";

   const App = () => {
     const initialState = {
       user: null,
       messages: [],
     };
     const [data, setData] = useState(initialState);
     const { user, messages } = data;

     const inputRef = useRef();

     useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged((user) => {
         if (user) {
           const { uid } = user;

           db.collection("users")
             .doc(uid)
             .get()
             .then((doc) =>
               setData((prevData) => ({ ...prevData, user: doc.data() }))
             )
             .catch((error) => console.log(error));
         }
       });

       return unsubscribe;
     }, []);

     useEffect(() => {
       db.collection("messages")
         .orderBy("timestamp", "desc")
         .get()
         .then((qs) => {
           const messages = [];

           qs.forEach((doc) => messages.push(doc.data()));

           setData((prevData) => ({ ...prevData, messages }));
         })
         .catch((error) => console.log(error));
     }, []);

     const handleFacebookSignIn = () => {
       const { facebook } = provider;

       auth
         .signInWithPopup(facebook)
         .then(({ user, credential }) => {
           const { uid, email, displayName: name, photoURL: avatar } = user;
           const { accessToken } = credential;
           const newUser = { uid, email, name, avatar, accessToken };

           db.collection("users")
             .doc(uid)
             .get()
             .then(({ exists }) => {
               if (!exists) {
                 db.collection("users").doc(uid).set(newUser);
               } else {
                 db.collection("users").doc(uid).update({ accessToken });
               }

               setData((prevData) => ({ ...prevData, user: newUser }));
             })
             .catch((error) => console.log(error));
         })
         .catch((error) => console.error(error));
     };

     const handleSignOut = () => {
       auth.signOut().catch((error) => console.error(error));
       setData(initialState);
     };

     const handleSend = () => {
       const { value: text } = inputRef.current;
       const { uid, avatar, name } = user;
       const timestamp = firebase.firestore.FieldValue.serverTimestamp();
       const message = { uid, avatar, name, text, timestamp };

       const docRef = db.collection("messages").doc();
       const newDoc = { id: docRef.id, ...message };

       docRef
         .set(newDoc)
         .then(() =>
           setData((prevData) => ({
             ...prevData,
             messages: [newDoc, ...prevData.messages],
           }))
         )
         .catch((error) => console.log(error));

       inputRef.current.value = "";
     };

     const handleSendEnter = ({ key }) => {
       const sendInputRefValue = inputRef.current.value.trim();

       sendInputRefValue && key.toLowerCase() === "enter" && handleSend();
     };

  +  const handleDelete = (id) =>
  +    db
  +      .collection("messages")
  +      .doc(id)
  +      .delete()
  +      .then(() => {
  +        const newMessages = messages.filter(({ id: msgId }) => id !== msgId);
  +
  +        setData((prevData) => ({ ...prevData, messages: newMessages }));
  +      })
  +      .catch((error) => console.log(error));
  +
     return user && Object.keys(user).length ? (
       <>
         <h1>
           <span>Hello {user.name}!</span>
           <button onClick={handleSignOut}>Sign Out</button>
         </h1>
         <div>
           <h2>Message</h2>
           <input ref={inputRef} onKeyDown={handleSendEnter} />
           <button onClick={handleSend}>Send</button>
           <ul>
             {messages.map(({ id, avatar, name, text }) => {
               avatar = `${avatar}?access_token=${user.accessToken}`;

               return (
                 <li key={id}>
                   <div>
                     <img src={avatar} alt="" />
                   </div>
                   <em>{name} says:</em>
  -                <p>{text}</p>
  +                <p>
  +                  {text}
  +                  <button onClick={() => handleDelete(id)}>x</button>
  +                </p>
                 </li>
               );
             })}
           </ul>
         </div>
       </>
     ) : (
       <button onClick={handleFacebookSignIn}>Sign in with Facebook</button>
     );
   };

   export default App;
  ```

  </details>

---

## References

- [Handle the sign-in flow with the Firebase SDK](https://firebase.google.com/docs/auth/web/facebook-login#handle_the_sign-in_flow_with_the_firebase_sdk)
- [Get to know Cloud Firestore](https://youtube.com/playlist?list=PLl-K7zZEsYLluG5MCVEzXAQ7ACZBCuZgZ)
- [Get started with Cloud Firestore](https://firebase.google.com/docs/firestore/quickstart)
- [Writing conditions for Cloud Firestore Security Rules](https://firebase.google.com/docs/firestore/security/rules-conditions)
- [Firebase JavaScript SDK Reference](https://firebase.google.com/docs/reference/js)

---

## License

`react-chat` is licensed under [MIT](./LICENSE).
