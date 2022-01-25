const functions = require('firebase-functions');
// var serviceAccount = require('../serviceAccountKey.json');

const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore();
const bucket = admin.storage().bucket();

exports.callback_quit_user = functions
  .region('asia-northeast1')
  .firestore.document('users/{uid}')
  .onDelete(async (snap, context) => {
    const user = snap.data();
    const {uid} = context.params;

    // get user related firestore values
    let [snapshot1, snapshot2, snapshot3] = await Promise.all([
      firestore
        .collection('notification')
        .where('employer_key', '==', uid)
        .get(),
      firestore
        .collectionGroup('blocking_user_ids')
        .where('user_ids', 'array-contains', uid)
        .get(),
      firestore
        .collectionGroup('following_user_ids')
        .where('user_ids', 'array-contains', uid)
        .get(),
    ]);

    // remove user related firestore values
    const docs = [...snapshot1.docs, ...snapshot2.docs, ...snapshot3.docs];
    docs.map((doc) => doc.ref.delete());

    let [chats1, chats2] = await Promise.all([
      firestore.collection('chats').where('worker_key', '==', uid).get(),
      firestore.collection('chats').where('employer_key', '==', uid).get(),
    ]);
    const chatDocs = [...chats1.docs, ...chats2.docs];
    chatDocs.map((doc) => {
      firestore
        .collection('chats/' + doc.id + '/messages')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => doc.ref.delete());
        });
      doc.ref.delete();
    });

    // remove collections inside user doc
    firestore.doc(`users/${uid}/blocking_user_ids/${uid}`).delete();
    firestore.doc(`users/${uid}/following_user_ids/${uid}`).delete();

    // remove user related images on storage
    const fields = [
      user.img_face,
      user.img_best,
      user.img_full,
      user.video,
      user.image,
    ];
    fields.map((field) => {
      if (field) {
        const filePath = `users/${uid}/${field.split('?alt')[0]}`;
        const file = bucket.file(filePath);
        file.delete();
      }
    });

    admin.auth().deleteUser(uid);
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
