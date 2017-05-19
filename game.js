'use strict'

import { send, json } from 'micro'
import HttpHash from 'http-hash'
import Db from 'e-corp-db'
import config from './config'
import utils from './lib/utils'

let db = new Db()

const hash = HttpHash()

hash.set('GET /view/heroes', async function getHeroes (req, res, params) {
  let heroes
  await db.getHeroes().then((rows) => {
    heroes = rows
  }).catch((err) => send(res, 409, err))
  send(res, 200, heroes)
})
hash.set('GET /play', async function getDataPlay (req, res, params) {
  let enemigos
  let heroes
  await db.getEnemies().then((rows) => {
    enemigos = rows
  }).catch((err) => send(res, 409, err))
  await db.getHeroes()
  .then((rows) => {
    heroes = rows
  }).catch((err) => send(res, 409, err))
  let dataPlay = {
    enemigos: enemigos,
    heroes: heroes
  }
  send(res, 200, dataPlay)
})
hash.set('GET /play/shop', async function getObjectsShop (req, res, params) {
  let objetos = await db.getObjects()
  send(res, 200, objetos)
})
hash.set('POST /play/shop', async function saveObjectsShop (req, res, params) {
  let object = await json(req)
  db.guardarObjetoPartida(object.idTipoObjeto, object.idObjeto, object.nickname, object.cantidadObjeto)
  .then(() => send(res, 201))
  .catch((err) => send(res, 409, err))
})
hash.set('POST /play/:var', async function saveGame (req, res, params) {
  let nivel = params.var
  let dataPlay = await json(req)
  await db.guardarHeroe(dataPlay.idEsp, dataPlay.xpHeroe, dataPlay.estado, dataPlay.nickname)
  .then(async (rows) => {
    await db.guardarPartida(dataPlay.nombrePar, dataPlay.nickname, nivel)
    .then((rows) => send(res, 201))
    .catch((err) => send(res, 409, err))
  })
  .catch((err) => send(res, 409, err))
})
hash.set('POST /play/init', async function partida (req, res, params) {
  let data = await json(req)
  await db.crearPartida(data.nombre, data.nickname)
  .then(async (rows) => {
    await db.crearHeroePartida(rows.insertId, data.nickname)
    .then((rows) => {
      send(res, 201)
    })
    .catch((err) => send(res, 409, err))
  })
  .catch((err) => send(res, 409, err))
})
hash.set('GET /play/partida/:var', async function getpartida (req, res, params) {
  let nickname = params.var
  await db.getPartida(nickname)
  .then((rows) => {
    send(res, 200, rows)
  })
  .catch((err) => send(res, 409, err))
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
