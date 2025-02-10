'use strict';

const User = use('App/Models/User');

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: API para la autenticación de usuarios
 */
class AuthController {
  /**
   * @swagger
   * /api/v1/login:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Inicio de sesión
   *     description: Autenticación de usuario
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: user
   *         description: Credenciales del usuario
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             user:
   *               type: object
   *               properties:
   *                 email:
   *                   type: string
   *                 password:
   *                   type: string
   *               required:
   *                 - email
   *                 - password
   *     responses:
   *       200:
   *         description: Inicio de sesión exitoso
   *       401:
   *         description: No autorizado
   */
  async login({ request, response, auth }) {
    const { user } = request.all();
    const logged = await auth.attempt(user.email, user.password, true);
    return response.json(logged);
  }

  /**
   * @swagger
   * /api/v1/register:
   *   post:
   *     tags:
   *       - Auth
   *     summary: Registro de usuario
   *     description: Registro de un nuevo usuario
   *     consumes:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: user
   *         description: Información del usuario
   *         required: true
   *         schema:
   *           type: object
   *           properties:
   *             user:
   *               type: object
   *               properties:
   *                 email:
   *                   type: string
   *                 password:
   *                   type: string
   *               required:
   *                 - email
   *                 - password
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente
   *       400:
   *         description: Solicitud incorrecta
   */
  async register({ request, response, auth }) {
    const userInstance = new User();
    const { user } = request.all();

    userInstance.username = user.email;
    userInstance.email = user.email;
    userInstance.password = user.password;

    await userInstance.save();

    let token = await auth.generate(userInstance);
    Object.assign(userInstance, token);

    return response.json(userInstance);
  }
}

module.exports = AuthController;
