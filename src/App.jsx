import { use, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useFirebase } from "./libs/hooks/useFirebase";
import {
  getFirestore,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { useTrabajadores } from "./libs/hooks/useTrabajadores";

function App() {
  const { trabajadores } = useTrabajadores();

  return (
    <>
      <h1>Vite + React AHORA</h1>
      {trabajadores.map((trabajador, index) => (
        <p key={index}>{trabajador.nombre}</p>
      ))}
      <div className="card">
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
