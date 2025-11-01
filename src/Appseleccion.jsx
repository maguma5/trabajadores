import { useState, useEffect } from "react";
import { getEmpresasUnicas } from "./libs/firebase/getEmpresasUnicas";
import { useTrabajadoresPorFiltro } from "./libs/hooks/useTrabajadores";

function Appseleccion() {
  const [empresas, setEmpresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");

  const { trabajadores, loading } = useTrabajadoresPorFiltro(
    empresaSeleccionada,
    fechaSeleccionada
  );

  useEffect(() => {
    getEmpresasUnicas().then(setEmpresas);
  }, []);

  return (
    <div>
      <h1>Filtrar trabajadores</h1>

      <label>Empresa:</label>
      <select
        value={empresaSeleccionada}
        onChange={(e) => setEmpresaSeleccionada(e.target.value)}
      >
        <option value="">Selecciona una empresa</option>
        {empresas.map((e, i) => (
          <option key={i} value={e}>
            {e}
          </option>
        ))}
      </select>

      <label>Fecha:</label>
      <input
        type="string"
        value={fechaSeleccionada}
        onChange={(e) => setFechaSeleccionada(e.target.value)}
      />

      {loading && <p>Cargando...</p>}

      {!loading && trabajadores.length > 0 && (
        <ul>
          {trabajadores.map((t, i) => (
            <li key={i}>{t.nombre}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Appseleccion;
