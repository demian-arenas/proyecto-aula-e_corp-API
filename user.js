'use strict'

import { send, json } from 'micro'
import HttpHash from 'http-hash'
import Db from 'e-corp-db'
import config from './config'
import utils from './lib/utils'

let db = new Db()

const hash = HttpHash()

//  POR HACER
hash.set('GET /signout', async function cerrarSesion (req, res, params) {

  send(res, 200)
})

hash.set('GET /profile/:nickname', async function perfilUsuario (req, res, params) {
  let nickname = params.nickname
  let user = await db.getUserConsult(nickname)
  delete user[0].pass_usr
  user
  send(res, 200, user)
})

hash.set('POST /profile/:nickname/modify', async function perfilUsuarioModificar (req, res, params) {
  let nickname = params.nickname
  let user = await db.getUserAut(nickname, 1)
  let credentials = await json(req)
  await db.updateUserData(credentials.nombre, credentials.app, credentials.apm, credentials.idGen, credentials.igOrg, user[0].id_udt)
  .then(async (rows) => {
    send(res, 201)
  })
  .catch((err) => send(res, 409, err))
})
hash.set('GET /profile/:nickname/modify', async function getCountry (req, res, params) {
  let gender = await db.getGender()
  let country = await db.getCountry()
  let dataForm = {
    paises: country,
    generos: gender
  }
  send(res, 200, dataForm)
})

hash.set('GET /profile/:nickname/modify/:var', async function getCountry (req, res, params) {
  let countryCode = params.var
  let cityByCountry = await db.getCityByCountry(countryCode)
  send(res, 200, cityByCountry)
})

export default async function main (req, res) {
  let { method, url } = req
  let match = hash.get(`${method.toUpperCase()} ${url}`)

  if (match.handler) {
    try {
      await match.handler(req, res, match.params)
    } catch (e) {
      send(res, 500, { error: e.message })
    }
  } else {
    send(res, 404, { error: 'route not found' })
  }
}
