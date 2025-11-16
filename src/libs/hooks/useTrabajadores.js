import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useFirebase } from "./useFirebase";

//import { db } from "../firebase"; // Asegúrate de que este sea tu archivo de configuración

function formatearFecha(fechaInput) {
  const [año, mes, dia] = fechaInput.split("-");
  return `${dia}-${mes}-${año}`;
}

function extraerMes(fecha) {
  const partes = fecha.split("-");
  return `${partes[1]}-${partes[2]}`; // MM-yyyy
}

function convertirMes(fechaMes) {
  const [año, mes] = fechaMes.split("-");
  return `${mes}-${año}`; // MM-yyyy
}

export function useTrabajadores(modo = "", fechaSeleccionada = "") {
  const { db } = useFirebase();
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTrabajadores() {
      setLoading(true);
      try {
        const ref = collection(db, "trabajadores");
        const snapshot = await getDocs(ref);

        const todos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const filtrados = todos.filter((t) => {
          if (!t.fecha) return false;

          if (modo === "dia") {
            return t.fecha === formatearFecha(fechaSeleccionada);
          }

          if (modo === "mes") {
            const mesTrabajador = convertirMes(t.fecha);
            const mesSeleccionado = convertirMes(
              formatearFecha(fechaSeleccionada)
            );
            return mesTrabajador === mesSeleccionado;
          }

          return true;
        });

        setTrabajadores(filtrados);
      } catch (error) {
        console.error("Error al obtener trabajadores:", error);
        setTrabajadores([]);
      } finally {
        setLoading(false);
      }
    }

    if (modo && fechaSeleccionada) {
      fetchTrabajadores();
    }
  }, [modo, fechaSeleccionada]);

  return { trabajadores, loading };
}
