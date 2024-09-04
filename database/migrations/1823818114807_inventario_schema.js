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
      table.integer('area_funcional_id').unsigned().nullable()
      table.integer('sistema_id').unsigned().nullable()
      table.integer('pais_id').unsigned().nullable() // Optional foreign key
      table.string('en_desarrollo').nullable()
      table.string('capa').nullable()
      table.string('usuario').nullable()
      table.string('documento_detalle').nullable()
      table.boolean('depende_de_la_plaza').nullable()
      table.text('comentarios').nullable()
      table.boolean('depende_del_entorno').nullable()
      table.string('ambiente_testing').nullable()
      table.boolean('borrar').nullable()
      table.integer('user_id').unsigned().nullable() // Optional foreign key
      table.timestamps() // created_at and updated_at timestamps
    
      // Definición de claves foráneas
      table.foreign('area_funcional_id').references('id').inTable('areas').onDelete('CASCADE')
      table.foreign('sistema_id').references('id').inTable('sistemas').onDelete('CASCADE')
      table.foreign('pais_id').references('id').inTable('paises').onDelete('SET NULL')
      table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL') // Assuming you have a users table
    })
  }

  down () {
    this.drop('inventarios')
  }
}

module.exports = InventariosSchema
