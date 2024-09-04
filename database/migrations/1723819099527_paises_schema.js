'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PaisesSchema extends Schema {
  up () {
    this.create('paises', (table) => {
      table.increments('id') // Auto-incrementing primary key
      table.string('nombre', 80).notNullable()
      table.string('codigo', 10).notNullable().unique()
      table.timestamps()
    })
  }

  down () {
    this.drop('paises')
  }
}

module.exports = PaisesSchema
