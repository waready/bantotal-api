'use strict'

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API para la autenticación de usuarios
 */

/**
 * @swagger
 * tags:
 *   name: Areas
 *   description: API para la gestión de áreas funcionales
 */

const Area = use('App/Models/Area')

class AreaController {
  /**
   * @swagger
   * /api/v1/areas:
   *   get:
   *     summary: Obtener la lista de áreas funcionales
   *     tags: [Areas]
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
   *         description: Lista de áreas funcionales paginada
   */
  async index({ request, response }) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const sortBy = request.input('sortBy', 'id')
    const order = request.input('order', 'asc')

    let query = Area.query()

    if (search) {
      query.where('nombre', 'LIKE', `%${search}%`)
           .orWhere('codigo', 'LIKE', `%${search}%`)
    }

    query.orderBy(sortBy, order)
    const areas = await query.paginate(page, limit)
    return response.json(areas)
  }

  /**
   * @swagger
   * /api/v1/areas:
   *   post:
   *     summary: Crear un área funcional
   *     tags: [Areas]
   *     parameters:
   *       - name: nombre
   *         in: query
   *         description: Nombre del área funcional
   *         required: true
   *         type: string
   *       - name: codigo
   *         in: query
   *         description: Código del área funcional
   *         required: true
   *         type: string
   *     responses:
   *       201:
   *         description: Área funcional creada
   */
  async store({ request, response }) {
    const data = request.only(['nombre', 'codigo'])
    const areaFuncional = await Area.create(data)
    return response.status(201).json(areaFuncional)
  }

  /**
   * @swagger
   * /api/v1/areas/{id}:
   *   get:
   *     summary: Obtener un área funcional por ID
   *     tags: [Areas]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del área funcional
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: Datos del área funcional
   */
  async show({ params, response }) {
    const areaFuncional = await Area.find(params.id)
    return response.json(areaFuncional)
  }

  /**
   * @swagger
   * /api/v1/areas/{id}:
   *   put:
   *     summary: Actualizar un área funcional
   *     tags: [Areas]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del área funcional
   *         required: true
   *         type: integer
   *       - name: nombre
   *         in: query
   *         description: Nombre del área funcional
   *         required: false
   *         type: string
   *       - name: codigo
   *         in: query
   *         description: Código del área funcional
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: Área funcional actualizada
   */
  async update({ params, request, response }) {
    const areaFuncional = await Area.find(params.id)
    const data = request.only(['nombre', 'codigo'])
    areaFuncional.merge(data)
    await areaFuncional.save()
    return response.json(areaFuncional)
  }

  /**
   * @swagger
   * /api/v1/areas/{id}:
   *   delete:
   *     summary: Eliminar un área funcional
   *     tags: [Areas]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del área funcional a eliminar
   *         required: true
   *         type: integer
   *     responses:
   *       204:
   *         description: Área funcional eliminada correctamente
   */
  async destroy({ params, response }) {
    const areaFuncional = await Area.find(params.id)
    await areaFuncional.delete()
    return response.status(204).json(null)
  }
}

module.exports = AreaController
