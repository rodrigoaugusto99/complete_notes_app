const {Router} = require("express")


const NotesControllers = require('../controllers/NotesController')

const notesRouter = Router()

const notesControllers = new NotesControllers()


notesRouter.post('/:user_id', notesControllers.create)
notesRouter.get('/:id', notesControllers.show)
notesRouter.get('/', notesControllers.index)
notesRouter.delete('/:id', notesControllers.delete)
//notesRouter.put('/:id', usersControllers.update)

module.exports = notesRouter