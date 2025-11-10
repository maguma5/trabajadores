import { useState, useEffect } from "react";
import { useTrabajadores } from "./libs/hooks/useTrabajadores";
//import { useEmpresas } from "./libs/hooks/useEmpresas";

function Appseleccion() {
  //const { empresas, loading1 } = useEmpresas();
  //const { empresas } = useEmpresas();
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const { trabajadores, loading } = useTrabajadores(
    empresaSeleccionada,
    fechaSeleccionada
  );

  return (
    <div>
      <h1>Filtrar trabajadores</h1>
      <label>Empresa:</label>
      <select
        value={empresaSeleccionada}
        onChange={(e) => setEmpresaSeleccionada(e.target.value)}
      >
        <option value="">Selecciona una empresa</option>

        {/* {empresas.length > 0 &&
          empresas.map((e, i) => (
            <option key={i} value={e}>
              {e}
            </option>
          ))} */}
      </select>
      <label>Fecha:</label>
      <input
        type="date"
        value={fechaSeleccionada}
        onChange={(e) => setFechaSeleccionada(e.target.value)}
      />

      {loading && <p>Cargando...</p>}
      {!loading && trabajadores.length > 0 && (
        <ul>
          {trabajadores.map((t, i) => (
            <li key={i}>{t.empresa}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Appseleccion;
