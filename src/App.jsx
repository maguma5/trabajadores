import { useState } from "react";
import Logo from "./assets/iconosegura.jpg";
import "./App.css";
import { useTrabajadores } from "./libs/hooks/useTrabajadores";
//import Appseleccion from "./AppseleccionPrueba";

function App() {
  //const [modoSeleccionado, setModoSeleccionado] = useState(null);
  const { trabajadores } = useTrabajadores();
  const [mostrar, setMostrar] = useState(false);

  const volverInicio = () => {
    setModoSeleccionado(null);
  };

  return (
    <>
      <h1>EMPRESA</h1>

      <img src={Logo} alt="Logo de la empresa" width="200" />

      <h1>Control de Presencia</h1>
      <p>¿Qué tipo de listado quieres ver otra vez?</p>

      <button onClick={() => setModo("dia")}>Ver trabajadores de hoy</button>
      <button onClick={() => setModo("mes")}>Ver trabajadores del mes</button>

      <button onClick={() => setMostrar(!mostrar)}>Ver Trabajadores </button>

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
