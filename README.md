# alpaki-skills

CLI oficial de [Alpaki](https://alpaki.app) para instalar skills en **Cursor** o **Claude Code**.

```bash
npx alpaki-skills@latest --skill creative-design/3d-web-experience
```

## Qué hace

1. Descarga la skill desde la API de Alpaki (`api.alpaki.app`).
2. La guarda como `SKILL.md` en:
   - Cursor: `./.cursor/skills/<slug>/SKILL.md`
   - Claude: `./.claude/skills/<slug>/SKILL.md` (`--tool claude`)

No empaqueta las ~800 skills en el npm: se resuelven on-demand, igual que el catálogo web.

## Uso

```bash
# Instalar una skill (mismo comando que muestra alpaki.app/skills)
npx alpaki-skills@latest --skill creative-design/3d-web-experience

# Atajo sin flag
npx alpaki-skills@latest development/api-design

# Listar / buscar
npx alpaki-skills@latest list
npx alpaki-skills@latest search "frontend"
npx alpaki-skills@latest list --category development

# Claude Code
npx alpaki-skills@latest --skill git/commit --tool claude

# Destino custom o global
npx alpaki-skills@latest --skill utilities/summarize --dir ./skills
npx alpaki-skills@latest --skill utilities/summarize --global
```

## API local / staging

```bash
ALPAKI_API_BASE=http://localhost:8881 npx alpaki-skills --skill creative-design/3d-web-experience
# o
npx alpaki-skills --skill creative-design/3d-web-experience --api http://localhost:8881
```

## Publicar en npm

```bash
npm login
npm publish --access public
```

Después de publicar, `npx alpaki-skills@latest` funcionará para cualquiera.

## Desarrollo

```bash
npm start -- --help
npm start -- --skill creative-design/3d-web-experience --api http://localhost:8881
```

## Licencia

MIT. El contenido de cada skill conserva la atribución del origen (claude-code-templates / davila7) cuando aplica.
