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
      (t) => t.empresa === empresa && t.fecha?.includes(fechaMes),
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
          (x) => x.nombre === nombre && x.fecha === fechaCompleta,
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
    fechaMes,
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

function obtenerDniTrabajador(trabajador) {
  return trabajador?.dni || trabajador?.DNI || "Sin DNI";
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
  const [errorMensaje, setErrorMensaje] = useState("");

  const trabajadoresPorEmpresa =
    modo === "dia" ? agruparPorEmpresa(trabajadores) : {};
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState("");
  const empresasUnicas = trabajadores
    ? [...new Set(trabajadores.map((t) => t.empresa || "Sin empresa"))]
    : [];
  const empresasMostradas =
    modo === "dia"
      ? empresaSeleccionada
        ? {
            [empresaSeleccionada]: trabajadores.filter(
              (t) => (t.empresa || "Sin empresa") === empresaSeleccionada,
            ),
          }
        : trabajadoresPorEmpresa
      : {};
  const trabajadoresEmpresaSeleccionada =
    empresaSeleccionada && trabajadores
      ? [...trabajadores]
          .filter((t) => (t.empresa || "Sin empresa") === empresaSeleccionada)
          .sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""))
      : [];

  const validarSeleccion = () => {
    if (!modo) {
      return "Primero elige si quieres ver un día o un mes.";
    }

    if (modo === "dia" && !fechaSeleccionada) {
      return "Debes seleccionar un día antes de ver los trabajadores.";
    }

    if (modo === "mes" && !fechaSeleccionada) {
      return "Debes seleccionar un mes antes de ver los trabajadores.";
    }

    if (modo === "mes" && !empresaSeleccionada) {
      return "Debes seleccionar una empresa antes de ver los trabajadores.";
    }

    return "";
  };

  const handleVerTrabajadores = () => {
    const mensaje = validarSeleccion();

    if (mensaje) {
      setErrorMensaje(mensaje);
      return;
    }

    setErrorMensaje("");
    setMostrar((prev) => !prev);
  };

  return (
    <>
      <h1>EMPRESA</h1>
      <img src={Logo} alt="Logo de la empresa" width="200" />
      <h1>Control de Presencia</h1>
      <button
        onClick={() => {
          setModo("dia");
          setEmpresaSeleccionada("");
          setMostrar(false);
          setErrorMensaje("");
        }}
      >
        Ver trabajadores de un dia
      </button>
      <button
        onClick={() => {
          setModo("mes");
          setEmpresaSeleccionada("");
          setMostrar(false);
          setErrorMensaje("");
        }}
      >
        Ver trabajadores del mes
      </button>

      {errorMensaje && (
        <p
          role="alert"
          style={{
            margin: "12px 0",
            padding: "10px 12px",
            borderRadius: "8px",
            backgroundColor: "#fff3cd",
            color: "#856404",
            border: "1px solid #ffeeba",
            fontWeight: "600",
          }}
        >
          {errorMensaje}
        </p>
      )}

      {modo === "dia" && (
        <>
          <select
            value={empresaSeleccionada}
            onChange={(e) => {
              setEmpresaSeleccionada(e.target.value);
              setErrorMensaje("");
            }}
            className="selector-fecha"
          >
            <option value="">Todas las empresas</option>
            {empresasUnicas.map((e, i) => (
              <option key={i} value={e}>
                {e}
              </option>
            ))}
          </select>

          <input
            type={inputFocus ? "date" : "text"}
            onFocus={() => {
              setInputFocus(true);
              if (!fechaSeleccionada) {
                const hoy = new Date().toISOString().split("T")[0];
                setFechaSeleccionada(hoy);
              }
            }}
            onBlur={() => setInputFocus(false)}
            value={
              inputFocus
                ? fechaSeleccionada
                : fechaSeleccionada
                  ? formatearFecha(fechaSeleccionada)
                  : "Seleccione un día"
            }
            onChange={(e) => {
              setFechaSeleccionada(e.target.value);
              setErrorMensaje("");
            }}
            className="selector-fecha"
            style={{
              color: !fechaSeleccionada ? "white" : "white",
              fontStyle: !fechaSeleccionada ? "italic" : "normal",
              fontSize: !fechaSeleccionada ? "1.5em" : "1em",
            }}
          />
        </>
      )}

      {modo === "mes" && (
        <>
          <input
            type={inputFocus ? "month" : "text"}
            onFocus={() => {
              setInputFocus(true);
              if (!fechaSeleccionada) {
                const hoy = new Date();
                const mesActual = hoy.toISOString().slice(0, 7);
                setFechaSeleccionada(mesActual);
              }
            }}
            onBlur={() => setInputFocus(false)}
            value={
              inputFocus
                ? fechaSeleccionada
                : fechaSeleccionada
                  ? formatearMes(fechaSeleccionada)
                  : "Seleccione un mes"
            }
            onChange={(e) => {
              const nuevaFecha = e.target.value;
              setFechaSeleccionada(nuevaFecha);
              if (nuevaFecha) {
                setErrorMensaje("");
              }
            }}
            className="selector-fecha"
            style={{
              color: !fechaSeleccionada ? "white" : "white",
              fontStyle: !fechaSeleccionada ? "italic" : "normal",
              fontSize: !fechaSeleccionada ? "1.5em" : "1em",
            }}
          />

          <select
            value={empresaSeleccionada}
            onChange={(e) => {
              const nuevaEmpresa = e.target.value;
              setEmpresaSeleccionada(nuevaEmpresa);
              if (nuevaEmpresa) {
                setErrorMensaje("");
              }
            }}
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

      <button onClick={handleVerTrabajadores}>Ver trabajadores</button>
      {loading && <p>Cargando empresas...</p>}

      {mostrar && modo === "dia" && fechaSeleccionada && (
        <div>
          <h2>
            Total: {trabajadores.length} trabajador
            {trabajadores.length !== 1 ? "es" : ""}
          </h2>
          {Object.entries(empresasMostradas).map(([empresa, lista]) => (
            <div key={empresa} style={{ marginBottom: "1.5rem" }}>
              <h3>
                {empresa} — {lista.length} trabajador
                {lista.length !== 1 ? "es" : ""}
              </h3>

              <table
                border="1"
                cellPadding="8"
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  maxWidth: "600px",
                  background: "#fff",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Trabajador</th>
                    <th style={{ textAlign: "left" }}>DNI</th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((trabajador, index) => (
                    <tr key={index}>
                      <td>{trabajador.nombre}</td>
                      <td>{obtenerDniTrabajador(trabajador)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {mostrar &&
        modo === "mes" &&
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
