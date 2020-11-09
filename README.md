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

## License

`react-chat` is licensed under [MIT](./LICENSE).
