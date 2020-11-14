import firebase from "firebase";
import { useEffect, useRef, useState } from "react";

import { auth, db, provider } from "./firebase";

const App = () => {
  const initialState = { currentUser: null, messages: [] };
  const [data, setData] = useState(initialState);

  const inputRef = useRef();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      (user) =>
        user &&
        db
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) =>
            setData((prevData) => ({ ...prevData, currentUser: doc.data() }))
          )
          .catch((error) => console.log(error))
    );

    return unsubscribe;
  }, []);

  useEffect(() => {
    db.collection("messages")
      .orderBy("timestamp", "desc")
      .get()
      .then((querySnapshot) => {
        const messages = [];

        querySnapshot.forEach((doc) => messages.push(doc.data()));

        setData((prevData) => ({ ...prevData, messages }));
      })
      .catch((error) => console.log(error));
  }, []);

  const handleFacebookSignIn = ({ facebook }) =>
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
            exists
              ? db.collection("users").doc(uid).update({ accessToken })
              : db.collection("users").doc(uid).set(newUser);

            setData((prevData) => ({ ...prevData, currentUser: newUser }));
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => console.error(error));

  const handleSignOut = () =>
    auth
      .signOut()
      .then(() => setData(initialState))
      .catch((error) => console.error(error));

  const handleSend = () => {
    const { value: text } = inputRef.current;
    const { uid, avatar, name } = currentUser;
    const {
      firestore: {
        FieldValue: { serverTimestamp },
      },
    } = firebase;
    const message = { uid, avatar, name, text, timestamp: serverTimestamp() };

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
    const keyCode = key.toLowerCase();

    sendInputRefValue && keyCode === "enter" && handleSend();
  };

  const handleDelete = ({ messageId }) =>
    db
      .collection("messages")
      .doc(messageId)
      .delete()
      .then(() => {
        const newMessages = messages.filter(({ id }) => id !== messageId);

        setData((prevData) => ({ ...prevData, messages: newMessages }));
      })
      .catch((error) => console.log(error));

  const { currentUser, messages } = data;

  return currentUser ? (
    <>
      <h1>
        <span>Hello {currentUser.name}!</span>
        <button onClick={handleSignOut}>Sign Out</button>
      </h1>
      <div>
        <h2>Message</h2>
        <input ref={inputRef} onKeyDown={handleSendEnter} />
        <button onClick={handleSend}>Send</button>
        <ul>
          {messages.map(({ id, avatar, name, text }) => {
            avatar = `${avatar}?access_token=${currentUser.accessToken}`;

            return (
              <li key={id}>
                <div>
                  <img src={avatar} alt="" />
                </div>
                <em>{name} says:</em>
                <p>
                  {text}
                  <button onClick={() => handleDelete({ messageId: id })}>
                    x
                  </button>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  ) : (
    <button onClick={() => handleFacebookSignIn(provider)}>
      Sign in with Facebook
    </button>
  );
};

export default App;
