'use strict'

const Sistema = use('App/Models/Sistema')

class SistemaController {
  async index({ request, response }) {
    const sistemas = await Sistema.all()
    return response.json(sistemas)
  }

  async store({ request, response }) {
    const data = request.only(['cod_area_funcional', 'cod_sistema', 'corr', 'sistema'])
    const sistema = await Sistema.create(data)
    return response.status(201).json(sistema)
  }

  async show({ params, response }) {
    const sistema = await Sistema.find(params.id)
    return response.json(sistema)
  }

  async update({ params, request, response }) {
    const sistema = await Sistema.find(params.id)
    const data = request.only(['cod_area_funcional', 'cod_sistema', 'corr', 'sistema'])
    sistema.merge(data)
    await sistema.save()
    return response.json(sistema)
  }

  async destroy({ params, response }) {
    const sistema = await Sistema.find(params.id)
    await sistema.delete()
    return response.status(204).json(null)
  }
}

module.exports = SistemaController
