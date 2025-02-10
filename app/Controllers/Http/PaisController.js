'use strict'

/**
 * @swagger
 * tags:
 *   name: Paises
 *   description: API para la gestión de países
 */

const Pais = use('App/Models/Paises')

class PaisController {
  /**
   * @swagger
   * /api/v1/paises:
   *   get:
   *     summary: Obtener la lista de países
   *     tags: [Paises]
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
   *         description: Lista de países paginada
   */
  async index({ request, response }) {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)
    const search = request.input('search', '')
    const sortBy = request.input('sortBy', 'id')
    const order = request.input('order', 'asc')

    let query = Pais.query()

    if (search) {
      query.where('codigo', 'LIKE', `%${search}%`)
           .orWhere('nombre', 'LIKE', `%${search}%`)
    }

    query.orderBy(sortBy, order)
    const paises = await query.paginate(page, limit)
    return response.json(paises)
  }

  /**
   * @swagger
   * /api/v1/paises:
   *   post:
   *     summary: Crear un país
   *     tags: [Paises]
   *     parameters:
   *       - name: nombre
   *         in: query
   *         description: Nombre del país
   *         required: true
   *         type: string
   *       - name: codigo
   *         in: query
   *         description: Código del país
   *         required: true
   *         type: string
   *     responses:
   *       201:
   *         description: País creado
   */
  async store({ request, response }) {
    const data = request.only(['nombre', 'codigo'])
    const pais = await Pais.create(data)
    return response.status(201).json(pais)
  }

  /**
   * @swagger
   * /api/v1/paises/{id}:
   *   get:
   *     summary: Obtener un país por ID
   *     tags: [Paises]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del país
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: Datos del país
   */
  async show({ params, response }) {
    const pais = await Pais.find(params.id)
    return response.json(pais)
  }

  /**
   * @swagger
   * /api/v1/paises/{id}:
   *   put:
   *     summary: Actualizar un país
   *     tags: [Paises]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del país
   *         required: true
   *         type: integer
   *       - name: nombre
   *         in: query
   *         description: Nombre del país
   *         required: false
   *         type: string
   *       - name: codigo
   *         in: query
   *         description: Código del país
   *         required: false
   *         type: string
   *     responses:
   *       200:
   *         description: País actualizado
   */
  async update({ params, request, response }) {
    const pais = await Pais.find(params.id)
    const data = request.only(['nombre', 'codigo'])
    pais.merge(data)
    await pais.save()
    return response.json(pais)
  }

  /**
   * @swagger
   * /api/v1/paises/{id}:
   *   delete:
   *     summary: Eliminar un país
   *     tags: [Paises]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del país a eliminar
   *         required: true
   *         type: integer
   *     responses:
   *       204:
   *         description: País eliminado correctamente
   */
  async destroy({ params, response }) {
    const pais = await Pais.find(params.id)
    await pais.delete()
    return response.status(204).json(null)
  }
}

module.exports = PaisController
