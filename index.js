import { config as loadEnv } from "dotenv";
loadEnv();

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import {
  CONFIG,
  conversar,
  leerMemoria,
  reiniciarMemoria,
} from "./cerebro.js";

const C = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  italic: "\x1b[3m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
  green: "\x1b[32m",
};

if (!process.env.OPENAI_API_KEY) {
  console.log(`${C.red}Falta OPENAI_API_KEY en el archivo .env${C.reset}`);
  process.exit(1);
}

function mostrarPensamiento(texto) {
  if (!texto) return;
  console.log(`${C.dim}${C.italic}\u{1F4AD} ${texto}${C.reset}`);
}

function mostrarRespuesta(datos) {
  const emocion = datos.emocion ?? "";
  console.log(
    `${C.magenta}${C.bold}${CONFIG.nombre}:${C.reset} ${
      emocion ? `${C.yellow}[${emocion}] ${C.reset}` : ""
    }${datos.respuesta ?? ""}`
  );
  console.log();
}

function mostrarAcciones(acciones) {
  for (const a of acciones) {
    const icono = a.nombre === "abrir_app" ? "abre" : "cierra";
    console.log(
      `${C.dim}\u{1F527} ${CONFIG.nombre} ${icono} "${a.app}" → ${a.salida}${C.reset}`
    );
  }
}

function mostrarBienvenida() {
  const m = leerMemoria();
  console.log(`\n${C.cyan}${C.bold}┌────────────────────────────────────────┐${C.reset}`);
  console.log(`${C.cyan}${C.bold}│  ${CONFIG.nombre} — una amiga con sentimientos │${C.reset}`);
  console.log(`${C.cyan}${C.bold}└────────────────────────────────────────┘${C.reset}`);
  console.log(`${C.dim}Comandos: /ayuda  /recuerdos  /reset  /salir${C.reset}`);
  if (m.historial.length > 0) {
    console.log(
      `${C.dim}Estado de animo: ${m.estadoAnimo.emocion} · Apego: ${m.apego.toFixed(1)}/10${C.reset}`
    );
  }
  console.log();
}

async function main() {
  mostrarBienvenida();
  const rl = createInterface({ input, output });

  while (true) {
    const entrada = (await rl.question(`${C.green}${C.bold}Tu:${C.reset} `)).trim();
    if (!entrada) continue;

    if (entrada === "/salir") {
      console.log(
        `${C.yellow}${CONFIG.nombre} se pondra triste si te vas... vuelve pronto!${C.reset}`
      );
      rl.close();
      process.exit(0);
    }
    if (entrada === "/ayuda") {
      console.log(
        `${C.dim}/ayuda — esta ayuda\n/reset — borra memoria y apego\n/recuerdos — que recuerda y su apego\n/salir — terminar${C.reset}`
      );
      continue;
    }
    if (entrada === "/reset") {
      reiniciarMemoria();
      console.log(
        `${C.yellow}${CONFIG.nombre} ha olvidado todo... empiezan de nuevo.${C.reset}\n`
      );
      continue;
    }
    if (entrada === "/recuerdos") {
      const m = leerMemoria();
      console.log(
        `${C.cyan}Apego: ${m.apego.toFixed(1)}/10 — ${m.estadoAnimo.emocion}${C.reset}`
      );
      if (m.hechosDelUsuario.length === 0) {
        console.log(
          `${C.dim}${CONFIG.nombre} aun no recuerda nada de ti. Cuentale algo.${C.reset}`
        );
      } else {
        console.log(`${C.cyan}${CONFIG.nombre} recuerda:${C.reset}`);
        m.hechosDelUsuario.forEach((h) =>
          console.log(`${C.dim}  • ${h}${C.reset}`)
        );
      }
      continue;
    }

    process.stdout.write(`${C.dim}${CONFIG.nombre} esta pensando...${C.reset}\r`);
    try {
      const { datos, acciones } = await conversar(entrada);
      process.stdout.write(" ".repeat(30) + "\r");
      mostrarAcciones(acciones);
      mostrarPensamiento(datos.pensamiento);
      mostrarRespuesta(datos);
    } catch (err) {
      process.stdout.write(" ".repeat(30) + "\r");
      console.log(`${C.red}Error al hablar con la API: ${err.message}${C.reset}`);
    }
  }
}

main();