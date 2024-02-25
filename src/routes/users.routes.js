const {Router} = require("express")

//importando o cotroller - so o nome da pasta, sem a extensao
const UsersControllers = require('../controllers/UsersControllers')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const usersRouter = Router()

const usersControllers = new UsersControllers()


//3 - estou na raiz, nao tem nada mais pra frente depois do /users, entao fica apenas /
//ai aqui fica, ao inves daquela funcao, fica a chamada da funcao
//- a rota so vai receber a requisicao e resposta e repassar pro controller equivalente.
usersRouter.post('/', usersControllers.create)
//quando chamar o /user/:id do put, o ensure vai interceptar a requisicao antes de jogar la pro metodo
//nesse nosso middleware, ele vai pegar o id do usuario que ta dentro do token,
//nao precisa mais do id, pois vamos pegar pelo middleware
//usersRouter.put('/:id',  usersControllers.update)
usersRouter.put('/', ensureAuthenticated, usersControllers.update)

module.exports = usersRouter

/*nao precisa mais do id, vamos pegar pelo middleware,
pois fizemos isso:
 - const {sub: user_id} = verify(token, authConfig.jwt.secret)
*/