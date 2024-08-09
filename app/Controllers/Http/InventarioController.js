'use strict'

const ExcelJS = require('exceljs')
const Database = use('Database')
const Helpers = use('Helpers')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with inventarios
 */
class InventarioController {
  /**
   * Show a list of all inventarios.
   * GET inventarios
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
  }

  /**
   * Render a form to be used for creating a new inventario.
   * GET inventarios/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create ({ request, response, view }) {
  }

  /**
   * Create/save a new inventario.
   * POST inventarios
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  }

  /**
   * Display a single inventario.
   * GET inventarios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Render a form to update an existing inventario.
   * GET inventarios/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit ({ params, request, response, view }) {
  }

  /**
   * Update inventario details.
   * PUT or PATCH inventarios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a inventario with id.
   * DELETE inventarios/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  async import({ request, response }) {
    try {
      // Ruta del archivo Excel
      const filePath = Helpers.publicPath('uploads/PRD_99000_GL_V3R1_ Inventario BBDD.41.xlsm')

      // Leer el archivo Excel
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.readFile(filePath)

      // Obtener la primera hoja de trabajo (Inventario)
      const worksheet = workbook.getWorksheet('Inventario')

      // Recorrer cada fila en la hoja de trabajo (a partir de la fila 5 para saltar los encabezados)
      worksheet.eachRow(async (row, rowNumber) => {
        if (rowNumber >= 5) { // Ajusta el número de fila según tu estructura
          // Obtener los valores de las celdas (ajustar los índices según tus columnas)
          const codigo = row.getCell(2).value || 'Desconocida' 
          const descripcion = row.getCell(3).value || 'Desconocida' 
          const datos = row.getCell(4).value || 'Desconocido'
          const areaFuncional = row.getCell(5).value || 'Desconocido';
          const sistema = row.getCell(6).value || 'Desconocido';
          const enDesarrollo = row.getCell(7).value === 'SI' // Asumiendo que se usa 'SI' para true
          const capa = row.getCell(8).value || 'Desconocido'
          const usuario = row.getCell(11).value || 'default_user' // Ajusta según tus datos
          const documentoDetalle = row.getCell(12).value || 'N/A' // Ajusta según tus datos
          const dependeDeLaPlaza = row.getCell(13).value === 'SI' // Asumiendo que se usa 'SI' para true
          
          const comentarios = row.getCell(14).value || ''
          const dependeDelEntorno = row.getCell(15).value === 'SI' // Asumiendo que se usa 'SI' para true
          const ambienteTesting = row.getCell(16).value || 'N/A' // Ajusta según tus datos
          const pais = row.getCell(17).value || 'N/A' // Ajusta según tus datos
          const borrar = row.getCell(18).value === 'SI' // Asumiendo que se usa 'SI' para true

          // Insertar en la base de datos
          await Database.table('inventarios').insert({
            codigo: codigo,
            descripcion: descripcion,
            datos: datos,
            area_funcional: areaFuncional,
            sistema: sistema,
            en_desarrollo: enDesarrollo,
            capa: capa,
            usuario: usuario,
            documento_detalle: documentoDetalle,
            depende_de_la_plaza: dependeDeLaPlaza,
            comentarios: comentarios,
            depende_del_entorno: dependeDelEntorno,
            ambiente_testing: ambienteTesting,
            pais: pais,
            borrar: borrar,
            created_at: new Date(),
            updated_at: new Date()
          })
        }
      })

      return response.status(200).send('Datos importados exitosamente')
    } catch (error) {
      console.error(error)
      return response.status(500).send(`Error al importar datos: ${error.message}`)
    }
  }

}

module.exports = InventarioController
