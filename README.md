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
    - [2. Setup Authentication](#2-setup-authentication)
      - [2.1. Facebook](#21-facebook)
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
  +  REACT_APP_FIREBASE_API_KEY=<apiKey>
  +  REACT_APP_FIREBASE_AUTH_DOMAIN=<authDomain>
  +  REACT_APP_FIREBASE_DATABASE_URL=<databaseURL>
  +  REACT_APP_FIREBASE_PROJECT_ID=<projectId>
  +  REACT_APP_FIREBASE_STORAGE_BUCKET=<storageBucket>
  +  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=<messagingSenderId>
  +  REACT_APP_FIREBASE_APP_ID=<appId>
  ```

  1.2.2. Install `firebase`

  ```shell
  $ npm i firebase
  ```

  1.2.3. Initialize `firebase`

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

</details>

### 2. Setup Authentication

<details>
  <summary>2.1. Setup remote</summary>

- 2.1.1. On `Project Overview`, click `Authentication`
- 2.1.2. Click `Get started`
- 2.1.3. Click `Sign-in method`
- 2.1.4. Under `Sign-in providers`, click a provider (e.g. `Facebook`)

  - 2.1.4.1. Click `Enable`
  - 2.1.4.2. Provide required details
  - 2.1.4.3. Click `Save`

#### 2.1. Facebook

- 2.1.1. Log in on [Facebook for Developers](https://developers.facebook.com)
- 2.1.2. Click `My Apps`
- 2.1.3. Click `Create App`

  - 2.1.3.1. Click `Build Connected Experiences`
  - 2.1.3.2. Write `App Display Name` (e.g. `react-chat`)
  - 2.1.3.3. Click `Create App`
  - 2.1.3.4. Pass `Security Check` then click `Submit`

- 2.1.4. Click `Setup` under `Facebook Login`
- 2.1.5. Click `www` (Web) icon

  - 2.1.5.1. Write `Site URL` (e.g. http://localhost:3000)
  - 2.1.5.2. Click `Save`

- 2.1.6. Click `Settings` then `Basic`

  - 2.1.6.1. Copy and paste `App ID` on `App ID` in `Facebook`'s `Sign-in providers`
  - 2.1.6.2. Click `Show` on `App Secret`
  - 2.1.6.3. Copy and paste `App ID` on `App secret` in `Facebook`'s `Sign-in providers`

- 2.1.7. Under `PRODUCTS`, click `Facebook Login` then `Settings`

  - 2.1.7.1. Copy `OAuth redirect URI` from `Facebook`'s `Sign-in providers`
  - 2.1.7.2. Paste it on `Valid OAuth Redirect URIs`
  - 2.1.7.3. Click `Save Changes`

</details>

<details>
  <summary>2.1. Setup local</summary>

- 2.1.1. Export `auth` and provider (e.g. `Facebook*`)

  ```diff
  --- src/firebase.js
  +++ src/firebase.js
  @@ -1,11 +1,21 @@
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
  +const auth = firebase.auth();
  +
  +const provider = {
  +  facebook: new firebase.auth.FacebookAuthProvider(),
  +};
  +
  +export { auth, provider };
  ```

- 2.1.2. Use `auth` with provider

  ```diff
  --- src/App.js
  +++ src/App.js
  @@ -1,25 +1,28 @@
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
  +  const initialState = {};
  +  const [account, setAccount] = useState(initialState);
  +  const { user } = account;
  +
  +  const handleFacebookSignIn = () => {
  +    const { facebook } = provider;
  +
  +    auth
  +      .signInWithPopup(facebook)
  +      .then(({ user }) =>
  +        setAccount((prevAccount) => ({ ...prevAccount, user }))
  +      )
  +      .catch((error) => console.error(error));
  +  };
  +
  +  return user ? (
  +    <h1>Hello {user.displayName}!</h1>
  +  ) : (
  +    <button onClick={handleFacebookSignIn}>Sign in with Facebook</button>
     );
  -}
  +};

   export default App;
  ```

- 2.1.3 Resolve authentication on render

  ```diff
  --- src/App.js
  +++ src/App.js
  @@ -1,28 +1,36 @@
  -import { useState } from "react";
  +import { useEffect, useState } from "react";

   import { auth, provider } from "./firebase";

   const App = () => {
     const initialState = {};
     const [account, setAccount] = useState(initialState);
     const { user } = account;

  +  useEffect(() => {
  +    const unsubscribe = auth.onAuthStateChanged((user) => {
  +      setAccount((prevAccount) => ({ ...prevAccount, user }));
  +    });
  +
  +    return unsubscribe;
  +  }, []);
  +
     const handleFacebookSignIn = () => {
       const { facebook } = provider;

       auth
         .signInWithPopup(facebook)
         .then(({ user }) =>
           setAccount((prevAccount) => ({ ...prevAccount, user }))
         )
         .catch((error) => console.error(error));
     };

     return user ? (
       <h1>Hello {user.displayName}!</h1>
     ) : (
       <button onClick={handleFacebookSignIn}>Sign in with Facebook</button>
     );
   };

   export default App;
  ```

- 2.1.4. Include signing out

  ```diff
  --- src/App.js
  +++ src/App.js
  @@ -1,36 +1,43 @@
   import { useEffect, useState } from "react";

   import { auth, provider } from "./firebase";

   const App = () => {
     const initialState = {};
     const [account, setAccount] = useState(initialState);
     const { user } = account;

     useEffect(() => {
       const unsubscribe = auth.onAuthStateChanged((user) => {
         setAccount((prevAccount) => ({ ...prevAccount, user }));
       });

       return unsubscribe;
     }, []);

     const handleFacebookSignIn = () => {
       const { facebook } = provider;

       auth
         .signInWithPopup(facebook)
         .then(({ user }) =>
           setAccount((prevAccount) => ({ ...prevAccount, user }))
         )
         .catch((error) => console.error(error));
     };

  +  const handleSignOut = () => {
  +    auth.signOut().catch((error) => console.error(error));
  +  };
  +
     return user ? (
  -    <h1>Hello {user.displayName}!</h1>
  +    <>
  +      <h1>Hello {user.displayName}!</h1>
  +      <button onClick={handleSignOut}>Sign Out</button>
  +    </>
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

---

## License

`react-chat` is licensed under [MIT](./LICENSE).
