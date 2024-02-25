const { Router } = require('express')

const SessionsController = require('../controllers/SessionsController')
//instancianddo a classe - alocando essa classe na memoria e armazenando na variavel
const sessionsController = new SessionsController()

const sessionsRoutes = Router()
//criando a rota com o controller method correspondente
sessionsRoutes.post('/', sessionsController.create)

module.exports = sessionsRoutes