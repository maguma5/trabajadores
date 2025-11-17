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

function CuadriculaMes({ trabajadores, empresa, fechaMes }) {
  // ✅ Estas funciones van aquí, fuera del JSX
  function normalizarMes(fechaMes) {
    const [mes, año] = fechaMes.split("/");
    return `${mes.padStart(2, "0")}-${año}`; // "11-2025"
  }
  console.log("Trabajadores en CuadriculaMes:", trabajadores);
  function obtenerDiasDelMes(fechaMes) {
    const [mes, año] = fechaMes.split("/");
    const totalDias = new Date(parseInt(año), parseInt(mes), 0).getDate();
    const dias = [];
    for (let i = 1; i <= totalDias; i++) {
      dias.push(i.toString().padStart(2, "0")); // "01", "02", ...
    }
    return dias;
  }

  function construirMatriz(trabajadores, empresa, fechaMes) {
    const dias = obtenerDiasDelMes(fechaMes);
    const mesSeleccionado = fechaMes; // "11-2025"

    const trabajadoresEmpresa = trabajadores.filter(
      (t) => t.empresa === empresa && t.fecha?.includes(fechaMes)
    );

    const nombresUnicos = [
      ...new Set(trabajadoresEmpresa.map((t) => t.nombre)),
    ];
    console.log(
      "📋 Trabajadores de la empresa en el mes:",
      trabajadoresEmpresa
    );
    console.log("👤 Nombres únicos:", nombresUnicos);
    const matriz = nombresUnicos.map((nombre) => {
      const fila = { nombre };
      dias.forEach((dia) => {
        const fechaCompleta = `${dia}/${mesSeleccionado}`; // "dd-MM-yyyy"

        const presente = trabajadoresEmpresa.some(
          (t) => t.nombre === nombre && t.fecha === fechaCompleta
        );
        fila[fechaCompleta] = presente ? "✅" : "";
      });
      return fila;
    });
    return { dias, matriz };
  }

  // ✅ Aquí ya puedes usar la matriz
  const { dias, matriz } = construirMatriz(trabajadores, empresa, fechaMes);
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        border="1"
        cellPadding="6"
        style={{
          tableLayout: "auto",
          width: "auto",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr>
            <th style={{ whiteSpace: "nowrap" }}>Trabajador</th>
            {dias.map((dia) => (
              <th key={dia}>{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matriz.map((fila, i) => (
            <tr key={i}>
              <td style={{ whiteSpace: "nowrap" }}>{fila.nombre}</td>
              {dias.map((dia) => {
                //const fecha = `${dia}-${normalizarMes(fechaMes)}`;
                const fecha = `${dia}/${fechaMes}`;
                return <td key={dia}>{fila[fecha]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CuadriculaMes1({ trabajadores, empresa, fechaMes }) {
  const dias = obtenerDiasDelMes(fechaMes);
  const lista = filtrarPorEmpresaYMes(trabajadores, empresa, fechaMes);

  return (
    <div>
      <h2>
        {empresa} — {fechaMes}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px",
        }}
      >
        {dias.map((dia) => {
          const presentes = lista.filter((t) => t.fecha === dia);

          return (
            <div key={dia} style={{ border: "1px solid #ccc", padding: "6px" }}>
              <strong>{dia}</strong>
              {presentes.length > 0 ? (
                presentes.map((t, i) => (
                  <p key={i}>
                    {t.nombre} ({t.fecha})
                  </p>
                ))
              ) : (
                <p style={{ color: "#aaa" }}>—</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function convertirMes(fechaMes) {
  const [año, mes] = fechaMes.split("-");
  return `${mes}/${año}`;
}

function App() {
  const [mostrar, setMostrar] = useState(false);
  const [modo, setModo] = useState(""); // "dia" o "mes"
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const { trabajadores, loading } = useTrabajadores(modo, fechaSeleccionada);
  const [inputFocus, setInputFocus] = useState(false);

  const trabajadoresPorEmpresa =
    modo === "dia" ? agruparPorEmpresa(trabajadores) : {};
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const empresasUnicas = trabajadores
    ? [...new Set(trabajadores.map((t) => t.empresa || "Sin empresa"))]
    : [];

  return (
    <>
      <h1>EMPRESA</h1>
      <img src={Logo} alt="Logo de la empresa" width="200" />
      <h1>Control de Presencia</h1>
      <button onClick={() => setModo("dia")}>Ver trabajadores de un dia</button>
      <button onClick={() => setModo("mes")}>Ver trabajadores del mes</button>
      {modo === "dia" && (
        <input
          type={inputFocus ? "date" : "text"}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
          placeholder="Seleccione una fecha"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
          className="selector-fecha"
        />
      )}

      {modo === "mes" && (
        <>
          <input
            type={inputFocus ? "month" : "text"}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            placeholder="Seleccione una fecha"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            className="selector-fecha"
          />

          <select
            value={empresaSeleccionada}
            onChange={(e) => setEmpresaSeleccionada(e.target.value)}
            className="selector-fecha"
          >
            <option value="">Selecciona una empresa</option>
            {empresasUnicas.map((e, i) => (
              <option key={i} value={e}>
                {e}
              </option>
            ))}
          </select>
        </>
      )}

      {/* <button onClick={() => setMostrar(!mostrar)}>Ver Trabajadores</button> */}
      <button
        disabled={!fechaSeleccionada && !empresaSeleccionada}
        onClick={() => setMostrar(!mostrar)}
      >
        Ver trabajadores
      </button>
      {loading && <p>Cargando empresas...</p>}

      {mostrar && modo === "dia" && (
        <div>
          <h2>
            Total: {trabajadores.length} trabajador
            {trabajadores.length !== 1 ? "es" : ""}
          </h2>
          {Object.entries(trabajadoresPorEmpresa).map(([empresa, lista]) => (
            <div key={empresa}>
              <h3>
                {empresa} — {lista.length} trabajador
                {lista.length !== 1 ? "es" : ""}
              </h3>
              {lista.map((trabajador, index) => (
                <p key={index}>{trabajador.nombre}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {mostrar &&
        empresaSeleccionada &&
        fechaSeleccionada &&
        trabajadores.length > 0 && (
          <CuadriculaMes
            trabajadores={trabajadores}
            empresa={empresaSeleccionada}
            fechaMes={convertirMes(fechaSeleccionada)}
          />
        )}
    </>
  );
}

export default App;
