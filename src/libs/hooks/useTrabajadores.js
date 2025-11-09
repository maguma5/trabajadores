import { useEffect, useState } from "react";
import { useFirebase } from "./useFirebase";
import { collection, onSnapshot } from "firebase/firestore";

export const getTrabajadoresPorFecha = async (fecha) => {
  const { db } = useFirebase();
  //const [trabajadores, setTrabajadores] = useState([]);
  const ref = collection(db, "trabajadores");
  const q = query(ref, where("fecha", "==", fecha));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
};

export const useTrabajadores = () => {
  const { db } = useFirebase();
  const [trabajadores, setTrabajadores] = useState([]);

  useEffect(() => {
    if (!db) return;
    const unsubscribe = onSnapshot(
      collection(db, "trabajadores"),
      (snapshot) => {
        const lista = snapshot.docs.map((doc) => doc.data());
        setTrabajadores(lista); // ✅ reemplaza en lugar de acumular
      }
    );

    return () => unsubscribe();
  }, [db]);
  console.log("Trabajadores cargados:", trabajadores.length);
  return { trabajadores };
};
