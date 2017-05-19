'use strict'

const request = require('request-promise')
const Promise = require('bluebird')

class Client {
  constructor (options) {
    this.options = options || {
      endpoints: {
        home: 'http://api.e_corp.com/home',
        game: 'http://api.e_corp.com/game',
        user: 'http://api.e_corp.com/user',
        admin: 'http://api.e_corp.com/admin'
      }
    }
  }
  saveUser (user, callback) {
    let opts = {
      method: 'POST',
      uri: `${this.options.endpoints.home}/signup`,
      body: user,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  getFormUser (callback) {
    let opts = {
      method: 'GET',
      uri: `${this.options.endpoints.home}/signup`,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  getFormCity (countryCode, callback) {
    let opts = {
      method: 'GET',
      uri: `${this.options.endpoints.home}/signup/${countryCode}`,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  loginUser (nickname, password, callback) {
    let opts = {
      method: 'POST',
      uri: `${this.options.endpoints.home}/login`,
      body: {
        nickname,
        password
      },
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  loginAdmin (nickname, password, callback) {
    let opts = {
      method: 'POST',
      uri: `${this.options.endpoints.admin}/login`,
      body: {
        nickname,
        password
      },
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  consultUserAdmin (nickname, callback) {
    let opts = {
      method: 'GET',
      uri: `${this.options.endpoints.admin}/profileUser/${nickname}`,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  getHeroes (callback) {
    let opts = {
      method: 'GET',
      uri: `${this.options.endpoints.game}/view/heroes`,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  getDataPlay (callback) {
    let opts = {
      method: 'GET',
      uri: `${this.options.endpoints.game}/play`,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  getObjectsShop (callback) {
    let opts = {
      method: 'GET',
      uri: `${this.options.endpoints.game}/play/shop`,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  saveObjectsShop (body, callback) {
    let opts = {
      method: 'POST',
      uri: `${this.options.endpoints.game}/play/shop`,
      body: body,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  saveGame (body, nivel, callback) {
    let opts = {
      method: 'POST',
      uri: `${this.options.endpoints.game}/play/${nivel}`,
      body: body,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
  partida (body, callback) {
    let opts = {
      method: 'POST',
      uri: `${this.options.endpoints.game}/play/init`,
      body: body,
      json: true
    }
    return Promise.resolve(request(opts)).asCallback(callback)
  }
}
module.exports = Client
