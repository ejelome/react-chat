import { useEffect, useState } from "react";

import { auth, db, provider } from "./firebase";

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
      .then(({ user: { email, uid } }) => {
        db.collection("users")
          .doc(uid)
          .get()
          .then(
            ({ exists }) =>
              !exists && db.collection("users").doc(uid).set({ email })
          )
          .catch((error) => console.log(error));

        setAccount((prevAccount) => ({ ...prevAccount, user }));
      })
      .catch((error) => console.error(error));
  };

  const handleSignOut = () => {
    auth.signOut().catch((error) => console.error(error));
  };
  return user ? (
    <>
      <h1>Hello {user.displayName}!</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </>
  ) : (
    <button onClick={handleFacebookSignIn}>Sign in with Facebook</button>
  );
};

export default App;
