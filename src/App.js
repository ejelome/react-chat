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
                <p>{text}</p>
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
