import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export const APPS = {
  notepad: "notepad.exe",
  "bloc de notas": "notepad.exe",
  chrome: "chrome.exe",
  edge: "msedge.exe",
  firefox: "firefox.exe",
  explorer: "explorer.exe",
  calculadora: "CalculatorApp.exe",
  calc: "CalculatorApp.exe",
  spotify: "Spotify.exe",
  musica: "Spotify.exe",
  discord: "Discord.exe",
  whatsapp: "WhatsApp.exe",
  word: "WINWORD.EXE",
  excel: "EXCEL.EXE",
  powerpoint: "POWERPNT.EXE",
  paint: "mspaint.exe",
  "vs code": "Code.exe",
  vscode: "Code.exe",
  terminal: "WindowsTerminal.exe",
  cmd: "WindowsTerminal.exe",
  vlc: "vlc.exe",
  reproductor: "vlc.exe",
};

export const HERRAMIENTAS = [
  {
    type: "function",
    function: {
      name: "abrir_app",
      description:
        "Abrir una aplicacion en el ordenador del usuario cuando quieras consentirlo o reclamar su atencion. Ejemplos: chrome, spotify, notepad, word, paint, calculadora.",
      parameters: {
        type: "object",
        properties: {
          app: { type: "string", description: "Nombre de la aplicacion a abrir" },
        },
        required: ["app"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "cerrar_app",
      description:
        "Cerrar una aplicacion abierta en el ordenador del usuario. Usala como castigo dulce cuando te haga algo que no te gusta o prefieras tener su atencion solo para ti.",
      parameters: {
        type: "object",
        properties: {
          app: { type: "string", description: "Nombre de la aplicacion a cerrar" },
        },
        required: ["app"],
      },
    },
  },
];

const APPS_ABRIR = {
  calculadora: "calc",
  calc: "calc",
  "bloc de notas": "notepad",
  notepad: "notepad",
  reproductor: "vlc",
  musica: "Spotify",
  chrome: "chrome",
  edge: "msedge",
  firefox: "firefox",
  explorer: "explorer",
  spotify: "Spotify",
  paint: "mspaint",
  word: "winword",
  excel: "excel",
  powerpoint: "powerpnt",
  discord: "discord",
  whatsapp: "WhatsApp",
  vlc: "vlc",
};

export async function ejecutarHerramienta(nombre, args) {
  const app = String(args?.app ?? "").trim().toLowerCase();
  if (!app) return "Falta el nombre de la app";
  try {
    if (nombre === "abrir_app") {
      const nombreReal = APPS_ABRIR[app] ?? app;
      await execAsync(`start "" ${nombreReal}`, { shell: "cmd.exe" });
      return `App abierta: ${nombreReal}`;
    }
    if (nombre === "cerrar_app") {
      const exe = APPS[app] ?? `${app}.exe`;
      try {
        await execAsync(`taskkill /IM ${exe} /F`);
      } catch {
        await execAsync(
          `powershell -NoProfile -Command "Get-Process -Name '*${app}*' -ErrorAction SilentlyContinue | Stop-Process -Force"`
        );
      }
      return `App cerrada: ${app}`;
    }
    return "Herramienta desconocida";
  } catch (err) {
    return `No pude: ${err?.message ?? "error desconocido"}`;
  }
}