'use strict'

/**
 * @swagger
 * tags:
 *   name: Sistemas
 *   description: API para la gestión de sistemas
 */

const Sistema = use('App/Models/Sistema')

class SistemaController {
  /**
   * @swagger
   * /api/v1/sistemas:
   *   get:
   *     summary: Obtener la lista de sistemas
   *     tags: [Sistemas]
   *     parameters:
   *       - name: page
   *         in: query
   *         description: Número de página
   *         required: false
   *         type: integer
   *       - name: limit
   *         in: query
   *         description: Cantidad de registros por página
   *         required: false
   *         type: integer
   *       - name: search
   *         in: query
   *         description: Término de búsqueda
   *         required: false
   *         type: string
   *       - name: sortBy
   *         in: query
   *         description: Campo por el cual ordenar
   *         required: false
   *         type: string
   *       - name: order
   *         in: query
   *         description: Orden (ascendente o descendente)
   *         required: false
   *         type: string
   *         enum: [asc, desc]
   *     responses:
   *       200:
   *         description: Lista de sistemas paginada
   */
  async index({ request, response }) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const sortBy = request.input('sortBy', 'id')
    const order = request.input('order', 'asc')

    let query = Sistema.query()

    if (search) {
      query.where('cod_area_funcional', 'LIKE', `%${search}%`)
           .orWhere('cod_sistema', 'LIKE', `%${search}%`)
           .orWhere('corr', 'LIKE', `%${search}%`)
           .orWhere('sistema', 'LIKE', `%${search}%`)
    }

    query.orderBy(sortBy, order)
    const sistemas = await query.paginate(page, limit)
    return response.json(sistemas)
  }

  /**
   * @swagger
   * /api/v1/sistemas:
   *   post:
   *     summary: Crear un sistema
   *     tags: [Sistemas]
   *     parameters:
   *       - name: cod_area_funcional
   *         in: query
   *         description: Código del área funcional
   *         required: true
   *         type: string
   *       - name: cod_sistema
   *         in: query
   *         description: Código del sistema
   *         required: true
   *         type: string
   *       - name: corr
   *         in: query
   *         description: Número de correlación
   *         required: true
   *         type: string
   *       - name: sistema
   *         in: query
   *         description: Nombre del sistema
   *         required: true
   *         type: string
   *     responses:
   *       201:
   *         description: Sistema creado
   */
  async store({ request, response }) {
    const data = request.only(['cod_area_funcional', 'cod_sistema', 'corr', 'sistema'])
    const sistema = await Sistema.create(data)
    return response.status(201).json(sistema)
  }

  /**
   * @swagger
   * /api/v1/sistemas/{id}:
   *   get:
   *     summary: Obtener un sistema por ID
   *     tags: [Sistemas]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del sistema
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: Datos del sistema
   */
  async show({ params, response }) {
    const sistema = await Sistema.find(params.id)
    return response.json(sistema)
  }

  /**
   * @swagger
   * /api/v1/sistemas/{id}:
   *   put:
   *     summary: Actualizar un sistema
   *     tags: [Sistemas]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del sistema
   *         required: true
   *         type: integer
   *       - name: cod_area_funcional
   *         in: query
   *         description: Código del área funcional
   *         required: false
   *         type: string
   *       - name: cod_sistema
   *         in: query
   *         description: Código del sistema
   *         required: false
   *         type: string
   *       - name: corr
   *         in: query
   *         description: Número de correlación
   *         required: false
   *         type: string
   *       - name: sistema
   *         in: query
   *         description: Nombre del sistema
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: Sistema actualizado
   */
  async update({ params, request, response }) {
    const sistema = await Sistema.find(params.id)
    const data = request.only(['cod_area_funcional', 'cod_sistema', 'corr', 'sistema'])
    sistema.merge(data)
    await sistema.save()
    return response.json(sistema)
  }

  /**
   * @swagger
   * /api/v1/sistemas/{id}:
   *   delete:
   *     summary: Eliminar un sistema
   *     tags: [Sistemas]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del sistema a eliminar
   *         required: true
   *         type: integer
   *     responses:
   *       204:
   *         description: Sistema eliminado correctamente
   */
  async destroy({ params, response }) {
    const sistema = await Sistema.find(params.id)
    await sistema.delete()
    return response.status(204).json(null)
  }
}

module.exports = SistemaController
