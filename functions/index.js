const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const Filter = require("bad-words");

const admin = require("firebase-admin");

admin.initializeApp();

const db = admin.firestore();

exports.detectEvilUsers = functions.firestore
    .document("messages/{msgId}")
    .onCreate((snapshot, context) => {
      const filter = new Filter();
      const {text, uid} = snapshot.data();
      if (filter.isProfane(text)) {
        filter.clean(text);
        snapshot.ref.update({text: "I got banned for saying a bad word!"});
        db.collection("banned").doc(uid).set({});
      }
    });
