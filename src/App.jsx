import { useEffect, useState } from "react";
import Logo from "./assets/iconosegura.jpg";
import viteLogo from "/vite.svg";

import "./App.css";
import { useTrabajadores } from "./libs/hooks/useTrabajadores";
import { useTrabajadoresPorFiltro } from "./libs/hooks/hookdia";

function App() {
  const { useTrabajadores } = useTrabajadores();
  const [mostrar, setMostrar] = useState(false);
  const [modo, setModo] = useState(null);
  const empresa = "Segura";
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
  const { trabajadores, loading } = useTrabajadoresPorFiltro({
    empresa,
    desde: modo === "dia" ? hoy : inicioMes,
    hasta: modo === "dia" ? hoy : finMes,
  });

  return (
    <div>
      <h1>EMPRESA</h1>

      <img src={Logo} alt="Logo de la empresa" width="200" />

      <p>
        Bienvenido al sistema de control de presencia de los trabajadores de la
        obra San Carlos
      </p>

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

export default App;
