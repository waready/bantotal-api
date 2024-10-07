'use strict'

const Area = use('App/Models/Area')

class AreaController {
  async index({ request, response }) {
    const page = request.input('page', 1)  // Página actual
    const limit = request.input('limit', 10)  // Límite de registros por página
    const search = request.input('search', '')  // Término de búsqueda
    const sortBy = request.input('sortBy', 'id')  // Campo por el cual ordenar
    const order = request.input('order', 'asc')  // Orden (ascendente o descendente)

    // Crear la consulta base
    let query = Area.query()

    // Agregar filtros de búsqueda si es necesario
    if (search) {
      query.where('nombre', 'LIKE', `%${search}%`)
           .orWhere('codigo', 'LIKE', `%${search}%`)
    }

    // Aplicar ordenamiento
    query.orderBy(sortBy, order)


    // Paginación
    const areas = await query.paginate(page, limit)

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
