import { useEffect, useState } from "react";

import { auth, provider } from "./firebase";

const App = () => {
  const initialState = {};
  const [account, setAccount] = useState(initialState);
  const { user, error } = account;

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
      .catch((error) =>
        setAccount((prevAccount) => ({ ...prevAccount, error }))
      );
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  return user && !error ? (
    <>
      <h1>Hello {user.displayName}!</h1>
      <button onClick={handleSignOut}>Sign Out</button>
    </>
  ) : (
    <button onClick={handleFacebookSignIn}>Sign in with Facebook</button>
  );
};

export default App;
