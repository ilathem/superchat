# Create a realtime chat app with React and Firebase

1. `npx create-react-app superchat` in terminal to build the react app

2. install dependencies into react:
   `npm install firebase react-firebase-hooks`

   1. firebase is for connecting to firebase
   2. react-firebase-hooks are react hooks that make it simpler working with firebase

3. in `App.js`, import firebase and remove the boilerplate code:
   ```js
   import './App.css';
   
   import firebase from 'firebase/app';
   import 'firebase/firestore';
   import 'firebase/auth';
   
   function App() {
     return (
       <div className="App">
         <header className="App-header">
   
         </header>
       </div>
     );
   }
   
   export default App;
   ```

   1. also, delete `app.test.js` as this will break the tests

4. import some hooks from `react-firebase-hooks` to make it easier to use react with firebase:
   ```js
   import { useAuthState } from 'react-firebase-hooks/auth';
   import { useCollectionData } from 'react-firebase-hooks/firestore';
   ```

5. next, initialize firebase with the configuration data, then instantiate global variables for authentication and the firestore database:
   ```js
   firebase.initializeApp({
     // your config
   })
   
   const auth = firebase.auth();
   const firestore = firebase.firestore();
   ```

6. next, go to console.firebase.com and create a new project

7. after the project is created, go to the Build > Authentication tab and click Google to enable sign in with Google

8. to create the database, go to the Build > Cloud Firestore and create a database in test mode

9. to add the react app, click the gear > project settings > add a new web app at the bottom

10. copy the firebase config and paste that in app.js under the initialize app 

11. to know if the user is signed in, use the `useAuthState()` hook inside of a component, and pass the auth variables from `firebase.auth()` as the argument

    1. if the user is signed in, the user object will be the user

    2. if the user is signed out, the user object is null

    3. this allows us to use ternary operators for conditionally rendering content based on if the user is signed in:
       ```js
       function App() {
       
         const [user] = useAuthState(auth);
         
         return (
           <div className="App">
             <header className="App-header">
       
             </header>
       
             <section>
       
               {user ? <ChatRoom /> : <SignIn />}
       
             </section>
           </div>
         );
       }
       ```

12. to sign in: 
    ```js
    function SignIn() {
    
      const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider(); // specify the provider
        auth.signInWithPopup(provider); // sign in with a popup using the provider specified
      }
    
      return (
        <button onClick={signInWithGoogle}>Sign in with Google</button>
      )
    }
    ```

13. to sign out:
    ```js
    function signOut() {
      return auth.currentUser && ( // if there is a current user, return sign out button
        <button onClick={() => auth.signOut()}>Sign Out</button>
      )
    }
    ```