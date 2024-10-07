'use strict'

const Sistema = use('App/Models/Sistema')

class SistemaController {
  async index({ request, response }) {
    const page = request.input('page', 1)  // Página actual
    const limit = request.input('limit', 10)  // Límite de registros por página
    const search = request.input('search', '')  // Término de búsqueda
    const sortBy = request.input('sortBy', 'id')  // Campo por el cual ordenar
    const order = request.input('order', 'asc')  // Orden (ascendente o descendente)
  
    // Crear la consulta base
    let query = Sistema.query()
  
    // Agregar filtros de búsqueda si es necesario
    if (search) {
      query.where('cod_area_funcional', 'LIKE', `%${search}%`)
           .orWhere('cod_sistema', 'LIKE', `%${search}%`)
           .orWhere('corr', 'LIKE', `%${search}%`)
           .orWhere('sistema', 'LIKE', `%${search}%`)
    }
  
    // Aplicar ordenamiento
    query.orderBy(sortBy, order)
  
    // Paginación
    const sistemas = await query.paginate(page, limit)
  
    // Retornar los datos paginados
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
