import { useState } from "react";
import Logo from "./assets/iconosegura.jpg";

import "./App.css";
import { useTrabajadores } from "./libs/hooks/useTrabajadores";

function agruparPorEmpresa(trabajadores) {
  const grupos = {};

  trabajadores.forEach((t) => {
    const empresa = t.empresa || "Sin empresa";
    if (!grupos[empresa]) {
      grupos[empresa] = [];
    }
    grupos[empresa].push(t);
  });

  return grupos;
}

function App() {
  const [mostrar, setMostrar] = useState(false);
  const [modo, setModo] = useState(""); // "dia" o "mes"
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const { trabajadores, loading } = useTrabajadores(modo, fechaSeleccionada);
  const trabajadoresPorEmpresa =
    modo === "dia" ? agruparPorEmpresa(trabajadores) : {};

  return (
    <>
      <h1>EMPRESA</h1>
      <img src={Logo} alt="Logo de la empresa" width="200" />
      <h1>Control de Presencia</h1>
      <button onClick={() => setModo("dia")}>Ver trabajadores de hoy</button>
      <button onClick={() => setModo("mes")}>Ver trabajadores del mes</button>
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
      <button onClick={() => setMostrar(!mostrar)}>Ver Trabajadores</button>
      {loading && <p>Cargando...</p>}

      {mostrar && modo === "dia" && (
        <div>
          {Object.entries(trabajadoresPorEmpresa).map(([empresa, lista]) => (
            <div key={empresa}>
              <h3>{empresa}</h3>
              {lista.map((trabajador, index) => (
                <p key={index}>{trabajador.nombre}</p>
              ))}
            </div>
          ))}
        </div>
      )}
      {mostrar && (
        <div>
          {trabajadores.length > 0 ? (
            trabajadores.map((trabajador, index) => (
              <p key={index}>{trabajador.nombre}</p>
            ))
          ) : (
            <p>No hay trabajadores para esa fecha</p>
          )}
        </div>
      )}
    </>
  );
}

export default App;
