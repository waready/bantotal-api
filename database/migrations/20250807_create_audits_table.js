'use strict'

const Schema = use('Schema')

class AuditsTableSchema extends Schema {
  up () {
    this.create('audits', (table) => {
      table.increments()
      table.string('auditable_type')    // Modelo auditado (ej: User)
      table.integer('auditable_id')     // ID del registro auditado
      table.string('event')             // 'create', 'update', 'delete'
      table.text('old_values', 'longtext') // JSON: valores antes
      table.text('new_values', 'longtext') // JSON: valores después
      table.timestamps()
    })
  }

  down () {
    this.drop('audits')
  }
}

module.exports = AuditsTableSchema
