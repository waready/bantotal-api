'use strict'

const fs = require('fs')
const path = require('path')
const axios = require('axios')

function Env() { return use('Env') }

/* --- utilidades mínimas --- */
function stripCodeFences(text = '') {
    return String(text)
        .replace(/```sql\s*([\s\S]*?)```/gi, '$1')
        .replace(/```\s*([\s\S]*?)```/g, '$1')
        .trim()
}
function stripTrailingSemicolon(s = '') {
    return s.replace(/;+\s*$/g, '')
}
function ensureSelectOnly(sql = '') {
    const q = sql.trim().toLowerCase()
    if (!q.startsWith('select')) throw new Error('La IA no devolvió un SELECT')
    if (q.includes('--') || q.includes('/*') || q.includes('*/') || q.includes(';')) {
        throw new Error('La consulta contiene comentarios o punto y coma no permitidos')
    }
    const banned = [' insert ', ' update ', ' delete ', ' drop ', ' alter ', ' truncate ', ' create ']
    if (banned.some(w => q.includes(w))) throw new Error('Solo se permiten SELECTs')
}

/* --- snapshot --- */
function loadSchemaSnapshot() {
    const p = path.join(__dirname, '../../storage/schema_snapshot.json')
    if (!fs.existsSync(p)) {
        throw new Error('Falta storage/schema_snapshot.json. Ejecuta: adonis schema:snapshot')
    }
    return JSON.parse(fs.readFileSync(p, 'utf8'))
}
function schemaToLines(schemaObj) {
    return Object.entries(schemaObj || {})
        .map(([t, cols]) => `${t}(${(cols || []).map(c => c.name).join(', ')})`)
        .join('\n')
}

/* --- prompt --- */
function buildPrompt(nl, schemaObj) {
    const schemaLines = schemaToLines(schemaObj)

    const examples = `
-- Ejemplo 1: Inventarios con área, sistema y país del último mes
-- SELECT i.id, i.codigo, i.descripcion, a.nombre AS area, s.sistema AS sistema, p.nombre AS pais, i.created_at
-- FROM inventarios i
-- LEFT JOIN areas a ON a.id = i.area_funcional_id
-- LEFT JOIN sistemas s ON s.id = i.sistema_id
-- LEFT JOIN paises p ON p.id = i.pais_id
-- WHERE i.created_at >= NOW() - INTERVAL '30 days'
-- ORDER BY i.created_at DESC
-- LIMIT 50000

-- Ejemplo 2: Conteo de inventarios por área
-- SELECT a.nombre AS area, COUNT(*) AS total
-- FROM inventarios i
-- LEFT JOIN areas a ON a.id = i.area_funcional_id
-- GROUP BY a.nombre
-- ORDER BY total DESC
-- LIMIT 50000
`.trim()

    return `
Eres un generador de SQL para PostgreSQL.
Reglas estrictas:
- Devuelve solo UNA sentencia SELECT válida (sin punto y coma al final).
- No incluyas comentarios en la salida.
- Prohibido DDL/DML (INSERT/UPDATE/DELETE/ALTER/DROP/TRUNCATE/CREATE).
- Usa nombres EXACTOS del esquema que te doy.
- Si no hay LIMIT, agrega LIMIT 50000.
- Si hay filtros de fecha, usa created_at cuando aplique.

Esquema:
${schemaLines}

${examples}

Pedido:
"${nl}"

SQL:
`.trim()
}

/* --- API pública: NL -> SQL con axios --- */
async function sqlFromNl(nl) {
    if (!nl) throw new Error('Falta nl')

    const apiKey = Env().get('AI_API_KEY')
    if (!apiKey) throw new Error('Falta AI_API_KEY en .env')

    const apiUrl = Env().get('AI_API_URL', 'https://api.openai.com/v1/chat/completions')
    const model = Env().get('AI_MODEL', 'gpt-4o-mini')
    const timeout = Number(Env().get('AI_TIMEOUT_MS', '30000'))

    const schemaObj = loadSchemaSnapshot()
    const prompt = buildPrompt(nl, schemaObj)

    const { data } = await axios.post(
        apiUrl,
        {
            model,
            temperature: 0,
            messages: [{ role: 'user', content: prompt }]
        },
        {
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            timeout
        }
    )

    let sql = (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content || '').trim()

    sql = stripCodeFences(sql)
    sql = stripTrailingSemicolon(sql)
    ensureSelectOnly(sql)

    // Opcional: fuerza LIMIT si el modelo no lo puso
    if (/^\s*select/i.test(sql) && !/limit\s+\d+/i.test(sql)) {
        sql = `${sql} LIMIT 50000`
    }

    return { sql }
}

module.exports = { sqlFromNl }
