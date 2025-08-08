'use strict'

const ExcelJS = require('exceljs')
const Database = use('Database')
const Helpers = use('Helpers')
const Inventario = use('App/Models/Inventario')
const AreaFuncional = use('App/Models/Area')
const Sistema = use('App/Models/Sistema')
const Pais = use('App/Models/Paises')

class InventarioController {
  /**
  * @swagger
  * /api/v1/inventarios:
  *   get:
  *     summary: Obtener la lista de inventarios
  *     tags: [Inventario]
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
  *         description: Lista de inventarios paginada
  */
  async index({ request, response }) {
    try {
      const page = request.input('page', 1)
      const limit = request.input('limit', 10)
      const sortBy = request.input('sortBy', 'id')
      const order = request.input('order', 'asc')
      const search = request.input('search', '')

      const query = Inventario.query()
        .with('pais')           // Cargar relación con País
        .with('sistema')        // Cargar relación con Sistema
        .with('areaFuncional')  // Cargar relación con Área Funcional
        .with('usuario')        // Cargar relación con Usuario

      if (search) {
        query.where('codigo', 'LIKE', `%${search}%`)
          .orWhere('descripcion', 'LIKE', `%${search}%`)
      }

      query.orderBy(sortBy, order)

      const inventarios = await query.paginate(page, limit)

      return response.status(200).json(inventarios)
    } catch (error) {
      return response.status(500).send(`Error al obtener inventarios: ${error.message}`)
    }
  }

  /**
 * @swagger
 * /api/v1/inventarios:
 *   post:
 *     summary: Crear un inventario
 *     tags: [Inventario]
 *     parameters:
 *       - name: codigo
 *         in: query
 *         description: Código del inventario
 *         required: true
 *         type: string
 *       - name: descripcion
 *         in: query
 *         description: Descripción del inventario
 *         required: true
 *         type: string
 *       - name: datos
 *         in: query
 *         description: Datos del inventario
 *         required: false
 *         type: string
 *       - name: area_funcional_id
 *         in: query
 *         description: ID del área funcional asociada
 *         required: true
 *         type: integer
 *       - name: sistema_id
 *         in: query
 *         description: ID del sistema asociado
 *         required: true
 *         type: integer
 *       - name: en_desarrollo
 *         in: query
 *         description: Estado de desarrollo
 *         required: false
 *         type: boolean
 *       - name: capa
 *         in: query
 *         description: Capa del inventario
 *         required: false
 *         type: string
 *       - name: usuario
 *         in: query
 *         description: Usuario asociado al inventario
 *         required: false
 *         type: string
 *       - name: documento_detalle
 *         in: query
 *         description: Detalles del documento
 *         required: false
 *         type: string
 *       - name: pais_id
 *         in: query
 *         description: ID del país asociado
 *         required: false
 *         type: integer
 *     responses:
 *       201:
 *         description: Inventario creado
 */
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

  /**
   * @swagger
   * /api/v1/inventarios/{id}:
   *   get:
   *     summary: Obtener un inventario por ID
   *     tags: [Inventario]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del inventario
   *         required: true
   *         type: integer
   *     responses:
   *       200:
   *         description: Datos del inventario
   */
  async show({ params, response }) {
    try {
      const inventario = await Inventario.findOrFail(params.id)
      return response.status(200).json(inventario)
    } catch (error) {
      return response.status(404).send('Inventario no encontrado')
    }
  }

  /**
   * @swagger
   * /api/v1/inventarios/{id}:
   *   put:
   *     summary: Actualizar un inventario
   *     tags: [Inventario]
   *     parameters:
   *       - name: id
   *         in: path
   *         description: ID del inventario
   *         required: true
   *         type: integer
   *       - name: codigo
   *         in: query
   *         description: Código del inventario
   *         required: false
   *         type: string
   *       - name: descripcion
   *         in: query
   *         description: Descripción del inventario
   *         required: false
   *         type: string
   *       - name: datos
   *         in: query
   *         description: Datos del inventario
   *         required: false
   *         type: string
   *       - name: area_funcional_id
   *         in: query
   *         description: ID del área funcional asociada
   *         required: false
   *         type: integer
   *       - name: sistema_id
   *         in: query
   *         description: ID del sistema asociado
   *         required: false
   *         type: integer
   *       - name: en_desarrollo
   *         in: query
   *         description: Estado de desarrollo
   *         required: false
   *         type: boolean
   *       - name: capa
   *         in: query
   *         description: Capa del inventario
   *         required: false
   *         type: string
   *       - name: usuario
   *         in: query
   *         description: Usuario asociado al inventario
   *         required: false
   *         type: string
   *       - name: documento_detalle
   *         in: query
   *         description: Detalles del documento
   *         required: false
   *         type: string
   *       - name: pais_id
   *         in: query
   *         description: ID del país asociado
   *         required: false
   *         type: integer
   *     responses:
   *       200:
   *         description: Inventario actualizado
   */
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

