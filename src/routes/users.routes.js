const {Router} = require("express")

//importando o cotroller - so o nome da pasta, sem a extensao
const UsersControllers = require('../controllers/UsersControllers')

const usersRouter = Router()

const usersControllers = new UsersControllers()


//3 - estou na raiz, nao tem nada mais pra frente depois do /users, entao fica apenas /
//ai aqui fica, ao inves daquela funcao, fica a chamada da funcao
//- a rota so vai receber a requisicao e resposta e repassar pro controller equivalente.
usersRouter.post('/', usersControllers.create)
usersRouter.put('/:id', usersControllers.update)

module.exports = usersRouter