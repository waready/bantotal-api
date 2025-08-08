'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

Route.group(() => {
  Route.post('login', 'AuthController.login');
  Route.post('register', 'AuthController.register');
  //Route.put('profile', 'AuthController.profile').middleware(['auth:jwt']);

  Route.get('import', 'InventarioController.import');
  // Rutas para el CRUD de inventarios
  Route.get('inventarios', 'InventarioController.index');

  Route.post('inventarios', 'InventarioController.store');
  Route.get('inventarios/:id', 'InventarioController.show');
  Route.put('inventarios/:id', 'InventarioController.update');
  Route.delete('inventarios/:id', 'InventarioController.destroy');

  // Routes for Sistemas
  Route.resource('sistemas', 'SistemaController').apiOnly()

  // Routes for Areas Funcionales
  Route.resource('areas', 'AreaController').apiOnly();

  // Routes for Paises
  Route.resource('paises', 'PaisController').apiOnly();

  // Generador de Reportes
  Route.post('/generar-reporte', 'InventarioController.generadorRpt');

  // Roles
  Route.get('roles', 'RoleController.index');
  Route.post('roles', 'RoleController.store');
  Route.get('roles/:id', 'RoleController.show');
  Route.put('roles/:id', 'RoleController.update');
  Route.delete('roles/:id', 'RoleController.destroy');

  // Usuarios
  Route.get('users', 'UserController.index');
  Route.post('users', 'UserController.store');
  Route.put('users/:id', 'UserController.update');
  Route.delete('users/:id', 'UserController.destroy');

  // Permisos
  Route.get('permissions', 'PermissionController.index');
  Route.post('permissions', 'PermissionController.store');
  Route.get('permissions/:id', 'PermissionController.show');  
  Route.put('permissions/:id', 'PermissionController.update');
  Route.delete('permissions/:id', 'PermissionController.destroy');

  //asistente LDAP
  Route.post('reports/nl', 'InventarioController.descargarReporteIA')

}).prefix('api/v1');

Route.get('/swagger.json', async ({ swagger }) => swagger.json());
Route.get('/docs', async ({ swagger }) => swagger.ui('swagger.json'));
// schema
Route.group(() => {
  Route.post('schema/add-column', 'SchemaController.addColumn')
  Route.post('schema/rename-column', 'SchemaController.renameColumn')
}).prefix('admin').middleware(['auth', 'is:admin'])