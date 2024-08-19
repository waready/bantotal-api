'use strict'

const Area = use('App/Models/Area')

class AreaController {
  async index({ request, response }) {
    const areas = await Area.all()
    return response.json(areas)
  }

  async store({ request, response }) {
    const data = request.only(['nombre', 'codigo'])
    const areaFuncional = await Area.create(data)
    return response.status(201).json(areaFuncional)
  }

  async show({ params, response }) {
    const areaFuncional = await Area.find(params.id)
    return response.json(areaFuncional)
  }

  async update({ params, request, response }) {
    const areaFuncional = await Area.find(params.id)
    const data = request.only(['nombre', 'codigo'])
    areaFuncional.merge(data)
    await areaFuncional.save()
    return response.json(areaFuncional)
  }

  async destroy({ params, response }) {
    const areaFuncional = await Area.find(params.id)
    await areaFuncional.delete()
    return response.status(204).json(null)
  }
}

module.exports = AreaController
