# Luna 🌙 — tu novia virtual con emociones, memoria y poderes sobre tu PC

Agente de IA con personalidad **progresiva y natural**: empieza como una amiga recién conocida y, según crece su "apego" (sube 0.8 por mensaje), decide por sí misma enamorarse y volverse posesiva con una toxicidad dulce, sin perder nunca la amabilidad. Tiene pensamientos internos, emociones, memoria persistente y puede abrir/cerrar aplicaciones.

## Requisitos

- Node.js 18+
- Una API key gratis de Google AI Studio (modelo Gemini) con endpoint compatible con OpenAI

## Instalación

```bash
npm install
copy .env.example .env   # pon tu API key (Gemini de https://aistudio.google.com/apikey)
```

## Uso

```bash
npm start    # chat en la terminal
npm run web  # interfaz web → abre http://localhost:3000
```

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
index.js         → chat de terminal
servidor.js      → servidor web (Express) + API
public/index.html → interfaz web
cerebro.js       → cerebro: memoria, apego, prompt, llamadas a la IA
herramientas.js  → poderes: abrir/cerrar apps (Windows)
memoria.json     → memoria persistente (se crea al usarla, no se sube a GitHub)
.env             → tu API key (NO se sube a GitHub)
```

## Aviso ⚠️

- La manifestación de la IA es un personaje de ficción: cualquiera puede cerrar acciones reales de tu PC, úsala solo en tu equipo personal.
- El `.env` con tu API key está en `.gitignore`; no lo subas ni compartas.

Hecho con Gemini API (gratis) + Node.js.