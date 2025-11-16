import { useState, useEffect } from "react";
//import { getEmpresasUnicas } from "./libs/hooks/empresas/getEmpresasUnicas";
//import { getEmpresasUnicas } from "./libs/hooks/empresas";
import { useTrabajadores } from "./libs/hooks/useTrabajadores";
//import { getTrabajadoresPorFecha } from "./libs/hooks/useTrabajadores";

function Appseleccion({ modo, volver }) {
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const [trabajadores, setTrabajadores] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);

  /* useEffect(() => {
    if (modo === "dia") {
      getEmpresasUnicas().then(setEmpresas);
    }
  }, [modo]); */

  const cargarTrabajadores = async () => {
    setLoading(true);
    //const todos = await getTrabajadoresPorFecha(fechaSeleccionada); // función que trae todos los de ese día
    const todos = useTrabajadores();
    let filtrados = todos;

    if (empresaSeleccionada) {
      filtrados = todos.filter((t) => t.empresa === empresaSeleccionada);
    }

    setTrabajadores(filtrados);
    setLoading(false);
  };

  const agrupadosPorEmpresa = trabajadores.reduce((acc, t) => {
    if (!acc[t.empresa]) acc[t.empresa] = [];
    acc[t.empresa].push(t);
    return acc;
  }, {});

  return (
    <div>
      <button onClick={volver}>⬅️ Volver</button>
      <h2>Listado por día</h2>

      <label>Fecha:</label>
      <input
        type="date"
        value={fechaSeleccionada}
        onChange={(e) => setFechaSeleccionada(e.target.value)}
      />

      <label>Empresa (opcional):</label>
      <select
        value={empresaSeleccionada}
        onChange={(e) => setEmpresaSeleccionada(e.target.value)}
      >
        <option value="">Todas</option>
        {empresas.map((e, i) => (
          <option key={i} value={e}>
            {e}
          </option>
        ))}
      </select>

      <button onClick={cargarTrabajadores}>Buscar</button>

      {loading && <p>Cargando...</p>}

      {!loading && trabajadores.length > 0 && (
        <div>
          {empresaSeleccionada ? (
            <ul>
              {trabajadores.map((t, i) => (
                <li key={i}>{t.nombre}</li>
              ))}
            </ul>
          ) : (
            Object.entries(agrupadosPorEmpresa).map(([empresa, lista]) => (
              <div key={empresa}>
                <h3>{empresa}</h3>
                <ul>
                  {lista.map((t, i) => (
                    <li key={i}>{t.nombre}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Appseleccion;
