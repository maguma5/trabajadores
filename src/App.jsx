import { useRef, useState } from "react";
import html2canvas from "html2canvas";
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
    <div
      style={{
        overflowX: "auto",
        maxWidth: "100%",
        width: "max-content",
        minWidth: "100%",
        padding: "0.25rem 0",
      }}
    >
      <table
        border="1"
        cellPadding="6"
        style={{
          minWidth: "max-content",
          tableLayout: "auto",
          width: "auto",
          borderCollapse: "collapse",
          background: "#ffffff",
          color: "#1f2937",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr style={{ background: "#0d3b66", color: "#ffffff" }}>
            <th
              style={{
                whiteSpace: "nowrap",
                padding: "10px 14px",
                color: "#ffffff",
                textAlign: "left",
              }}
            >
              Trabajador
            </th>
            {dias.map((dia) => (
              <th
                key={dia}
                style={{
                  minWidth: "34px",
                  padding: "10px 6px",
                  color: "#ffffff",
                  textAlign: "center",
                }}
              >
                {dia}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matriz.map((fila, i) => (
            <tr
              key={i}
              style={{
                background: i % 2 === 0 ? "#f3f7fb" : "#ffffff",
              }}
            >
              <td
                style={{
                  whiteSpace: "nowrap",
                  padding: "9px 14px",
                  fontWeight: 600,
                }}
              >
                {fila.nombre}
              </td>
              {dias.map((dia) => {
                const fecha = `${dia}/${fechaMes}`;
                return (
                  <td
                    key={dia}
                    style={{
                      minWidth: "34px",
                      padding: "9px 6px",
                      textAlign: "center",
                      fontSize: "16px",
                    }}
                  >
                    {fila[fecha]}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {Object.keys(leyenda).length > 0 && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.85rem 1rem",
            background: "#f3f7fb",
            border: "1px solid #c8d3e1",
            borderRadius: "8px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <h4 style={{ margin: "0 0 0.6rem", color: "#0d3b66" }}>
            Leyenda de incidencias
          </h4>
          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
              gap: "0.35rem 1.5rem",
              listStyle: "none",
              paddingLeft: 0,
              margin: 0,
            }}
          >
            {Object.entries(leyenda).map(([desc, simbolo]) => (
              <li key={simbolo} style={{ color: "#374151" }}>
                <strong style={{ fontSize: "1.1rem" }}>{simbolo}</strong>
                <span style={{ marginLeft: "0.4rem" }}>{desc}</span>
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
  const [successMensaje, setSuccessMensaje] = useState("");
  const mesGridRef = useRef(null);

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
      setSuccessMensaje("");
      return;
    }

    setErrorMensaje("");
    setSuccessMensaje("");
    setMostrar((prev) => !prev);
  };

  const handleDescargarJpg = async () => {
    if (!mesGridRef.current) {
      setErrorMensaje("No hay ninguna cuadrícula disponible para descargar.");
      return;
    }

    try {
      const elemento = mesGridRef.current;
      const canvas = await html2canvas(elemento, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true,
        width: elemento.scrollWidth,
        height: elemento.scrollHeight,
        windowWidth: elemento.scrollWidth,
        windowHeight: elemento.scrollHeight,
      });

      const nombreArchivo = `cuadrilla-${empresaSeleccionada || "empresa"}-${fechaSeleccionada || "mes"}.jpg`;
      const enlace = document.createElement("a");
      enlace.download = nombreArchivo;
      enlace.href = canvas.toDataURL("image/jpeg", 0.95);
      enlace.click();
      setErrorMensaje("");
      setSuccessMensaje("Descarga realizada correctamente.");
    } catch (error) {
      console.error("Error al generar la imagen JPG:", error);
      setErrorMensaje("No se pudo generar la imagen JPG.");
      setSuccessMensaje("");
    }
  };

  return (
    <div
      style={{
        maxWidth: "980px",
        margin: "0 auto",
        padding: "1.5rem 1rem 2rem",
      }}
    >
      <h1 style={{ marginBottom: "0.5rem" }}>EMPRESA</h1>
      <img
        src={Logo}
        alt="Logo de la empresa"
        width="200"
        style={{ display: "block", margin: "0 auto 1rem" }}
      />
      <h1 style={{ marginTop: 0, marginBottom: "1.25rem" }}>
        Control de Presencia
      </h1>
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={() => {
            setModo("dia");
            setEmpresaSeleccionada("");
            setMostrar(false);
            setErrorMensaje("");
            setSuccessMensaje("");
          }}
          style={{
            padding: "0.75rem 1rem",
            border: "none",
            borderRadius: "8px",
            background: "#0d3b66",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
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
            setSuccessMensaje("");
          }}
          style={{
            padding: "0.75rem 1rem",
            border: "none",
            borderRadius: "8px",
            background: "#2a6f97",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Ver trabajadores del mes
        </button>
      </div>

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

      {successMensaje && (
        <p
          role="status"
          style={{
            margin: "12px 0",
            padding: "10px 12px",
            borderRadius: "8px",
            backgroundColor: "#e8f5e9",
            color: "#1b5e20",
            border: "1px solid #c8e6c9",
            fontWeight: "600",
          }}
        >
          {successMensaje}
        </p>
      )}

      {modo === "dia" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
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
              flex: "1 1 240px",
              maxWidth: "300px",
            }}
          />

          <select
            value={empresaSeleccionada}
            onChange={(e) => {
              setEmpresaSeleccionada(e.target.value);
              setErrorMensaje("");
            }}
            className="selector-fecha"
            style={{
              flex: "1 1 240px",
              maxWidth: "300px",
            }}
          >
            <option value="">Todas las empresas</option>
            {empresasUnicas.map((e, i) => (
              <option key={i} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
      )}

      {modo === "mes" && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
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
              flex: "1 1 240px",
              maxWidth: "300px",
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
            style={{
              flex: "1 1 240px",
              maxWidth: "300px",
            }}
          >
            <option value="">Selecciona una empresa</option>
            {empresasUnicas.map((e, i) => (
              <option key={i} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
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
                cellPadding="10"
                style={{
                  borderCollapse: "collapse",
                  width: "100%",
                  maxWidth: "600px",
                  background: "#fff",
                  border: "1px solid #b8c5d6",
                  borderRadius: "10px",
                  overflow: "hidden",
                  boxShadow: "0 2px 10px rgba(13, 59, 102, 0.12)",
                }}
              >
                <thead>
                  <tr style={{ background: "#0d3b66", color: "#fff" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 14px",
                        color: "#fff",
                      }}
                    >
                      Trabajador
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 14px",
                        color: "#fff",
                      }}
                    >
                      DNI
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lista.map((trabajador, index) => (
                    <tr
                      key={index}
                      style={{
                        background: index % 2 === 0 ? "#f3f7fb" : "#ffffff",
                        borderBottom: "1px solid #c8d3e1",
                      }}
                    >
                      <td style={{ padding: "10px 14px", color: "#1f2937" }}>
                        {trabajador.nombre}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#1f2937" }}>
                        {obtenerDniTrabajador(trabajador)}
                      </td>
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
          <div>
            <div
              style={{
                marginBottom: "0.75rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleDescargarJpg}
                style={{
                  padding: "0.7rem 1rem",
                  border: "none",
                  borderRadius: "8px",
                  background: "#1e5f74",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Descargar JPG
              </button>
            </div>

            <div
              ref={mesGridRef}
              style={{
                width: "max-content",
                minWidth: "100%",
                maxWidth: "100%",
                overflowX: "auto",
                background: "#fff",
                borderRadius: "12px",
                padding: "0.5rem",
                boxShadow: "0 2px 12px rgba(13, 59, 102, 0.08)",
              }}
            >
              <div
                style={{
                  padding: "0.75rem 0.5rem 1rem",
                  color: "#0d3b66",
                  fontFamily: "Arial, sans-serif",
                  borderBottom: "3px solid #0d3b66",
                  marginBottom: "0.75rem",
                }}
              >
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  CUADRÍCULA MENSUAL
                </div>
                <div
                  style={{
                    marginTop: "0.35rem",
                    color: "#475569",
                    fontSize: "1rem",
                  }}
                >
                  Empresa: <strong>{empresaSeleccionada}</strong>
                  <span style={{ margin: "0 0.5rem" }}>|</span>
                  Periodo: <strong>{formatearMes(fechaSeleccionada)}</strong>
                </div>
              </div>
              <CuadriculaMes
                trabajadores={trabajadores}
                empresa={empresaSeleccionada}
                fechaMes={convertirMes(fechaSeleccionada)}
              />
            </div>
          </div>
        )}
    </div>
  );
}

export default App;
