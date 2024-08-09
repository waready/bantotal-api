'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')


class InventariosSchema extends Schema {
  up () {
    this.create('inventarios', (table) => {
      table.increments('id') // Auto-incrementing primary key
      table.string('codigo').notNullable()
      table.string('descripcion').notNullable()
      table.string('datos').notNullable()
      table.string('area_funcional').notNullable()
      table.string('sistema').notNullable()
      table.string('en_desarrollo').notNullable()
      table.string('capa').notNullable()
      table.string('usuario').notNullable()
      table.string('documento_detalle').notNullable()
      table.boolean('depende_de_la_plaza').notNullable()
      table.text('comentarios').notNullable()
      table.boolean('depende_del_entorno').notNullable()
      table.string('ambiente_testing').notNullable()
      table.string('pais').notNullable()
      table.boolean('borrar').notNullable()
      table.integer('user_id').unsigned().nullable() // Optional foreign key
      table.timestamps() // created_at and updated_at timestamps
    })
  }

  down () {
    this.drop('inventarios')
  }
}

module.exports = InventariosSchema
