'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')
/** @type {import('@adonisjs/auditable/src/Auditor')} */
const audit = use('App/Helpers/Auditor')

class User extends Model {
  static get traits() {
    return [
      '@provider:Adonis/Acl/HasRole',
      '@provider:Adonis/Acl/HasPermission'
    ]
  }
  static boot() {
    super.boot()

    // Hash de password antes de guardar
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })

    // Auditoría: después de crear
    this.addHook('afterCreate', async (instance) => {
      await audit({ instance, action: 'create' })
    })

    // Auditoría: después de actualizar
    this.addHook('afterUpdate', async (instance) => {
      await audit({
        instance,
        action: 'update',
        oldValues: instance.$originalAttributes
      })
    })

    // Auditoría: después de borrar
    this.addHook('afterDelete', async (instance) => {
      await audit({
        instance,
        action: 'delete',
        oldValues: instance.$originalAttributes
      })
    })

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens() {
    return this.hasMany('App/Models/Token')
  }
}

module.exports = User
