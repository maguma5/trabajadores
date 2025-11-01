import { useState } from "react";
import { useTrabajadoresFiltrados } from "./libs/hooks/useTrabajadoresFiltrados";

function Apptrabajadores() {
  const [modo, setModo] = useState(null);

  const empresa = "Segura"; // puedes hacerlo dinámico si quieres
  const hoy = new Date().toISOString().split("T")[0];
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
    .toISOString()
    .split("T")[0];
  const finMes = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0
  )
    .toISOString()
    .split("T")[0];

  const { trabajadores, loading } = useTrabajadoresFiltrados({
    empresa,
    desde: modo === "dia" ? hoy : inicioMes,
    hasta: modo === "dia" ? hoy : finMes,
  });

  return (
    <div>
      <h1>Control de Presencia</h1>

      <button onClick={() => setModo("dia")}>Ver trabajadores de hoy</button>
      <button onClick={() => setModo("mes")}>Ver trabajadores del mes</button>

      {loading && <p>Cargando...</p>}

      {!loading && trabajadores.length > 0 && (
        <ul>
          {trabajadores.map((t, i) => (
            <li key={i}>
              {t.nombre} ({t.fecha})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Apptrabajadores;
