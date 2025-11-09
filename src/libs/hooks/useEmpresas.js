// src/libs/hooks/useEmpresas.js
import { useState, useEffect } from "react";
import { useFirebase } from "./useFirebase";
import { collection, onSnapshot } from "firebase/firestore";

export const useEmpresas = () => {
  const { db } = useFirebase();
  const [empresas, setEmpresas] = useState([]);

  //const {trabajadores, setTrabajadores} = useState([])

  useEffect(() => {
    if (!db) return;
    console.log("Cargando empresas...");
    const unsubscribe = onSnapshot(
      collection(db, "trabajadores"),
      (snapshot) => {
        const set = new Set();
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.empresa) set.add(data.empresa.trim());
        });
        setEmpresas(Array.from(set).sort((a, b) => a.localeCompare(b)));
      }
    );

    return () => unsubscribe();
  }, []);
  console.log("Empresas cargadas:", empresas.length);
  return { empresas };
};
