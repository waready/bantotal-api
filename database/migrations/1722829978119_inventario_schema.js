'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')


class InventariosSchema extends Schema {
  up () {
    this.create('inventarios', (table) => {
      table.increments('id') // Auto-incrementing primary key
      table.string('codigo').notNullable()
      table.string('descripcion').notNullable()
      table.string('datos').nullable()
      table.string('area_funcional').notNullable()
      table.string('sistema').notNullable()
      table.string('en_desarrollo').nullable()
      table.string('capa').nullable()
      table.string('usuario').nullable()
      table.string('documento_detalle').nullable()
      table.boolean('depende_de_la_plaza').nullable()
      table.text('comentarios').nullable()
      table.boolean('depende_del_entorno').nullable()
      table.string('ambiente_testing').nullable()
      table.string('pais').nullable()
      table.boolean('borrar').nullable()
      table.integer('user_id').unsigned().nullable() // Optional foreign key
      table.timestamps() // created_at and updated_at timestamps
    })
  }

  down () {
    this.drop('inventarios')
  }
}

module.exports = InventariosSchema
