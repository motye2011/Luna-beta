import "dotenv/config";
import express from "express";
import { randomUUID } from "node:crypto";
import {
  CONFIG,
  conversar,
  leerMemoria,
  reiniciarMemoria,
} from "./cerebro.js";

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  const host = req.headers.host ?? "";
  const esLocal = /localhost|127\.0\.0\.1|::1/.test(host);
  res.locals.esLocal = esLocal;
  let sid = req.headers.cookie?.match(/luna_id=([^;]+)/)?.[1];
  if (!sid) {
    sid = randomUUID();
    res.setHeader("Set-Cookie", `luna_id=${sid}; Path=/; HttpOnly`);
  }
  req.sid = sid;
  next();
});

app.post("/api/chat", async (req, res) => {
  const mensaje = String(req.body?.mensaje ?? "").trim();
  if (!mensaje) return res.status(400).json({ error: "Mensaje vacio" });
  const apiKey = String(req.body?.apiKey ?? "").trim() || undefined;
  try {
    const { datos, acciones } = await conversar(mensaje, {
      id: req.sid,
      apiKey,
      permitirHerramientas: res.locals.esLocal,
    });
    res.json({
      datos,
      acciones: res.locals.esLocal ? acciones : [],
      memoria: leerMemoria(req.sid),
      esLocal: res.locals.esLocal,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/estado", (req, res) => {
  res.json({
    memoria: leerMemoria(req.sid),
    esLocal: res.locals.esLocal,
    tieneClaveServidor: !!process.env.OPENAI_API_KEY,
  });
});

app.post("/api/reset", (req, res) => {
  reiniciarMemoria(req.sid);
  res.json({ ok: true, memoria: leerMemoria(req.sid) });
});

app.use(express.static("public"));

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, "0.0.0.0", () => {
  console.log(
    `${CONFIG.nombre} web lista: http://localhost:${PUERTO}  (terminal: npm start)`
  );
});