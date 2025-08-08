// app/Services/SchemaSnapshot.js
'use strict'

const fs = require('fs')
const path = require('path')

// Resuelve vía IoC cuando se usa (evita problemas al cargar comandos)
function Env ()      { return use('Env') }
function Config ()   { return use('Config') }
function Database () { return use('Database') }

// Normaliza resultado de Database.raw (PG / MySQL)
async function rawRows (sql, bindings = []) {
  const res = await Database().raw(sql, bindings)
  if (Array.isArray(res)) return Array.isArray(res[0]) ? res[0] : res   // MySQL/MariaDB
  if (res && res.rows) return res.rows                                  // PostgreSQL
  return []
}

/**
 * Construye un snapshot del esquema y lo guarda en storage/schema_snapshot.json
 * @param {Object} opts
 * @param {String} [opts.pgSchema]  - Nombre del schema en Postgres (default: .env PG_SCHEMA o searchPath o 'public')
 * @param {String[]} [opts.onlyTables] - Lista blanca opcional de tablas a incluir
 * @returns {Promise<String>} Ruta del archivo generado
 */
async function buildSchemaSnapshot ({ pgSchema, onlyTables } = {}) {
  // Lee primero de .env, luego de config como respaldo
  const conn       = (Env().get('DB_CONNECTION', Config().get('database.connection', 'pg')) || '').toLowerCase()
  const envSchema  = Env().get('PG_SCHEMA', null)

  // searchPath en config puede ser string o array; toma el 1ro si es array
  const defaultConn = Config().get('database.connection')
  const cfgSearch   = Config().get(`database.connections.${defaultConn}.searchPath`, 'public')
  const cfgSchema   = Array.isArray(cfgSearch) ? (cfgSearch[0] || 'public') : (cfgSearch || 'public')

  // Prioridad para PG: argumento -> .env PG_SCHEMA -> config.searchPath -> 'public'
  pgSchema = pgSchema || envSchema || cfgSchema || 'public'

  // 1) Obtener tablas
  let tables = []
  if (conn.includes('pg')) {
    // ----- POSTGRES -----
    tables = await rawRows(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = ? AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `, [pgSchema])
  } else {
    // ----- MYSQL / MARIADB -----
    tables = await rawRows(`
      SELECT TABLE_NAME AS table_name
      FROM information_schema.tables
      WHERE table_schema = (SELECT DATABASE())
      ORDER BY TABLE_NAME
    `)
  }

  // Lista de nombres de tabla
  let names = tables.map(r => r.table_name || r.TABLE_NAME)

  // (Opcional) limitar a una lista blanca
  if (Array.isArray(onlyTables) && onlyTables.length) {
    const allow = new Set(onlyTables.map(s => s.toLowerCase()))
    names = names.filter(n => allow.has(n.toLowerCase()))
  }

  // Excluir tablas ruido (knex)
  const blacklist = new Set(['knex_migrations', 'knex_migrations_lock'])
  names = names.filter(n => !blacklist.has(n))

  // 2) Columnas
  const schema = {}
  for (const tableName of names) {
    let cols = []
    if (conn.includes('pg')) {
      cols = await rawRows(`
        SELECT column_name AS name, data_type AS type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = ? AND table_name = ?
        ORDER BY ordinal_position
      `, [pgSchema, tableName])
    } else {
      cols = await rawRows(`
        SELECT COLUMN_NAME AS name, DATA_TYPE AS type, IS_NULLABLE AS is_nullable
        FROM information_schema.columns
        WHERE table_schema = (SELECT DATABASE()) AND table_name = ?
        ORDER BY ORDINAL_POSITION
      `, [tableName])
    }

    schema[tableName] = cols.map(c => ({
      name: c.name,
      type: c.type,
      nullable: String(c.is_nullable || '').toUpperCase() === 'YES'
    }))
  }

  // Asegura storage/
  const outDir = path.join(__dirname, '../../storage')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  // Guardar snapshot
  const outfile = path.join(outDir, 'schema_snapshot.json')
  fs.writeFileSync(outfile, JSON.stringify(schema, null, 2))
  return outfile
}

function loadSchemaSnapshot () {
  const p = path.join(__dirname, '../../storage/schema_snapshot.json')
  return JSON.parse(fs.readFileSync(p, 'utf8'))
}

module.exports = { buildSchemaSnapshot, loadSchemaSnapshot }
