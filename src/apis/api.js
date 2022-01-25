import moment from 'moment';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import remoteConfig from '@react-native-firebase/remote-config';

import {FIREBASE_MSG_URL, FIREBASE_SERVER_KEY} from '../config/constant';

// Models
import User from '../models/user';
import Chat from '../models/chat';
import Message from '../models/message';
import Notification from '../models/notification';

// Model Constants
export const USER = 'users';
export const NOTIFICATION = 'notifications';
export const FOLLOW_USER_IDS = 'following_user_ids';
export const BLOCK_USER_IDS = 'blocking_user_ids';

export const CHAT = 'chats';
export const MESSAGE = 'messages';

export const INQUIRY = 'inquiry';

// export const axios = require('axios');

///////////////   USER   ///////////////
export const current_user = () => {
  return auth().currentUser;
};
export const current_uid = () => {
  return auth().currentUser ? auth().currentUser.uid : null;
};
export const sign_out = async () => {
  await auth().signOut();
};
export const delete_user = async () => {
  const uid = current_uid();
  await firestore().collection(USER).doc(uid).delete();
  await sign_out();
};
export const send_mail_verify = () => {
  return auth().currentUser.sendEmailVerification();
};
export const sign_in_email = (email, password) => {
  return auth().signInWithEmailAndPassword(email, password);
};
export const get_users = async (kind = 0) => {
  const ref = await firestore()
    .collection(USER)
    .where('kind', '==', kind)
    // .where('blocked', '==', false)
    .where('visible', '==', true)
    .get();
  if (!ref.docs.length) {
    return [];
  }
  return ref.docs
    .filter((d) => d.data().updated_at)
    .map((d) => new User(d.data(), d.id));
};
export const add_user = async (user) => {
  const temp = {...user};
  delete temp.key;
  delete temp.password;
  await firestore().collection(USER).doc(current_uid()).set(temp);
  return current_uid();
};
export const update_user = async (user) => {
  const temp = {...user};
  delete temp.key;
  delete temp.password;

  await firestore().collection(USER).doc(current_uid()).update(temp);
};
export const update_user_field = async (info) => {
  await firestore()
    .collection(USER)
    .doc(current_uid())
    .set(info, {merge: true});
};
export const update_token = async (token) => {
  const uid = current_uid();
  if (uid) {
    firestore().collection(USER).doc(uid).update({
      token: token,
    });
  }
};
export const update_point = async (point) => {
  firestore().collection(USER).doc(current_uid()).update({
    point: point,
  });
};
export const update_notify_state = async (key) => {
  firestore()
    .collection(USER)
    .doc(current_uid())
    .set(
      {
        ck_notify_ids: firestore.FieldValue.arrayUnion(key),
      },
      {merge: true},
    );
};
export const get_profile = async (uid = current_uid()) => {
  const ref = await firestore().collection(USER).doc(uid).get();
  if (ref.data()) {
    return new User(ref.data(), uid);
  } else {
    return null;
  }
};
export const credentialMail = async (email, password) => {
  const credential = auth.EmailAuthProvider.credential(email, password);
  auth().currentUser.linkWithCredential(credential);
};

export const get_follower_user_ids = async (uid = current_uid()) => {
  const ref = firestore()
    .collectionGroup(FOLLOW_USER_IDS)
    .where('user_ids', 'array-contains', uid);
  const result = await ref.get();
  return result.docs.map((d) => d.id);
};
export const get_following_user_ids = async (uid = current_uid()) => {
  const ref = firestore()
    .collection(USER)
    .doc(uid)
    .collection(FOLLOW_USER_IDS)
    .doc(uid);
  const result = await ref.get();
  return result.data().user_ids;
};
export const like_user = async (id, flag = true) => {
  const ref = firestore().collection(USER).doc(current_uid());

  ref
    .collection(FOLLOW_USER_IDS)
    .doc(current_uid())
    .set(
      {
        user_ids: flag
          ? firestore.FieldValue.arrayUnion(id)
          : firestore.FieldValue.arrayRemove(id),
      },
      {merge: true},
    );
};

export const get_blocking_ids = async (uid = current_uid()) => {
  const ref = firestore()
    .collection(USER)
    .doc(uid)
    .collection(BLOCK_USER_IDS)
    .doc(uid);
  const result = await ref.get();
  return result.data().user_ids;
};
export const get_blocked_ids = async (uid = current_uid()) => {
  const ref = firestore()
    .collectionGroup(BLOCK_USER_IDS)
    .where('user_ids', 'array-contains', uid);
  const result = await ref.get();
  return result.docs.map((d) => d.id);
};
export const block_user = async (id, flag = true) => {
  const ref = firestore().collection(USER).doc(current_uid());

  ref
    .collection(BLOCK_USER_IDS)
    .doc(current_uid())
    .set(
      {
        user_ids: flag
          ? firestore.FieldValue.arrayUnion(id)
          : firestore.FieldValue.arrayRemove(id),
      },
      {merge: true},
    );
};

///////////////   IMAGE   ///////////////
function fileExist() {}
function fileNull() {}
export const upload_image = async (dir, name, path) => {
  const ref = storage().ref(dir + '/' + name);
  ref.getMetadata().then(fileExist, fileNull);
  await ref.putFile(path, {cacheControl: 'no-store'});
  return await ref.getDownloadURL();
};
export const deleteImage = async (dir, name) => {
  const ref = storage().ref(dir + '/' + name);
  await ref.delete();
};

///////////////   INQUIRY   ///////////////
export const add_inquiry = async (title, email, content) => {
  await firestore().collection(INQUIRY).add({
    title: title,
    email: email,
    content: content,
    user_key: current_uid(),
    timestamp: new Date().getTime(),
  });
};

