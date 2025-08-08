'use strict';

const axios = require('axios');
const https = require('https');
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

const User = use('App/Models/User');
const Hash = use('Hash')
const Role = use('Role')
const Permission = use('Permission')

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
    const Hash = use('Hash')
    const Config = use('Config')
    const User = use('App/Models/User')
    const Role = use('Adonis/Acl/Role') // si usas roles
    // asumo que ya tienes axiosInstance configurado

    const { user } = request.all() // { email, password }
    if (!user || !user.email || !user.password) {
      return response.status(400).json({ error: 'Email y password son requeridos' })
    }

    const emailLower = String(user.email).toLowerCase()
    const loginId = (emailLower.includes('@') ? emailLower.split('@')[0] : emailLower)

    // Buscar por email/username en minúsculas (PG es case-sensitive)
    let userInstance = await User.query()
      .whereRaw('LOWER(email) = ?', [emailLower])
      .orWhereRaw('LOWER(username) = ?', [loginId])
      .orWhereRaw('LOWER(login_ldap) = ?', [loginId])
      .first()

    // ---- intento local ----
    if (userInstance) {
      const stored = userInstance.password || ''
      const currentDriver = Config.get('hash.driver')
      const hashType = stored.startsWith('$argon2') ? 'argon'
        : (stored.startsWith('$2a$') || stored.startsWith('$2b$') || stored.startsWith('$2y$')) ? 'bcrypt'
          : 'unknown'

      let ok = false
      try { ok = await Hash.verify(user.password, stored) } catch (_) { }

      // fallback si el hash guardado es de otro driver
      if (!ok && hashType !== 'unknown' && hashType !== currentDriver) {
        try {
          Config.set('hash.driver', hashType)
          ok = await Hash.verify(user.password, stored)
        } catch (_) {
          ok = false
        } finally {
          Config.set('hash.driver', currentDriver)
        }
        // si validó con el fallback, re-hashear al driver actual (usa el hook beforeSave)
        if (ok) {
          userInstance.password = user.password // texto plano; el hook lo hashea con el driver actual
          await userInstance.save()
        }
      }

      if (ok) {
        const token = await auth.generate(userInstance)
        const roles = await userInstance.getRoles()
        const permissions = await userInstance.getPermissions()
        return response.json({ ...token, roles, permissions })
      }
      // si no pasó local, continúa con el externo
    }

    // ---- intento externo ----
    let data
    try {
      const apiRes = await axiosInstance.post(
        'https://support.dlya.com.uy/SGRAPI/rest/loginCentrodeSoporte',
        { Login: loginId, Pass: user.password }
      )
      data = apiRes.data
    } catch (err) {
      return response.status(401).json({ error: 'No autorizado (api)', detalle: err.message })
    }

    if (data.Ok === 'S' && data.LoginLDAP && data.sdtContacto) {
      const contacto = data.sdtContacto
      const resolvedEmail = (contacto.Email || emailLower).toLowerCase()
      const username = (data.LoginLDAP || contacto.Login || loginId).toLowerCase()
      const login_ldap = username

      if (userInstance) {
        // SIN Hash.make: el hook del modelo lo hashea
        userInstance.password = user.password
        userInstance.username = userInstance.username || username
        userInstance.login_ldap = userInstance.login_ldap || login_ldap
        userInstance.email = userInstance.email || resolvedEmail
        await userInstance.save()
      } else {
        userInstance = await User.create({
          username,
          email: resolvedEmail,
          password: user.password, // texto plano -> el hook lo hashea
          nombre: contacto.Nombre || '',
          login_ldap,
          foto: contacto.Foto || '',
          avatar_url: contacto.Foto ? `https://support.dlya.com.uy/sgr/img/${contacto.Foto}` : null,
          externo_id: contacto.Id || null,
          rol_externo: contacto.Rol || null
        })
        const roleUser = await Role.findBy('slug', 'user')
        if (roleUser) await userInstance.roles().attach([roleUser.id])
      }

      const token = await auth.generate(userInstance)
      const roles = await userInstance.getRoles()
      const permissions = await userInstance.getPermissions()
      return response.json({ ...token, roles, permissions })
    }

    return response.status(401).json({ error: 'No autorizado (externo)' })
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

    // Asignar rol por defecto
    const roleUser = await Role.findBy('slug', 'user')
    if (roleUser) {
      await userInstance.roles().attach([roleUser.id])
    }

    let token = await auth.generate(userInstance);
    Object.assign(userInstance, token);

    // Opcional: incluir roles en la respuesta
    userInstance.role_names = await userInstance.getRoles() // ['user']
    userInstance.permission_slugs = await userInstance.getPermissions() // []

    return response.json(userInstance);
  }
}

module.exports = AuthController;
