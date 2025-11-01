import { useEffect, useState } from "react";
import { useFirebase } from "./useFirebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useTrabajadores = () => {
  const { db } = useFirebase();
  const [trabajadores, setTrabajadores] = useState([]);

  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(
      collection(db, "trabajadores"),
      (snapshot) => {
        snapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          setTrabajadores((prev) => [...prev, doc.data()]);
        });
      }
    );
    return () => unsubscribe();
  }, [db]);

  return { trabajadores };
};
