import { collection, getDocs } from "firebase/firestore";
import db from "../firebase/firestore";

export async function getEmpresasUnicas() {
  const snapshot = await getDocs(collection(db, "trabajadores"));
  const empresas = new Set();
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.empresa) empresas.add(data.empresa);
  });
  return Array.from(empresas);
}
