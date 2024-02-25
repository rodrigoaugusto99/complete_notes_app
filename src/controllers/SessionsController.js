//importando conexao com banco de dados
const knex = require('../database/knex')
//pra lidar com excecoes
const AppError = require('../utils/AppError')

const { compare } = require('bcryptjs')

//imprtando os arquivos de configuracao que fizemos na pasta
const authConfig = require('../configs/auth')
//importamos sign, metodo do jsonwebtoken
const { sign } = require('jsonwebtoken')

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
//comparando a senha que o usuario digitou com a senha cadastrada no banco(com o usuario pego no banco)
        const passwordMatched = await compare(password, user.password)

        if(!passwordMatched){
            throw new AppError('email ou senha incorretos', 401)
        }

        /*se passou por essas duas etapas de verificacao, quer dizer que o usuario tem as
        credenciais de acesso
        
        entao vamos GERAR um token e entregar pro usuario.
        com esse token ele ira fazer as requisicoes ja autenticadas na nossa aplicacao.*/

        const {secret, expiresIn} = authConfig.jwt
        //passamos pra esse sign um objeto vazio(lugar onde podemos colocar uma configuracoes
        //opcionais),
        //se passa o mouse em cima de sign, da p ver as coisas que podem ser passadas:
        //payload   ,   secret    ,     signOptions
        const token = sign({}, secret, {
            subject: String(user.id),
            expiresIn
        })

//retornando esse usuario
        //return  response.json(user)
        return  response.json({user, token})
    }
}
/*ai pra testar la no imnsonia, coloca a rota sessions, manda o body
com json e um email, e clica em send. esse return com esse response justamente eh que 
vai jogar o resultado(user) la */

module.exports = SessionsController

//pq se nao colocar o new antes de AppError, o esse erro nao eh chamado, eh chamado o outro padrao?