  /**
  * @swagger
  * /api/v1/inventarios/{id}:
  *   delete:
  *     summary: Eliminar un inventario
  *     tags: [Inventario]
  *     parameters:
  *       - name: id
  *         in: path
  *         description: ID del inventario a eliminar
  *         required: true
  *         type: integer
  *     responses:
  *       204:
  *         description: Inventario eliminado correctamente
  */
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
      const Helpers = use('Helpers')
      const Database = use('Database')
      const ExcelJS = require('exceljs') // idem

      // Helpers de parseo
      const toStr = (v) => {
        if (v == null) return ''
        if (typeof v === 'object') {
          if (v.text) return String(v.text).trim()
          if (v.result != null) return String(v.result).trim()
          // ExcelJS a veces entrega objetos Date/números envueltos
          return String(v).trim()
        }
        return String(v).trim()
      }
      // Convierte valores a boolean. Por defecto, vacío -> false (evita error de PG)
      const toBool = (v, def = false) => {
        const s = toStr(v).toLowerCase()
        if (s === '' || s === 'n/a' || s === '-') return def
        if (['s', 'si', 'sí', 'y', 'yes', 'true', '1', 'x', '✓'].includes(s)) return true
        if (['n', 'no', 'false', '0'].includes(s)) return false
        return def
      }

      // Cache para reducir consultas repetidas
      const cacheArea = new Map()
      const cacheSistema = new Map()
      const cachePais = new Map()

      const findAreaId = async (nombre) => {
        const key = toStr(nombre).toLowerCase()
        if (!key) return null
        if (cacheArea.has(key)) return cacheArea.get(key)
        const row = await AreaFuncional.query().whereRaw('LOWER(nombre) = ?', [key]).first()
        const id = row ? row.id : null
        cacheArea.set(key, id)
        return id
      }
      const findSistemaId = async (nombre) => {
        const key = toStr(nombre).toLowerCase()
        if (!key) return null
        if (cacheSistema.has(key)) return cacheSistema.get(key)
        const row = await Sistema.query().whereRaw('LOWER(sistema) = ?', [key]).first()
        const id = row ? row.id : null
        cacheSistema.set(key, id)
        return id
      }
      const findPaisId = async (nombre) => {
        const key = toStr(nombre).toLowerCase()
        if (!key) return null
        if (cachePais.has(key)) return cachePais.get(key)
        const row = await Pais.query().whereRaw('LOWER(nombre) = ?', [key]).first()
        const id = row ? row.id : null
        cachePais.set(key, id)
        return id
      }

      const filePath = Helpers.publicPath('uploads/PRD_99000_GL_V3R1_ Inventario BBDD.4-1.xlsm')
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.readFile(filePath)
      const worksheet = workbook.getWorksheet('Inventario') || workbook.worksheets[0]

      let ok = 0
      let fail = 0

      // Recorre respetando await
      for (let rowNumber = 5; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber)
        if (!row || !row.hasValues) continue

