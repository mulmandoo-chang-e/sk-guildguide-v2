import { initializeApp } from 'firebase/app';

import { getDatabase } from 'firebase/database';

import { getStorage } from 'firebase/storage';

import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL:
    "https://jiyaksae-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jiyaksae",
  storageBucket: "jiyaksae.firebasestorage.app",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

export const storage = getStorage(app);

export const auth = getAuth(app);

export const provider = new GoogleAuthProvider();