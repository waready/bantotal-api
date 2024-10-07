'use strict'

const Pais = use('App/Models/Paises')

class PaisController {
  async index({ request, response }) {

    const page = request.input('page', 1)  // Página actual
    const limit = request.input('limit', 10)  // Límite de registros por página
    const search = request.input('search', '')  // Término de búsqueda
    const sortBy = request.input('sortBy', 'id')  // Campo por el cual ordenar
    const order = request.input('order', 'asc')  // Orden (ascendente o descendente)

    // Crear la consulta base
    let query = Pais.query()

    // Agregar filtros de búsqueda si es necesario
    if (search) {
      query.where('codigo', 'LIKE', `%${search}%`)
           .orWhere('nombre', 'LIKE', `%${search}%`)
    }

    // Aplicar ordenamiento
    query.orderBy(sortBy, order)

    // Paginación
    const paises = await query.paginate(page, limit)

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
