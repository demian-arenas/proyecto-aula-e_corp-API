'use strict'

import { send, json } from 'micro'
import HttpHash from 'http-hash'
import Db from 'e-corp-db'
import config from './config'
import utils from './lib/utils'

let db = new Db()

const hash = HttpHash()

hash.set('POST /login', async function loginAdmin (req, res, params) {
  let credentials = await json(req)
  let auth = await db.authenticateUser(credentials.nickname, credentials.password, 1)
  if (!auth) return send(res, 401, { error: 'invalid credentials' })
  let token = await utils.signToken({
    userId: credentials.nickname
  }, config.secret)

  send(res, 200, token)
})

hash.set('GET /profileUser/:nickname', async function consultUserAdmin (req, res, params) {
  let nickname = params.nickname
  let user = await db.getUserConsult(nickname)
  delete user[0].pass_usr
  send(res, 200, user[0])
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
