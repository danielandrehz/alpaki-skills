# alpaki-skills

Instala skills de [Alpaki](https://alpaki.app/skills) en **Cursor** o **Claude Code** con un solo comando.

```bash
npx alpaki-skills@latest --skill creative-design/3d-web-experience
```

## Qué hace

1. Descarga la skill desde Alpaki.
2. La guarda como `SKILL.md` en tu proyecto:
   - **Cursor:** `.cursor/skills/<slug>/SKILL.md`
   - **Claude Code:** `.claude/skills/<slug>/SKILL.md` (con `--tool claude`)

No necesitas instalar nada de forma permanente: `npx` descarga el CLI al vuelo.

## Uso

```bash
# Instalar (mismo comando que ves en alpaki.app/skills)
npx alpaki-skills@latest --skill creative-design/3d-web-experience

# Atajo sin flag
npx alpaki-skills@latest development/api-design

# Listar y buscar
npx alpaki-skills@latest list
npx alpaki-skills@latest search "frontend"
npx alpaki-skills@latest list --category development

# Claude Code
npx alpaki-skills@latest --skill git/commit --tool claude

# Carpeta custom o instalación global
npx alpaki-skills@latest --skill utilities/summarize --dir ./skills
npx alpaki-skills@latest --skill utilities/summarize --global
```

## Requisitos

- Node.js 18 o superior
- Conexión a internet

## Privacidad

Al instalar una skill, Alpaki puede registrar un contador público de instalaciones en la ficha. No se envían datos personales. Para desactivarlo:

```bash
ALPAKI_DISABLE_TELEMETRY=1 npx alpaki-skills@latest --skill creative-design/3d-web-experience
```

## Licencia

Este CLI se publica bajo licencia **MIT**: puedes usarlo, copiarlo y modificarlo libremente.

El contenido de cada skill puede conservar la atribución de su origen cuando corresponda.
