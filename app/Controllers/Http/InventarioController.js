'use strict'

const ExcelJS = require('exceljs')
const Database = use('Database')
const Helpers = use('Helpers')
const Inventario = use('App/Models/Inventario')
const AreaFuncional = use('App/Models/Area')
const Sistema = use('App/Models/Sistema')
const Pais = use('App/Models/Paises')

class InventarioController {
  async index({ request, response }) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const sortBy = request.input('sortBy', 'id')
      const order = request.input('order', 'asc')
      const search = request.input('search', '')

      const query = Inventario.query()

      if (search) {
        query.where('codigo', 'LIKE', `%${search}%`)
          .orWhere('descripcion', 'LIKE', `%${search}%`)
          .orWhereHas('areaFuncional', (builder) => {
            builder.where('nombre', 'LIKE', `%${search}%`)
          })
          .orWhereHas('sistema', (builder) => {
            builder.where('sistema', 'LIKE', `%${search}%`)
          })
      }

      query.orderBy(sortBy, order)

      const inventarios = await query.paginate(page, limit)

      return response.status(200).json(inventarios)
    } catch (error) {
      return response.status(500).send(`Error al obtener inventarios: ${error.message}`)
    }
  }

  async store({ request, response }) {
    try {
      const data = request.only([
        'codigo',
        'descripcion',
        'datos',
        'area_funcional_id',
        'sistema_id',
        'en_desarrollo',
        'capa',
        'usuario',
        'documento_detalle',
        'depende_de_la_plaza',
        'comentarios',
        'depende_del_entorno',
        'ambiente_testing',
        'pais_id',
        'borrar'
      ])

      // Validar la existencia de las relaciones
      await AreaFuncional.findOrFail(data.area_funcional_id)
      await Sistema.findOrFail(data.sistema_id)
      if (data.pais_id) {
        await Pais.findOrFail(data.pais_id)
      }

      const inventario = await Inventario.create(data)
      return response.status(201).json(inventario)
    } catch (error) {
      return response.status(500).send(`Error al crear inventario: ${error.message}`)
    }
  }

  async show({ params, response }) {
    try {
      const inventario = await Inventario.findOrFail(params.id)
      return response.status(200).json(inventario)
    } catch (error) {
      return response.status(404).send('Inventario no encontrado')
    }
  }

  async update({ params, request, response }) {
    try {
      const data = request.only([
        'codigo',
        'descripcion',
        'datos',
        'area_funcional_id',
        'sistema_id',
        'en_desarrollo',
        'capa',
        'usuario',
        'documento_detalle',
        'depende_de_la_plaza',
        'comentarios',
        'depende_del_entorno',
        'ambiente_testing',
        'pais_id',
        'borrar'
      ])

      // Validar la existencia de las relaciones
      await AreaFuncional.findOrFail(data.area_funcional_id)
      await Sistema.findOrFail(data.sistema_id)
      if (data.pais_id) {
        await Pais.findOrFail(data.pais_id)
      }

      const inventario = await Inventario.findOrFail(params.id)
      inventario.merge(data)
      await inventario.save()

      return response.status(200).json(inventario)
    } catch (error) {
      return response.status(500).send(`Error al actualizar inventario: ${error.message}`)
    }
  }

  async destroy({ params, response }) {
    try {
      const inventario = await Inventario.findOrFail(params.id)
      await inventario.delete()

      return response.status(200).send('Inventario eliminado exitosamente')
    } catch (error) {
      return response.status(500).send(`Error al eliminar inventario: ${error.message}`)
    }
  }

  async import({ request, response }) {
    try {
      const filePath = Helpers.publicPath('uploads/PRD_99000_GL_V3R1_ Inventario BBDD.41.xlsm')
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.readFile(filePath)
      const worksheet = workbook.getWorksheet('Inventario')

      worksheet.eachRow(async (row, rowNumber) => {
        if (rowNumber >= 5) {
          try {
            const codigo = row.getCell(2).value || 'Desconocida'
            const descripcion = row.getCell(3).value || 'Desconocida'
            const datos = row.getCell(4).value || 'Desconocido'
            const areaFuncionalNombre = row.getCell(5).value || 'Desconocido'
            const sistemaNombre = row.getCell(6).value || 'Desconocido'
            const enDesarrollo = row.getCell(7).value === 'SI'
            const capa = row.getCell(8).value || 'Desconocido'
            const usuario = row.getCell(11).value || 'default_user'
            const documentoDetalle = row.getCell(12).value || 'N/A'
            const dependeDeLaPlaza = row.getCell(13).value === 'SI'
            const comentarios = row.getCell(14).value || ''
            const dependeDelEntorno = row.getCell(15).value === 'SI'
            const ambienteTesting = row.getCell(16).value || 'N/A'
            const paisNombre = row.getCell(17).value || null
            const borrar = row.getCell(18).value === 'SI'

            // Intentar buscar las relaciones, pero si no se encuentran, continuar
            const areaFuncional = areaFuncionalNombre ? await AreaFuncional.findBy('nombre', areaFuncionalNombre) : null
            const sistema = sistemaNombre ? await Sistema.findBy('sistema', sistemaNombre): null
            const pais = paisNombre ? await Pais.findBy('nombre', paisNombre) : null

            // Insertar cada registro individualmente
            await Database.table('inventarios').insert({
              codigo,
              descripcion,
              datos,
              area_funcional_id: areaFuncional ? areaFuncional.id : null,
              sistema_id: sistema ? sistema.id : null,
              en_desarrollo: enDesarrollo,
              capa,
              usuario,
              documento_detalle: documentoDetalle,
              depende_de_la_plaza: dependeDeLaPlaza,
              comentarios,
              depende_del_entorno: dependeDelEntorno,
              ambiente_testing: ambienteTesting,
              pais_id: pais ? pais.id : null,
              borrar,
              created_at: new Date(),
              updated_at: new Date()
            })

            console.log(`Registro ${rowNumber} importado exitosamente.`)
          } catch (rowError) {
            console.error(`Error en la fila ${rowNumber}: ${rowError.message}`)
          }
        }
      })

      return response.status(200).send('Intento de importación completado. Revisa la consola para detalles de errores.')
    } catch (error) {
      console.error(`Error al importar datos: ${error.message}`)
      return response.status(500).send(`Error al importar datos: ${error.message}`)
    }
  }
}

module.exports = InventarioController
