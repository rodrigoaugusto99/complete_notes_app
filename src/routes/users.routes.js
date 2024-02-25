const {Router} = require("express")
const multer = require('multer')
const uploadConfig = require('../configs/upload')

//importando o cotroller - so o nome da pasta, sem a extensao
const UsersControllers = require('../controllers/UsersControllers')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const usersRoutes = Router()
const upload = multer(uploadConfig.MULTER)

const usersControllers = new UsersControllers()


//3 - estou na raiz, nao tem nada mais pra frente depois do /users, entao fica apenas /
//ai aqui fica, ao inves daquela funcao, fica a chamada da funcao
//- a rota so vai receber a requisicao e resposta e repassar pro controller equivalente.
usersRoutes.post('/', usersControllers.create)
//quando chamar o /user/:id do put, o ensure vai interceptar a requisicao antes de jogar la pro metodo
//nesse nosso middleware, ele vai pegar o id do usuario que ta dentro do token,
//nao precisa mais do id, pois vamos pegar pelo middleware
//usersRouter.put('/:id',  usersControllers.update)
usersRoutes.put('/', ensureAuthenticated, usersControllers.update)
usersRoutes.patch('/avatar', ensureAuthenticated, upload.single('avatar'), (request, response) => {
    console.log(request.file.filename)
    response.json()
})

module.exports = usersRoutes

/*nao precisa mais do id, vamos pegar pelo middleware,
pois fizemos isso:
 - const {sub: user_id} = verify(token, authConfig.jwt.secret)
*/