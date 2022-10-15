import './App.css';
import { useState, useRef } from 'react';

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut,
} from 'firebase/auth';

import { 
  getFirestore, 
  serverTimestamp, 
  collection,
  addDoc,
  doc,
  onSnapshot,
  where,
  orderBy,
  limit,
  query,
  setDoc,
} from 'firebase/firestore';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const app = initializeApp({
  apiKey: "AIzaSyCSlnMs8MV3JL20n5mDaFswhxzTU7KWszg",
  authDomain: "superchat-6a670.firebaseapp.com",
  projectId: "superchat-6a670",
  storageBucket: "superchat-6a670.appspot.com",
  messagingSenderId: "678843462786",
  appId: "1:678843462786:web:67b1881869f277c3a4b09b"
})

const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [ user ] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        {user ? 
          <>
            <img referrerPolicy='no-referrer' src={user.photoURL} alt="user" />
            <p>{user.displayName}</p>
            <button onClick={() => {
              signOut(auth);
            }}>Sign out</button>
          </>
          :
          <>
          <p>Currently signed out</p>
            <button onClick={() => {
              signInWithPopup(auth, new GoogleAuthProvider())
            }}>Sign in</button>
          </>
        }
      </header>

      <section>

        {user && <ChatRoom />}

      </section>
    </div>
  );
}


function ChatRoom() {

  const q = query(collection(db, "messages"), orderBy("createdAt"), limit(25));

  const [ messages, loading, error, snapshot ] = useCollectionData(q);

  const [ user ] = useAuthState(auth);

  // console.log(user);

  // for keeping track of user input
  const [formValue, setFormValue] = useState('');

  // console.log(messages);

  async function submitMessage(e) {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "messages"), {
      text: formValue,
      uid: user.uid,
      createdAt: serverTimestamp(),
      photoUrl: user.photoURL,
    })
    console.log(`Document written with id ${docRef.id}`)
    setFormValue('');
    dummy.current.scrollIntoView({behavior: 'smooth'}) // scroll to bottom
  }

  // dummy div for auto scrolling
  const dummy = useRef()

  return (
    <>
      <main>
        {messages && messages.map((msg, i) => <ChatMessage 
            key={i} 
            message={msg}
          />)}

        <div ref={dummy}></div>

      </main>

      <form onSubmit={submitMessage}>

        <input value={formValue} onChange={(e) => setFormValue(e.target.value)}/>

        <button type="submit">Send</button>

      </form>
    </>
  )
}

function ChatMessage(props) {
  const { text, uid, photoUrl } = props.message;

  console.log(text);

  // if the message's uid matches the current user uid, it is a sent message
  // otherwise, it is a received message
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
    <div className={`message ${messageClass}`}>
      <img referrerPolicy='no-referrer' src={photoUrl} alt="user"/>
      <p>{text}</p>
    </div>
  )
}

export default App;
