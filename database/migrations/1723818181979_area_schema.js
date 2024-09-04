'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AreaSchema extends Schema {
  up () {
    this.create('areas', (table) => {
      table.increments('id') // Auto-incrementing primary key
      table.string('nombre').notNullable() // Name of the functional area
      table.string('codigo').notNullable() // Code for the functional area
      table.timestamps() // Created at and updated at timestamps
    });
  }

  down () {
    this.drop('areas')
  }
}

module.exports = AreaSchema
