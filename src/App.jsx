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

function obtenerDiasDelMes(fechaMes) {
  const [mes, año] = fechaMes.split("/");
  const dias = [];
  const totalDias = new Date(año, mes, 0).getDate(); // último día del mes

  for (let i = 1; i <= totalDias; i++) {
    const dia = i.toString().padStart(2, "0");
    dias.push(`${dia}-${mes}-${año}`); // formato dd-MM-yyyy
  }

  return dias;
}

function filtrarPorEmpresaYMes(trabajadores, empresa, fechaMes) {
  //const mesSeleccionado = convertirMes(fechaMes); // MM-yyyy
  return trabajadores.filter(
    //console.log("empresa :", empresa, " y mesSeleccionado :", mesSeleccionado),
    //(t) => t.empresa === empresa && t.fecha?.includes(mesSeleccionado)
    (t) => t.empresa === empresa && t.fecha?.includes(fechaMes)
  );
}

function CuadriculaMes({ trabajadores, empresa, fechaMes }) {
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
                presentes.map((t, i) => <p key={i}>{t.nombre}</p>)
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
          type="date"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        />
      )}

      {modo === "mes" && (
        <>
          <input
            type="month"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
          />

          <select
            value={empresaSeleccionada}
            onChange={(e) => setEmpresaSeleccionada(e.target.value)}
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
      <button onClick={() => setMostrar(!mostrar)}>Ver Trabajadores</button>
      {loading && <p>Cargando...</p>}

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

      {/* {mostrar && (
        <div>
          {trabajadores.length > 0 ? (
            trabajadores.map((trabajador, index) => (
              <p key={index}>{trabajador.nombre}</p>
            ))
          ) : (
            <p>No hay trabajadores para esa fecha</p>
          )}
        </div>
      )} */}
    </>
  );
}

export default App;
