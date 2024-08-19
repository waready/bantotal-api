'use strict'

/*
|--------------------------------------------------------------------------
| DatabaseSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Database = use('Database');

const User = use('App/Models/User');
const Hash = use('Hash');


class DatabaseSeeder {
  async run () {

    await Database.table('paises').insert([
      { nombre: 'Argentina', codigo: 'AR' },
      { nombre: 'Bolivia', codigo: 'BO' },
      { nombre: 'Chile', codigo: 'CH' },
      { nombre: 'Colombia', codigo: 'CO' },
      { nombre: 'El Salvador', codigo: 'ES' },
      { nombre: 'Global', codigo: 'GL' },
      { nombre: 'México', codigo: 'MX' },
      { nombre: 'Panamá', codigo: 'PA' },
      { nombre: 'Paraguay', codigo: 'PY' },
      { nombre: 'Perú', codigo: 'PE' },
      { nombre: 'Uruguay', codigo: 'UY' },
      { nombre: 'Honduras', codigo: 'HO' }
    ]);

    await Database.table('areas').insert([
      { nombre: 'Núcleo', codigo: '10100' },
      { nombre: 'Colocaciones', codigo: '10200' },
      { nombre: 'Captaciones', codigo: '10300' },
      { nombre: 'Servicios', codigo: '10400' },
      { nombre: 'Mercados Financieros', codigo: '10500' },
      { nombre: 'Comercio Internacional', codigo: '10600' },
      { nombre: 'Canales', codigo: '10700' },
      { nombre: 'Módulo normativo', codigo: '10800' },
      { nombre: 'BTDevelopers', codigo: '10900' },
      { nombre: 'Genérico', codigo: '99000' }
    ]);


    await Database.table('sistemas').insert([
      { sistema: 'Configuración Bantotal', cod_area_funcional: 10100, corr: 1, cod_sistema: 10101 },
      { sistema: 'Utilitarios Bantotal', cod_area_funcional: 10100, corr: 2, cod_sistema: 10102 },
      { sistema: 'Sistema de Integracion con Workflow', cod_area_funcional: 10100, corr: 3, cod_sistema: 10103 },
      { sistema: 'Sistema de Carpeta digital', cod_area_funcional: 10100, corr: 4, cod_sistema: 10104 },
      { sistema: 'Bantotal Impresor |Sistema de Definición y resolución de impresos', cod_area_funcional: 10100, corr: 5, cod_sistema: 10105 },
      { sistema: 'Sistema de Impuestos', cod_area_funcional: 10100, corr: 6, cod_sistema: 10106 },
      { sistema: 'Sistema de Auditoría', cod_area_funcional: 10100, corr: 7, cod_sistema: 10107 },
      { sistema: 'Sistema de Seguridad', cod_area_funcional: 10100, corr: 8, cod_sistema: 10108 },
      { sistema: 'Sistema de Contrapartes', cod_area_funcional: 10100, corr: 9, cod_sistema: 10109 },
      { sistema: 'Sistema de Contabilidad', cod_area_funcional: 10100, corr: 10, cod_sistema: 10110 },
      { sistema: 'Sistema de Conciliaciones', cod_area_funcional: 10100, corr: 11, cod_sistema: 10111 },
      { sistema: 'Sistema Motor de Reglas de Negocio', cod_area_funcional: 10100, corr: 12, cod_sistema: 10112 },
      { sistema: 'Sistema de Definición y ejecución de transacciones', cod_area_funcional: 10100, corr: 13, cod_sistema: 10113 },
      { sistema: 'Sistema de Administración del riesgo de crédito', cod_area_funcional: 10100, corr: 14, cod_sistema: 10114 },
      { sistema: 'Sistema de Administración de Precios', cod_area_funcional: 10100, corr: 15, cod_sistema: 10115 },
      { sistema: 'Sistema de Mensajería', cod_area_funcional: 10100, corr: 16, cod_sistema: 10116 },
      { sistema: 'Sistema de Alertas de Lavado de Dinero', cod_area_funcional: 10100, corr: 17, cod_sistema: 10117 },
      { sistema: 'Sistema de Control documentario', cod_area_funcional: 10100, corr: 18, cod_sistema: 10118 },
      { sistema: 'Sistema de Resolución de Datos', cod_area_funcional: 10100, corr: 19, cod_sistema: 10119 },
      { sistema: 'Sistema de Facultades y Poderes', cod_area_funcional: 10100, corr: 20, cod_sistema: 10120 },
      { sistema: 'Sistema de Evaluacion Automática', cod_area_funcional: 10100, corr: 21, cod_sistema: 10121 },
      { sistema: 'Sistema de Reclamos *En proceso Bantotal', cod_area_funcional: 10100, corr: 22, cod_sistema: 10122 },
      { sistema: 'Sistema de Préstamos', cod_area_funcional: 10200, corr: 1, cod_sistema: 10201 },
      { sistema: 'Sistema de Descuentos', cod_area_funcional: 10200, corr: 2, cod_sistema: 10202 },
      { sistema: 'Sistema de Garantías otorgadas', cod_area_funcional: 10200, corr: 3, cod_sistema: 10203 },
      { sistema: 'Sistema de Garantías recibidas', cod_area_funcional: 10200, corr: 4, cod_sistema: 10204 },
      { sistema: 'Sistema de Límites de crédito', cod_area_funcional: 10200, corr: 5, cod_sistema: 10205 },
      { sistema: 'Sistema de Préstamos Hipotecario', cod_area_funcional: 10200, corr: 6, cod_sistema: 10206 },
      { sistema: 'Bantotal Microfinanzas', cod_area_funcional: 10200, corr: 7, cod_sistema: 10207 },
      { sistema: 'Sistema de Préstamos por Convenios', cod_area_funcional: 10200, corr: 8, cod_sistema: 10208 },
      { sistema: 'Sistema de Microseguros', cod_area_funcional: 10200, corr: 9, cod_sistema: 10209 },
      { sistema: 'Sistema de Gestión de Cobranza', cod_area_funcional: 10200, corr: 10, cod_sistema: 10210 },
      { sistema: 'Sistema de Préstamos Consumo', cod_area_funcional: 10200, corr: 11, cod_sistema: 10211 },
      { sistema: 'Fondos de Inversión', cod_area_funcional: 10200, corr: 12, cod_sistema: 10212 },
      { sistema: 'Sistema de Préstamos Vehiculares', cod_area_funcional: 10200, corr: 13, cod_sistema: 10213 },
      { sistema: 'Sistema de Cajas', cod_area_funcional: 10300, corr: 1, cod_sistema: 10301 },
      { sistema: 'Sistema de Cuentas de Ahorro', cod_area_funcional: 10300, corr: 2, cod_sistema: 10302 },
      { sistema: 'Sistema de Cuentas Corrientes', cod_area_funcional: 10300, corr: 3, cod_sistema: 10303 },
      { sistema: 'Sistema de Depósitos a plazo', cod_area_funcional: 10300, corr: 4, cod_sistema: 10304 },
      { sistema: 'Sistema de Tarjetas de débito', cod_area_funcional: 10300, corr: 5, cod_sistema: 10305 },
      { sistema: 'Sistema de Cofres de Seguridad', cod_area_funcional: 10300, corr: 6, cod_sistema: 10306 },
      { sistema: 'Sistema de Cash Management', cod_area_funcional: 10300, corr: 7, cod_sistema: 10307 },
      { sistema: 'Sistema de Cámara de compensación de Cheques', cod_area_funcional: 10300, corr: 8, cod_sistema: 10308 },
      { sistema: 'Sistema de Cuenta Corriente y Caja de Ahorro', cod_area_funcional: 10300, corr: 9, cod_sistema: 10309 },
      { sistema: 'Sistema de Tesorería', cod_area_funcional: 10300, corr: 10, cod_sistema: 10310 },
      { sistema: 'Sistema Nacional de Pagos', cod_area_funcional: 10300, corr: 11, cod_sistema: 10311 },
      { sistema: 'Bantotal Servicios', cod_area_funcional: 10400, corr: 1, cod_sistema: 10401 },
      { sistema: 'Mercados | Títulos y Valores', cod_area_funcional: 10500, corr: 1, cod_sistema: 10501 },
      { sistema: 'Mercados | Cambios Mayoristas', cod_area_funcional: 10500, corr: 2, cod_sistema: 10502 },
      { sistema: 'Mercados | Dinero', cod_area_funcional: 10500, corr: 3, cod_sistema: 10503 },
      { sistema: 'Mercados | Cambios Minoristas', cod_area_funcional: 10500, corr: 4, cod_sistema: 10504 },
      { sistema: 'Mercados | Títulos Posición Propia', cod_area_funcional: 10500, corr: 5, cod_sistema: 10505 },
      { sistema: 'Comercio exterior - Cartas de crédito y Cobranzas', cod_area_funcional: 10600, corr: 1, cod_sistema: 10601 },
      { sistema: 'Transferencias y Órdenes de pago', cod_area_funcional: 10600, corr: 2, cod_sistema: 10602 },
      { sistema: 'Cheques del exterior', cod_area_funcional: 10600, corr: 3, cod_sistema: 10603 },
      { sistema: 'Valores al cobro', cod_area_funcional: 10600, corr: 4, cod_sistema: 10604 },
      { sistema: 'Operaciones de cambio del exterior', cod_area_funcional: 10600, corr: 5, cod_sistema: 10605 },
      { sistema: 'Servicios bancarios internacionales', cod_area_funcional: 10600, corr: 6, cod_sistema: 10606 },
      { sistema: 'Factoring', cod_area_funcional: 10700, corr: 1, cod_sistema: 10701 },
      { sistema: 'Fondos de Inversión', cod_area_funcional: 10800, corr: 1, cod_sistema: 10801 },
      { sistema: 'Fideicomisos', cod_area_funcional: 10800, corr: 2, cod_sistema: 10802 }
    ]);
  }
}

module.exports = DatabaseSeeder
