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

  const handleSignOut = () => {
    auth.signOut().catch((error) => console.error(error));
    setData(initialState);
  };

  return user && Object.keys(user).length ? (
    <h1>
      <span>Hello {user.name}!</span>
      <button onClick={handleSignOut}>Sign Out</button>
    </h1>
  ) : (
    <button onClick={handleFacebookSignIn}>Sign in with Facebook</button>
  );
};

export default App;
