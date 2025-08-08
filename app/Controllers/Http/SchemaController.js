'use strict'
const Database = use('Database')
const Audit = use('App/Models/Audit')

const ALLOWED_TYPES = new Set(['string','integer','boolean','date','datetime','text','json'])

function validIdent(s='') {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(s)
}

async function tableExists(table) {
  const [rows] = await Database.raw(`
    SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
  `, [table])
  return rows && rows.length > 0
}

async function columnExists(table, column) {
  const [rows] = await Database.raw(`
    SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?
  `, [table, column])
  return rows && rows.length > 0
}

async function auditSchema({ action, payload, userId }) {
  await Audit.create({
    auditable_type: 'Schema',
    auditable_id: 0,
    event: action,                      // 'add_column' | 'rename_column'
    old_values: null,
    new_values: JSON.stringify({ ...payload, userId }),
  })
}

class SchemaController {
  async addColumn({ request, auth, response }) {
    const { table, column, type, nullable = true, def = null, after = null } = request.only([
      'table','column','type','nullable','def','after'
    ])

    if (!validIdent(table) || !validIdent(column)) {
      return response.status(400).json({ error: 'Identificadores inválidos.' })
    }
    if (!ALLOWED_TYPES.has(String(type))) {
      return response.status(400).json({ error: 'Tipo no permitido.' })
    }

    if (!(await tableExists(table))) {
      return response.status(400).json({ error: 'La tabla no existe.' })
    }
    if (await columnExists(table, column)) {
      return response.status(400).json({ error: 'La columna ya existe.' })
    }

    // Ejecuta DDL controlado
    await Database.schema.alterTable(table, (t) => {
      let col
      switch (type) {
        case 'string':   col = t.string(column)   ; break
        case 'integer':  col = t.integer(column)  ; break
        case 'boolean':  col = t.boolean(column)  ; break
        case 'date':     col = t.date(column)     ; break
        case 'datetime': col = t.dateTime(column) ; break
        case 'text':     col = t.text(column, 'longtext'); break
        case 'json':     col = t.json(column)     ; break // MySQL 5.7+/PG
        default: throw new Error('Tipo no soportado')
      }
      if (nullable === false) col.notNullable()
      if (def !== null && def !== undefined) col.defaultTo(def)
      if (after && validIdent(after) && Database.client.config.client.includes('mysql')) {
        col.after(after) // solo MySQL/MariaDB
      }
    })

    await auditSchema({
      action: 'add_column',
      payload: { table, column, type, nullable, def, after },
      userId: auth.user && auth.user.id
    })

    return response.json({ ok: true, message: `Columna ${column} agregada a ${table}` })
  }

  async renameColumn({ request, auth, response }) {
    const { table, oldName, newName } = request.only(['table','oldName','newName'])

    if (![table, oldName, newName].every(validIdent)) {
      return response.status(400).json({ error: 'Identificadores inválidos.' })
    }
    if (!(await tableExists(table))) {
      return response.status(400).json({ error: 'La tabla no existe.' })
    }
    if (!(await columnExists(table, oldName))) {
      return response.status(400).json({ error: 'La columna original no existe.' })
    }
    if (await columnExists(table, newName)) {
      return response.status(400).json({ error: 'La columna destino ya existe.' })
    }

    // OJO: renameColumn requiere dependencia 'knex' que lo soporte.
    await Database.schema.alterTable(table, (t) => {
      t.renameColumn(oldName, newName)
    })

    await auditSchema({
      action: 'rename_column',
      payload: { table, oldName, newName },
      userId: auth.user && auth.user.id
    })

    return response.json({ ok: true, message: `Columna ${oldName} renombrada a ${newName} en ${table}` })
  }
}

module.exports = SchemaController
