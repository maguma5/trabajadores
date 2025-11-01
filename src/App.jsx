import { useEffect, useState } from "react";
import Logo from "./assets/iconosegura.jpg";
import viteLogo from "/vite.svg";

import "./App.css";
import { useTrabajadores } from "./libs/hooks/useTrabajadores";

function App() {
  const { trabajadores } = useTrabajadores();
  const [mostrar, setMostrar] = useState(false);

  return (
    <>
      <h1>EMPRESA</h1>

      <img src={Logo} alt="Logo de la empresa" width="200" />

      <p>
        Bienvenido al sistema de control de presencia de los trabajadores de la
        obra
      </p>

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
