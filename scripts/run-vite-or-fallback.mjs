import { createServer } from 'node:http'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { spawn, spawnSync } from 'node:child_process'

const command = process.argv[2]
const forwardedArgs = process.argv.slice(3)
const root = resolve(import.meta.dirname, '..')
const viteBin = process.platform === 'win32'
  ? join(root, 'node_modules', '.bin', 'vite.cmd')
  : join(root, 'node_modules', '.bin', 'vite')

if (existsSync(viteBin)) {
  const child = spawn(viteBin, [command, ...forwardedArgs], {
    cwd: root,
    stdio: 'inherit',
  })

  child.on('exit', (code) => process.exit(code ?? 0))
} else if (command === 'build') {
  runFallbackBuild()
} else if (command === 'dev' || command === 'preview') {
  runFallbackServer(command)
} else {
  console.error(`Unsupported fallback command: ${command}`)
  process.exit(1)
}

function runFallbackBuild() {
  const typecheck = spawnSync('tsc', ['-b'], { cwd: root, stdio: 'inherit' })
  if (typecheck.status !== 0) {
    process.exit(typecheck.status ?? 1)
  }

  const distDir = join(root, 'dist')
  mkdirSync(distDir, { recursive: true })
  writeFileSync(join(distDir, 'index.html'), renderFallbackHtml('Build Preview'))
  console.log('Fallback build completed because local Vite dependencies are not installed.')
}

function runFallbackServer(label) {
  const host = getFlagValue('--host') ?? '127.0.0.1'
  const port = Number(getFlagValue('--port') ?? 5173)
  const server = createServer((_request, response) => {
    response.writeHead(200, { 'content-type': 'text/html; charset=utf-8' })
    response.end(renderFallbackHtml(`${label} Preview`))
  })

  server.listen(port, host, () => {
    console.log(`Fallback ${label} server running at http://${host}:${port}/`)
    console.log('Install dependencies to use the full Vite dev server.')
  })
}

function getFlagValue(flag) {
  const index = forwardedArgs.indexOf(flag)
  if (index === -1) return undefined
  return forwardedArgs[index + 1]
}

function renderFallbackHtml(label) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SoTA | ${label}</title>
    <style>
      body { margin: 0; min-height: 100vh; font-family: Inter, ui-sans-serif, system-ui, sans-serif; background: #eef3fb; color: #172033; }
      main { max-width: 1120px; margin: 0 auto; padding: 32px 20px; }
      section { background: white; border: 1px solid #e2e8f0; border-radius: 28px; padding: 28px; box-shadow: 0 1px 3px rgb(15 23 42 / 0.08); }
      .brand { display: inline-flex; align-items: center; gap: 12px; font-weight: 800; }
      .badge { background: #4f46e5; color: white; border-radius: 16px; padding: 8px 14px; }
      .warning { margin-top: 24px; background: #fffbeb; color: #78350f; border: 1px solid #fde68a; border-radius: 18px; padding: 14px 16px; font-weight: 600; }
      .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-top: 24px; }
      .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 18px; padding: 16px; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <div class="brand"><span class="badge">SoTA</span><span>Source of Truth Assistant</span></div>
        <h1>Turn messy customer context into structured action.</h1>
        <p>This fallback page is served only when local Vite dependencies are unavailable. Run <code>npm install</code> to use the full React prototype.</p>
        <div class="warning">Prototype only. Do not enter PHI, patient data, payment card data, or confidential contract terms.</div>
        <div class="grid">
          <div class="card">New Field Note</div>
          <div class="card">Review Output</div>
          <div class="card">History</div>
          <div class="card">Settings</div>
        </div>
      </section>
    </main>
  </body>
</html>`
}
