// app/Helpers/Auditor.js
'use strict'

const Audit = use('App/Models/Audit')

/**
 * Guarda un registro en la tabla audits.
 * 
 * @param {Object} params
 * @param {Object} params.instance - Instancia del modelo modificado
 * @param {String} params.action - 'create', 'update', 'delete'
 * @param {Object|null} params.oldValues - Valores anteriores (para update/delete)
 */
async function audit({ instance, action, oldValues = null }) {
  await Audit.create({
    auditable_type: instance.constructor.name,
    auditable_id: instance.id,
    event: action,
    old_values: oldValues ? JSON.stringify(oldValues) : null,
    new_values: JSON.stringify(instance.$attributes),
    // created_at y updated_at se rellenan automáticamente si usas timestamps
  })
}

module.exports = audit
