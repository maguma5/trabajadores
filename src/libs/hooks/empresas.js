import { useState, useEffect } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { useFirebase } from "./useFirebase";

/* export async function getEmpresasUnicas() {
  const { db } = useFirebase();
  const empresas = [];

  const snapshot = await getDocs(collection(db, "trabajadores"));
  empresas = new Set();
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.empresa) empresas.add(data.empresa);
  });

  return Array.from(empresas);
} */

export const getEmpresas = () => {
  const { db } = useFirebase();
  const [empresas, setEmpresas] = useState(new Set());

  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(
      collection(db, "trabajadores"),
      (snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data();

          if (data.empresa) {
            setEmpresas((prev) => {
              const updated = new Set(prev);
              console.log("Adding empresa:", data.empresa, " + ", updated.size);
              updated.add(data.empresa);
              return updated;
            });
          }
        });
      }
    );

    return () => unsubscribe();
  }, [db]);

  return empresas;
};