        try {
          // Lee columnas (ajusta índices si cambian)
          const codigo = toStr(row.getCell(2).value) || 'Desconocida'
          const descripcion = toStr(row.getCell(3).value) || 'Desconocida'
          const datos = toStr(row.getCell(4).value) || 'Desconocido'
          const areaFuncionalNombre = toStr(row.getCell(5).value)
          const sistemaNombre = toStr(row.getCell(6).value)
          const enDesarrollo = toBool(row.getCell(7).value)         // BOOL
          const capa = toStr(row.getCell(8).value) || 'Desconocido'
          const usuario = toStr(row.getCell(11).value) || 'default_user'
          const documentoDetalle = toStr(row.getCell(12).value) || 'N/A'
          const dependeDeLaPlaza = toBool(row.getCell(13).value)        // BOOL
          const comentarios = toStr(row.getCell(14).value)
          const dependeDelEntorno = toBool(row.getCell(15).value)        // BOOL
          const ambienteTesting = toBool(row.getCell(16).value)        // BOOL (ajusta si tu columna NO es boolean)
          const paisNombre = toStr(row.getCell(17).value)
          const borrar = toBool(row.getCell(18).value)        // BOOL

          const area_funcional_id = await findAreaId(areaFuncionalNombre)
          const sistema_id = await findSistemaId(sistemaNombre)
          const pais_id = await findPaisId(paisNombre)

          await Database.table('inventarios').insert({
            codigo,
            descripcion,
            datos,
            area_funcional_id,
            sistema_id,
            en_desarrollo: enDesarrollo,
            capa,
            usuario,
            documento_detalle: documentoDetalle,
            depende_de_la_plaza: dependeDeLaPlaza,
            comentarios,
            depende_del_entorno: dependeDelEntorno,
            ambiente_testing: ambienteTesting,
            pais_id,
            borrar,
            created_at: new Date(),
            updated_at: new Date()
          })

          ok++
          // console.log(`Registro ${rowNumber} importado exitosamente.`)
        } catch (rowError) {
          fail++
          console.error(`Error en la fila ${rowNumber}: ${rowError.message}`)
        }
      }

      return response.status(200).send(`Importación finalizada. OK: ${ok}, Fallos: ${fail}.`)
    } catch (error) {
      console.error(`Error al importar datos: ${error.message}`)
      return response.status(500).send(`Error al importar datos: ${error.message}`)
    }
  }


  async generadorRpt({ request, response }) {
    try {
      const rawQuery = request.input('query')
      if (!rawQuery || !rawQuery.trim()) {
        return response.status(400).json({ error: 'Falta query' })
      }

      const raw = await Database.raw(rawQuery)

      // Normaliza resultado: PG => raw.rows ; MySQL => array
      const resultados = Array.isArray(raw)
        ? (Array.isArray(raw[0]) ? raw[0] : raw)
        : (raw && raw.rows) ? raw.rows : []

      if (!resultados.length) {
        return response.status(400).json({ error: 'No hay datos para mostrar.' })
      }

      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('Reporte')

      // Columnas
      const headers = Object.keys(resultados[0] || {})
      if (!headers.length) {
        return response.status(400).json({ error: 'La consulta no devolvió columnas.' })
      }
      sheet.columns = headers.map(col => ({
        header: col.toUpperCase(),
        key: col,
        width: 20
      }))

      // Estilos header
      headers.forEach((col, i) => {
        const cell = sheet.getCell(`${String.fromCharCode(65 + i)}1`)
        cell.font = { bold: true, color: { argb: 'FF000000' } }
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEEEEEE' } }
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
        cell.border = {
          top: { style: 'thin' }, left: { style: 'thin' },
          bottom: { style: 'thin' }, right: { style: 'thin' }
        }
      })

      // Filas
      resultados.forEach(row => sheet.addRow(row))

      // Enviar como BUFFER (robusto)
      const buf = await workbook.xlsx.writeBuffer()
      response.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      response.header('Content-Disposition', 'attachment; filename="reporte.xlsx"')
      response.header('Cache-Control', 'no-cache')
      response.header('Content-Length', Buffer.byteLength(buf))
      return response.send(buf)

    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }


  async descargarReporteIA({ request, response }) {
    try {
      const { sqlFromNl } = use('App/Services/PromptSql')
      const { format } = require('sql-formatter')

      const nl = request.input('nl')
      let sql = request.input('query') // si te mandan SQL directo, úsalo

      if (!sql) {
        if (!nl) return response.status(400).json({ error: 'Falta nl o query' })
          ; ({ sql } = await sqlFromNl(nl))
      }

      // Opcional: asegura LIMIT si no viene
      if (/^\s*select/i.test(sql) && !/limit\s+\d+/i.test(sql)) {
        sql = `${sql} LIMIT 50000`
      }

      // Formato: pretty (default) | one-line | json | text
      const fmt = String(request.input('format') || 'pretty').toLowerCase()

      if (fmt === 'one-line') {
        const single = sql.replace(/\s+/g, ' ').trim()
        return response.header('Content-Type', 'text/plain; charset=utf-8').send(single + '\n')
      }

      if (fmt === 'json') {
        return response.json({ sql }) // ojo: aquí verás \n escapados, es normal en JSON
      }

      // pretty/text -> formateado multilínea, sin escapes
      const pretty = format(sql, { language: 'postgresql', uppercase: true })
      return response.header('Content-Type', 'text/plain; charset=utf-8').send(pretty + '\n')

    } catch (err) {
      return response.status(500).json({ error: err.message })
    }
  }

}

module.exports = InventarioController