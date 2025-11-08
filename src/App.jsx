import { useEffect, useState } from "react";
import Logo from "./assets/iconosegura.jpg";

import "./App.css";
import { useTrabajadores } from "./libs/hooks/useTrabajadores";
import { useTrabajadoresFiltrados } from "./libs/hooks/useTrabajadoresFiltrados";

function App() {
  // const { trabajadores } = useTrabajadores();
  const [mostrar, setMostrar] = useState(false);
  const { trabajadores, loading } = useTrabajadoresFiltrados({
    empresa,
    desde: modo === "dia" ? hoy : inicioMes,
    hasta: modo === "dia" ? hoy : finMes,
  });

  return (
    <>
      <h1>EMPRESA</h1>

      <img src={Logo} alt="Logo de la empresa" width="200" />

      <h1>Control de Presencia hoy</h1>

      <button onClick={() => setModo("dia")}>Ver trabajadores de hoy</button>
      <button onClick={() => setModo("mes")}>Ver trabajadores del mes</button>

      {/* {loading && <p>Cargando...</p>} */}

      <button onClick={() => setMostrar(!mostrar)}>Ver Trabajadores</button>

      {mostrar && (
        <div>
          {trabajadores.map((trabajador, index) => (
            <p key={index}>{trabajador.nombre}</p>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
