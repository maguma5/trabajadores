import { useEffect, useState } from "react";
import Logo from "./assets/iconosegura.jpg";

import "./App.css";
import { useTrabajadores } from "./libs/hooks/useTrabajadores";

function App() {
  const { trabajadores } = useTrabajadores();
  const [mostrar, setMostrar] = useState(false);
  const [modo, setModo] = useState(""); // "dia" o "mes"
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  return (
    <>
      <h1>EMPRESA</h1>

      <img src={Logo} alt="Logo de la empresa" width="200" />

      <h1>Control de Presencia</h1>

      <button onClick={() => setModo("dia")}>Ver trabajadores de hoy</button>
      <button onClick={() => setModo("mes")}>Ver trabajadores del mes</button>

      {/* {loading && <p>Cargando...</p>} */}

      <button onClick={() => setMostrar(!mostrar)}>Ver Trabajadores</button>

      {modo === "dia" && (
        <input
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        />
      )}

      {modo === "mes" && (
        <input
          type="month"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        />
      )}

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
