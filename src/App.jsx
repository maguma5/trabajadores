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
  function normalizarMes(fechaMes) {
    const [mes, año] = fechaMes.split("/");
    return `${mes.padStart(2, "0")}-${año}`; // "11-2025"
  }

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
    const mesSeleccionado = fechaMes;

    const trabajadoresEmpresa = trabajadores.filter(
      (t) => t.empresa === empresa && t.fecha?.includes(fechaMes)
    );

    const nombresUnicos = [
      ...new Set(trabajadoresEmpresa.map((t) => t.nombre)),
    ];

    const mapaIncidencias = {
      "Asistencia normal": "✅",
      "Ausente sin justificación": "❌",
      "Ausente con justificación": "📄",
      "Ausente con motivo medico con justificante": "🏥",
      "Ausente con motivo medico sin justificante": "💉",
      "Ausente por Curso y revision medica": "🩺",
      "Ausente por Problema mecánico": "🚗",
      "Asunto propio": "📆",
      "Sin documentación": "⚠️",
    };

    const leyenda = {};
    let contador = 1;

    trabajadoresEmpresa.forEach((t) => {
      const inc = t.incidencia?.trim();

      if (!inc) return;

      if (mapaIncidencias[inc]) {
        leyenda[inc] = mapaIncidencias[inc];
      } else if (!leyenda[inc]) {
        leyenda[inc] = String(contador++);
      }
    });

    const matriz = nombresUnicos.map((nombre) => {
      const fila = { nombre };
      dias.forEach((dia) => {
        const fechaCompleta = `${dia}/${mesSeleccionado}`;
        const registro = trabajadoresEmpresa.find(
          (x) => x.nombre === nombre && x.fecha === fechaCompleta
        );

        let incidencia;
        if (registro) {
          incidencia =
            typeof registro.incidencia === "string" &&
            registro.incidencia.trim()
              ? registro.incidencia.trim()
              : "Asistencia normal";
        }

        fila[fechaCompleta] = incidencia ? leyenda[incidencia] : "";
      });
      return fila;
    });

    return { dias, matriz, leyenda };
  }

  const { dias, matriz, leyenda } = construirMatriz(
    trabajadores,
    empresa,
    fechaMes
  );

  return (
    <div style={{ overflowX: "auto", maxWidth: "100%" }}>
      <table
        border="1"
        cellPadding="6"
        style={{
          minWidth: "max-content",
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
                const fecha = `${dia}/${fechaMes}`;
                return <td key={dia}>{fila[fecha]}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {Object.keys(leyenda).length > 0 && (
        <div style={{ marginTop: "1em" }}>
          <h4>Leyenda de incidencias</h4>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {Object.entries(leyenda).map(([desc, simbolo]) => (
              <li key={simbolo}>
                <strong>{simbolo}</strong> → {desc}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function convertirMes(fechaMes) {
  const [año, mes] = fechaMes.split("-");
  return `${mes}/${año}`;
}

function formatearFecha(fechaISO) {
  if (!fechaISO) return "";
  const opciones = { day: "numeric", month: "long", year: "numeric" };
  return new Date(fechaISO).toLocaleDateString("es-ES", opciones);
}

function formatearMes(fechaISO) {
  if (!fechaISO) return "";
  const opciones = { month: "long", year: "numeric" };
  return new Date(fechaISO).toLocaleDateString("es-ES", opciones);
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
          value={
            inputFocus
              ? fechaSeleccionada
              : fechaSeleccionada
              ? formatearFecha(fechaSeleccionada)
              : "Seleccione un día"
          }
          onChange={(e) => setFechaSeleccionada(e.target.value)}
          className="selector-fecha"
          style={{
            color: !fechaSeleccionada ? "white" : "white",
            fontStyle: !fechaSeleccionada ? "italic" : "normal",
            fontSize: !fechaSeleccionada ? "1.5em" : "1em",
          }}
        />
      )}

      {modo === "mes" && (
        <>
          <input
            type={inputFocus ? "month" : "text"}
            onFocus={() => setInputFocus(true)}
            onBlur={() => setInputFocus(false)}
            value={
              inputFocus
                ? fechaSeleccionada
                : fechaSeleccionada
                ? formatearMes(fechaSeleccionada)
                : "Seleccione un mes"
            }
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            className="selector-fecha"
            style={{
              color: !fechaSeleccionada ? "white" : "white",
              fontStyle: !fechaSeleccionada ? "italic" : "normal",
              fontSize: !fechaSeleccionada ? "1.5em" : "1em",
            }}
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
