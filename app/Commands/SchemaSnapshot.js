// app/Commands/SchemaSnapshot.js
'use strict'
const { Command } = use('@adonisjs/ace')

class SchemaSnapshot extends Command {
  static get signature () {
    return `
      schema:snapshot
      { --schema=@value : (PG) Nombre del schema; default "public" }
    `
  }

  static get description () {
    return 'Genera snapshot de esquema en storage/schema_snapshot.json'
  }

  async handle (args, options) {
    const { buildSchemaSnapshot } = use('App/Services/SchemaSnapshot')
    const pgSchema = options.schema || 'public'
    const file = await buildSchemaSnapshot({ pgSchema })
    this.success(`Snapshot creado: ${file} (schema=${pgSchema})`)
  }
}

module.exports = SchemaSnapshot
