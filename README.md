# Luna 🌙 — amiga virtual con emociones, memoria y control de apps

Agente de IA con personalidad **progresiva y natural**: empieza como una amiga recién conocida y, según crece su "apego" (sube 0.8 por mensaje), decide por sí misma enamorarse y volverse posesiva con una toxicidad dulce, sin perder nunca la amabilidad. Tiene pensamientos internos, emociones, memoria persistente y puede abrir/cerrar aplicaciones (solo en local).

## Requisitos

- Node.js 18+
- Una API key GRATIS de Google AI Studio (Gemini): https://aistudio.google.com/apikey

## Uso

**En local (con poderes: abre/cierra tus apps):**

```bash
npm install
npm start      # chat en la terminal (si no hay .env, te pide la key al inicio)
npm run web    # web en http://localhost:3000 (puedes meter la key en la pantalla de inicio)
```

**En internet (para que cualquiera entre sin instalar nada):**

1. Sube este repo a GitHub
2. En [render.com](https://render.com) → New → Blueprint → conecta tu repo (detecta `render.yaml` automáticamente)
3. Listo: Render te da una URL tipo `luna.onrender.com`

En la web pública **el control de apps se desactiva automáticamente** (los navegadores no permiten tocar tu PC desde una página externa). Cada visitante introduce SU propia API key en la pantalla de inicio — no se guarda en el servidor, solo en su navegador.

## Comandos (terminal)

| Comando | Qué hace |
|---|---|
| `/recuerdos` | Muestra qué recuerda y su nivel de apego |
| `/reset` | Borra memoria y apego (empezar de nuevo) |
| `/ayuda` | Ayuda |
| `/salir` | Salir |

## Configuración (`config.json`)

- `nombre`: el nombre de Luna
- `modelo` / `baseURL`: modelo de IA y su endpoint
- `incrementoApego`: cuánto sube el apego por mensaje (velocidad de celos 😏)
- `personalidad`: rol y forma de hablar
- `maxHistorial`: cuántos mensajes recuerda de la conversación

## Arquitectura

```
index.js         → chat de terminal (modo local, usa memoria.json)
servidor.js      → servidor web (Express) + API, memoria por usuario (cookie)
public/index.html → interfaz web con pantalla de API key + botón "cambiar key"
cerebro.js       → cerebro: memoria, apego, prompt, llamadas a la IA
herramientas.js  → poderes: abrir/cerrar apps (solo si petición desde localhost)
config.json      → nombre, modelo, incremento de apego, personalidad
memoria.json     → memoria local (no se sube a GitHub)
.env             → tu API key (NO se sube a GitHub)
render.yaml      → despliegue automático en Render
```

## Aviso ⚠️

- Luna es un personaje de ficción. En local puede abrir/cerrar apps reales de tu PC: úsala solo en tu equipo.
- Las API keys son personales y van solo en tu navegador o en tu `.env`; no se suben a GitHub ni al servidor.

Hecho con Gemini API (gratis) + Node.js.