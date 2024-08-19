'use strict'

const Pais = use('App/Models/Paises')

class PaisController {
  async index({ request, response }) {
    const paises = await Pais.all()
    return response.json(paises)
  }

  async store({ request, response }) {
    const data = request.only(['nombre', 'codigo'])
    const pais = await Pais.create(data)
    return response.status(201).json(pais)
  }

  async show({ params, response }) {
    const pais = await Pais.find(params.id)
    return response.json(pais)
  }

  async update({ params, request, response }) {
    const pais = await Pais.find(params.id)
    const data = request.only(['nombre', 'codigo'])
    pais.merge(data)
    await pais.save()
    return response.json(pais)
  }

  async destroy({ params, response }) {
    const pais = await Pais.find(params.id)
    await pais.delete()
    return response.status(204).json(null)
  }
}

module.exports = PaisController
