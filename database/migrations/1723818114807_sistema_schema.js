'use strict'

const Schema = use('Schema')

class SistemasSchema extends Schema {
  up () {
    this.create('sistemas', (table) => {
      table.increments('id') // Auto-incrementing primary key
      table.integer('cod_area_funcional').notNullable()
      table.integer('cod_sistema').notNullable()
      table.integer('corr').notNullable()
      table.string('sistema', 255).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('sistemas')
  }
}

module.exports = SistemasSchema
