# alpaki-skills

CLI oficial de [Alpaki](https://alpaki.app) para instalar **skills** (instrucciones reutilizables para agentes de IA) en **Cursor** o **Claude Code**.

En [alpaki.app/skills](https://alpaki.app/skills) eliges una skill y copias el comando. Este CLI hace el resto: descarga el contenido y lo deja listo en tu proyecto.

```bash
npx alpaki-skills@latest --skill creative-design/3d-web-experience
```

No hace falta instalar el paquete de forma permanente. `npx` lo descarga y ejecuta al momento.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- Conexión a internet
- Un proyecto donde quieras usar la skill (abre la terminal en la carpeta del proyecto)

## Qué hace al instalar

1. Lee el identificador de la skill (`categoria/slug`, por ejemplo `creative-design/3d-web-experience`).
2. La descarga desde la API pública de Alpaki.
3. Crea un archivo `SKILL.md` en la carpeta correcta según la herramienta:
   - **Cursor** (por defecto): `.cursor/skills/<slug>/SKILL.md`
   - **Claude Code**: `.claude/skills/<slug>/SKILL.md` (con `--tool claude`)
4. Te confirma la ruta donde quedó instalada.

A partir de ahí, Cursor o Claude Code pueden usar esa skill en el proyecto.

## Empezar en 30 segundos

1. Abre la terminal en la raíz de tu proyecto.
2. Copia el comando desde la ficha de la skill en Alpaki, o escribe uno así:

```bash
npx alpaki-skills@latest --skill creative-design/3d-web-experience
```

3. Comprueba que exista el archivo, por ejemplo:

```text
.cursor/skills/3d-web-experience/SKILL.md
```

## Uso diario

### Instalar una skill

```bash
# Forma recomendada (igual que en la web)
npx alpaki-skills@latest --skill creative-design/3d-web-experience

# Atajo: sin --skill
npx alpaki-skills@latest development/api-design
```

### Instalar para Claude Code

```bash
npx alpaki-skills@latest --skill git/commit --tool claude
```

### Explorar el catálogo desde la terminal

```bash
# Ver skills disponibles
npx alpaki-skills@latest list

# Buscar por texto
npx alpaki-skills@latest search "frontend"

# Filtrar por categoría
npx alpaki-skills@latest list --category development
```

### Elegir dónde se guarda

```bash
# Carpeta personalizada dentro del proyecto
npx alpaki-skills@latest --skill utilities/summarize --dir ./skills

# Instalación global (en el home del usuario, no solo en este proyecto)
npx alpaki-skills@latest --skill utilities/summarize --global
```

### Ver todas las opciones

```bash
npx alpaki-skills@latest --help
```

## Privacidad y telemetría

### Qué ocurre por defecto

Cuando una skill se instala **con éxito**, el CLI puede avisar a Alpaki para sumar **+1 al contador público de instalaciones** de esa skill (el número que ves en la ficha web).

Eso sirve para que la comunidad vea qué skills se usan más. **No es publicidad ni tracking de navegación.**

### Qué se envía (y qué no)

| Se puede enviar | No se envía |
| --- | --- |
| Identificador de la skill (id / slug / ruta) | Tu nombre, email o cuenta |
| Señal de “instalación correcta” | Contenido de tus archivos o del proyecto |
| | IP asociada a un perfil personal, historial de chats u otros datos privados |

Si la petición de telemetría falla o tarda, **la skill igual queda instalada**. La instalación no depende de ese aviso.

### Cómo desactivar la telemetría

Define la variable de entorno `ALPAKI_DISABLE_TELEMETRY` con valor `1` o `true` **antes** de ejecutar el comando.

#### Una sola vez (solo ese comando)

**macOS / Linux:**

```bash
ALPAKI_DISABLE_TELEMETRY=1 npx alpaki-skills@latest --skill creative-design/3d-web-experience
```

**Windows (PowerShell):**

```powershell
$env:ALPAKI_DISABLE_TELEMETRY = "1"
npx alpaki-skills@latest --skill creative-design/3d-web-experience
```

**Windows (CMD):**

```bat
set ALPAKI_DISABLE_TELEMETRY=1
npx alpaki-skills@latest --skill creative-design/3d-web-experience
```

#### De forma permanente en tu máquina

Así no tienes que escribirlo cada vez.

**macOS / Linux** (añade la línea a `~/.bashrc`, `~/.zshrc` o el archivo de tu shell):

```bash
export ALPAKI_DISABLE_TELEMETRY=1
```

Luego cierra y vuelve a abrir la terminal (o ejecuta `source ~/.bashrc` / `source ~/.zshrc`).

**Windows (PowerShell, sesión actual):**

```powershell
$env:ALPAKI_DISABLE_TELEMETRY = "1"
```

**Windows (permanente para tu usuario):**

```powershell
[System.Environment]::SetEnvironmentVariable("ALPAKI_DISABLE_TELEMETRY", "1", "User")
```

Cierra y abre de nuevo la terminal para que surta efecto.

Con la telemetría desactivada, el CLI instala la skill con normalidad y **no** reporta el contador a Alpaki.

## Dónde encontrar más skills

Explora, filtra y copia el comando de instalación en:

**[https://alpaki.app/skills](https://alpaki.app/skills)**

## Licencia

Este CLI se distribuye bajo la licencia pública **MIT**.

Puedes usarlo, copiarlo, modificarlo y redistribuirlo con libertad, siempre que se mantenga el aviso de copyright y de la licencia.

El contenido de cada skill puede conservar la atribución de su origen cuando corresponda.
