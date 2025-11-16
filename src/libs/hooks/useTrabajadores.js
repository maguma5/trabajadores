import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useFirebase } from "./useFirebase";

//import { db } from "../firebase"; // Asegúrate de que este sea tu archivo de configuración

function formatearFecha(fechaInput) {
  const [año, mes, dia] = fechaInput.split("-");
  return `${dia}/${mes}/${año}`;
}

function extraerMes(fecha) {
  const partes = fecha.split("-");
  return `${partes[1]}-${partes[2]}`; // MM-yyyy
}

function convertirMes(fechaMes) {
  const [dia, mes, año] = fechaMes.split("/");
  return `${mes}/${año}`; // MM-yyyy
}

function obtenerDiasDelMes(fechaMes) {
  const [año, mes] = fechaMes.split("-");
  const totalDias = new Date(año, mes, 0).getDate();
  const dias = [];

  for (let i = 1; i <= totalDias; i++) {
    dias.push(i.toString().padStart(2, "0")); // "01", "02", ...
  }

  return dias;
}

function construirMatriz(trabajadores, empresa, fechaMes) {
  const dias = obtenerDiasDelMes(fechaMes);
  const mesSeleccionado = convertirMes(fechaMes); // "MM-yyyy"

  const trabajadoresEmpresa = trabajadores.filter(
    (t) => t.empresa === empresa && t.fecha?.includes(mesSeleccionado)
  );

  const nombresUnicos = [...new Set(trabajadoresEmpresa.map((t) => t.nombre))];

  const matriz = nombresUnicos.map((nombre) => {
    const fila = { nombre };
    dias.forEach((dia) => {
      const fechaCompleta = `${dia}-${mesSeleccionado}`;
      const presente = trabajadoresEmpresa.some(
        (t) => t.nombre === nombre && t.fecha === fechaCompleta
      );
      fila[fechaCompleta] = presente ? "✅" : "";
    });
    return fila;
  });

  return { dias, matriz };
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
