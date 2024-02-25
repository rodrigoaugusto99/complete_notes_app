//importando conexao com banco de dados
const knex = require('../database/knex')
//pra lidar com excecoes
const AppError = require('../utils/AppError')

class SessionsController {
    async create(request, response){
        //esse teste com log retorna no terminal
        //console.log(request.body)
        //esse teste com response retorna no imnsonia(cliente)
        //return so pra parar de rodar a funcao do create

        //pegando os campinhos do corpo da requisicao do usuario
        const { email, password } = request.body

        //pegando o primeiro(unico) email da tabela de usuarios
        const user = await knex('users').where({email}).first()

        if(!user){
            throw new AppError('email ou senha incorretos', 401)
        }

//retornando esse usuario
        return  response.json(user)
    }
}
/*ai pra testar la no imnsonia, coloca a rota sessions, manda o body
com json e um email, e clica em send. esse return com esse response justamente eh que 
vai jogar o resultado(user) la */

module.exports = SessionsController

//pq se nao colocar o new antes de AppError, o esse erro nao eh chamado, eh chamado o outro padrao?