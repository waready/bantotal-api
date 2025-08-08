'use strict'

const User = use('App/Models/User')
const Role = use('Role')

class UserController {
  // Listar usuarios con roles
  async index({ response }) {
    const users = await User.query().with('roles').fetch()
    return response.json(users)
  }

  // Crear usuario y asignar rol
  async store({ request, response }) {
    const { email, password, role_id } = request.only(['email', 'password', 'role_id'])

    const user = await User.create({ email, password, username: email })
    if (role_id) {
      await user.roles().attach([role_id])
    }

    await user.load('roles')
    return response.status(201).json(user)
  }

  // Editar usuario (cambiar rol)
  async update({ params, request, response }) {
    const user = await User.findOrFail(params.id)
    const { email, password, role_id } = request.only(['email', 'password', 'role_id'])

    user.merge({ email })
    if (password) {
      user.password = password
    }
    await user.save()

    // Cambiar rol (solo 1 para ejemplo, usa sync si solo quieres un rol)
    if (role_id) {
      await user.roles().sync([role_id])
    }

    await user.load('roles')
    return response.json(user)
  }

  // Eliminar usuario
  async destroy({ params, response }) {
    const user = await User.findOrFail(params.id)
    await user.delete()
    return response.status(204).send()
  }
}

module.exports = UserController
