'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Paises extends Model {
  static get fillable () {
    return ['nombre', 'codigo']
  }

  static get table () {
    return 'paises'
  }
}

module.exports = Paises
