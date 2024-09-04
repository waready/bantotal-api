'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Inventario extends Model {
  // Relación con la tabla de países
  pais() {
    return this.belongsTo('App/Models/Paises', 'pais_id', 'id')
  }

  // Relación con la tabla de sistemas
  sistema() {
    return this.belongsTo('App/Models/Sistema', 'sistema_id', 'id')
  }

  // Relación con la tabla de áreas funcionales
  areaFuncional() {
    return this.belongsTo('App/Models/Area', 'area_funcional_id', 'id')
  }

  // Relación con la tabla de usuarios
  usuario() {
    return this.belongsTo('App/Models/User', 'user_id', 'id')
  }
}

module.exports = Inventario
