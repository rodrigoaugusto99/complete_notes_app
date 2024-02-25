const {Router} = require("express")


const NotesControllers = require('../controllers/NotesController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')
const notesRouter = Router()

const notesControllers = new NotesControllers()

//a partir do momento que agora tiramos o id da requisicao do parametro, e vamos
//pegar usando o middleware, entao vamos fazer com que todas essas rotas dessa
//pasta use esse middleware
notesRouter.use(ensureAuthenticated)

//entao tiramos o :user_id de create
notesRouter.post('/', notesControllers.create)
//aqui vai ficar, pois isso eh o id da nota a ser mostrada
notesRouter.get('/:id', notesControllers.show)
//aqui tbm vai ficar esse id, pois eh o id da nota a ser deletada
notesRouter.delete('/:id', notesControllers.delete)
//e aqui nao precisa tbm, vamos pegar pelo middleware
//pra ter acesso a todas as notas DAQUELE usuario
notesRouter.get('/', notesControllers.index)

//notesRouter.put('/:id', usersControllers.update)

module.exports = notesRouter

/*la no imnsonia,  vamos jogar esse bearer token la no auth em todas
as requisicoes que queremos que o usuario esteja logado pra realizar, isso
inclui coisas ate como show notas, show index, etc.

se o token expirar, temos que isso la em sessions e dar o send na
rota de create, pra criar a sessao e criar o token pra ficar la na var. de amb.*/