import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import db from "../firebase/firestore";

export function useTrabajadoresPorFiltro(empresa, fecha) {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!empresa || !fecha) return;

    const fetch = async () => {
      setLoading(true);
      const ref = collection(db, "trabajadores");
      const q = query(
        ref,
        where("empresa", "==", empresa),
        where("fecha", "==", fecha) // formato: "DD-MM-YYYY"
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => doc.data());
      setTrabajadores(data);
      setLoading(false);
    };

    fetch();
  }, [empresa, fecha]);

  return { trabajadores, loading };
}
