'use strict'

const Role = use('Role')
const Permission = use('Permission')

class RoleController {
  // Listar todos los roles
  async index({ response }) {
    const roles = await Role.all()
    return response.json(roles)
  }

  // Crear nuevo rol
  async store({ request, response }) {
    const { name, slug, description, permissions } = request.only([
      'name', 'slug', 'description', 'permissions'
    ])
    const role = await Role.create({ name, slug, description })

    // Asignar permisos si vienen en el request
    if (permissions && permissions.length) {
      await role.permissions().sync(permissions) // Array de IDs
    }

    return response.status(201).json(role)
  }

  // Ver un rol
  async show({ params, response }) {
    const role = await Role.findOrFail(params.id)
    await role.load('permissions')
    return response.json(role)
  }

  // Editar un rol y sus permisos
  async update({ params, request, response }) {
    const role = await Role.findOrFail(params.id)
    const { name, slug, description, permissions } = request.only([
      'name', 'slug', 'description', 'permissions'
    ])

    role.merge({ name, slug, description })
    await role.save()

    // Actualiza permisos
    if (permissions) {
      await role.permissions().sync(permissions)
    }

    await role.load('permissions')
    return response.json(role)
  }

  // Eliminar un rol
  async destroy({ params, response }) {
    const role = await Role.findOrFail(params.id)
    await role.delete()
    return response.status(204).send()
  }
}

module.exports = RoleController
