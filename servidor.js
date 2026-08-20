import "dotenv/config";
import express from "express";
import { readFileSync } from "node:fs";
import {
  CONFIG,
  conversar,
  leerMemoria,
  reiniciarMemoria,
} from "./cerebro.js";

if (!process.env.OPENAI_API_KEY) {
  console.log("Falta OPENAI_API_KEY en el archivo .env");
  process.exit(1);
}

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.post("/api/chat", async (req, res) => {
  const mensaje = String(req.body?.mensaje ?? "").trim();
  if (!mensaje) return res.status(400).json({ error: "Mensaje vacio" });
  try {
    const { datos, acciones } = await conversar(mensaje);
    res.json({ datos, acciones, memoria: leerMemoria() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/estado", (_req, res) => {
  res.json(leerMemoria());
});

app.post("/api/reset", (_req, res) => {
  reiniciarMemoria();
  res.json({ ok: true, memoria: leerMemoria() });
});

const PUERTO = 3000;
app.listen(PUERTO, () => {
  console.log(
    `${CONFIG.nombre} web lista: http://localhost:${PUERTO}  (terminal: npm start)`
  );
});