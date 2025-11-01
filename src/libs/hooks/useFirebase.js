import { initializeApp, getApps } from "firebase/app";
import { useState, useEffect } from "react";
import { getFirestore, getDocs, collection } from "firebase/firestore";

export const useFirebase = () => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const firebaseConfig = {
      apiKey: import.meta.env.VITE_API_KEY,
      authDomain: import.meta.env.VITE_AUTH_DOMAIN,
      projectId: import.meta.env.VITE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_APP_ID,
      measurementId: import.meta.env.VITE_MEASUREMENT_ID,
    };

    let app;
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      console.log("Firebase initialized");
    } else {
      app = getApps()[0];
      console.log("Firebase already initialized");
    }

    setDb(getFirestore(app));
  }, []);

  return { db };
};