///////////////   INQUIRY   ///////////////
export const get_chats = async (kind, uid = current_uid()) => {
  const field = kind ? 'worker_key' : 'employer_key';
  const ref = await firestore().collection(CHAT).where(field, '==', uid).get();
  return ref.docs.map((d) => new Chat(d.data(), d.id));
};
export const delete_chat = async (chatKey) => {
  await firestore().collection(CHAT).doc(chatKey).delete();
};
export const create_chat = async (chat) => {
  const temp = {
    ...chat,
    timestamp: new Date().getTime(),
  };
  const ref = firestore().collection(CHAT).doc();
  await ref.set(temp);
  return new Chat(temp, ref.id);
};
export const update_chat_state = async (key, status) => {
  await firestore().collection(CHAT).doc(key).update({
    status: status,
  });
};
export const get_messages = async (chat_key) => {
  const ref = await firestore()
    .collection(CHAT)
    .doc(chat_key)
    .collection(MESSAGE)
    .orderBy('createdAt', 'desc')
    .get();
  return ref.docs.map((d) => new Message(d.data()));
};
export const create_message = async (chat_key, msg, kind) => {
  const ref = firestore().collection(CHAT).doc(chat_key);
  ref.collection(MESSAGE).add(msg);
  if (!kind) {
    // me = employer
    ref.set({w_cnt: firestore.FieldValue.increment(1)}, {merge: true});
  } else {
    // me = worker
    ref.set({e_cnt: firestore.FieldValue.increment(1)}, {merge: true});
  }
};
export const reset_badge = async (chat_key, kind) => {
  const ref = firestore().collection(CHAT).doc(chat_key);
  if (kind) {
    // me = worker
    ref.set({w_cnt: 0}, {merge: true});
  } else {
    // me = employer
    ref.set({e_cnt: 0}, {merge: true});
  }
};

///////////////   NOTIFICATIONS   ///////////////
export const get_notifications = async () => {
  const ref = await firestore()
    .collection(NOTIFICATION)
    .where('toUid', '==', current_uid())
    .orderBy('timestamp', 'desc')
    .get();
  return ref.docs.map((d) => new Notification(d.data(), d.id));
};

export const get_configs = async (key) => {
  return remoteConfig().getString(key);
};

///////////////   INVITES   ///////////////
export const check_invite_code = async (code) => {
  const snapshot = await firestore()
    .collection('invites')
    .where('code', '==', code)
    .where('expired', '==', false)
    .get();

  if (!snapshot.docs.length) {
    return false;
  }

  const doc = snapshot.docs[0];
  firestore().collection('invites').doc(doc.id).update({
    expired: true,
  });

  const data = doc.data();
  const timestamp = new Date().getTime();
  const day = 60 * 60 * 24 * 1000;

  if (timestamp >= data.timestamp + day) {
    return false;
  }
  return true;
};
export const get_my_code = async () => {
  const snapshot = await firestore()
    .collection('invites')
    .where('uid', '==', current_uid())
    .get();
  if (!snapshot.docs.length) {
    return null;
  }
  const doc = snapshot.docs[0];
  return {
    ...doc.data(),
    id: doc.id,
  };
};
export const create_invite = async (id) => {
  let ref;
  if (id) {
    ref = firestore().collection('invites').doc(id);
  } else {
    ref = firestore().collection('invites').doc();
  }

  ref.set(
    {
      uid: current_uid(),
      code: generate_invite(8),
      expired: false,
      timestamp: new Date().getTime(),
    },
    {merge: true},
  );
};

const generate_invite = (length) => {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const send_fcm = async (content) => {
  fetch(FIREBASE_MSG_URL, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `key=${FIREBASE_SERVER_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  });
};

export const fcm_like = (token, name) => {
  return {
    to: token,
    notification: {
      title: 'Proviからいいね',
      body: `${name}さんがあなたをいいねしました。`,
      sound: 'default',
      badge: 1,
    },
    contentAvailable: true,
    priority: 'high',
  };
};

export const fcm_message = async (uid, name, kind = 2) => {
  firestore()
    .collection(USER)
    .doc(uid)
    .get()
    .then((snapshot) => {
      if (snapshot.exists) {
        const user = snapshot.data();

        let title = 'プロヴィから面接結果';
        let content;
        switch (kind) {
          case 2:
            title = 'プロヴィからメッセージ';
            content = `${name}さんからメッセージが届きました。`;
            break;
          case 3:
            content = `${name}さんが面接をキャンセルしました。`;
            break;
          case 4:
            content = `${name}さんが採用を見送りさせて頂きました。`;
            break;
          case 5:
            content = `${name}さんから採用されました。`;
            break;
        }

        send_fcm({
          to: user.token,
          notification: {
            title: title,
            body: content,
            sound: 'default',
            badge: 1,
          },
          contentAvailable: true,
          priority: 'high',
        });
      }
    });
};
export const fcm_request = async (token, name) => {
  send_fcm({
    to: token,
    notification: {
      title: 'プロヴィから面接リクエスト',
      body: `${name}さんから面接リクエストが届きました。`,
      sound: 'default',
      badge: 1,
    },
    contentAvailable: true,
    priority: 'high',
  });
};
export const fcm_scout = async (token, name) => {
  send_fcm({
    to: token,
    notification: {
      title: 'プロヴィからスカウト',
      body: `${name}さんからスカウトされました。`,
      sound: 'default',
      badge: 1,
    },
    contentAvailable: true,
    priority: 'high',
  });
};
