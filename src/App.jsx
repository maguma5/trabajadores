import { useState } from "react";
import Logo from "./assets/iconosegura.jpg";
import "./App.css";
import { useTrabajadores } from "./libs/hooks/useTrabajadores";
import Appseleccion from "./Appseleccion";

function App() {
  const [modoSeleccionado, setModoSeleccionado] = useState(null);
  const { trabajadores } = useTrabajadores();
  const [mostrar, setMostrar] = useState(false);

  const volverInicio = () => {
    setModoSeleccionado(null);
  };

  return (
    <div>
      {!modoSeleccionado ? (
        <div>
          <h1>EMPRESA</h1>

          <img src={Logo} alt="Logo de la empresa" width="200" />

          <h1>Control de Presencia</h1>
          <p>¿Qué tipo de listado quieres ver?</p>
          <button onClick={() => setModoSeleccionado("dia")}>
            Listar por día
          </button>
          <button onClick={() => setModoSeleccionado("mes")}>
            Listar por mes
          </button>
        </div>
      ) : (
        <Appseleccion modo={modoSeleccionado} volver={volverInicio} />
      )}
    </div>
  );
}

export default App;
