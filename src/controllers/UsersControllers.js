
const sqliteConnection = require('../database/sqlite')
const UserRepository = require('../repositories/UserRepository')
const UserCreateService = require('../services/UserCreateService')
class UsersControllers {
    async create(request, response){
        /*reponsabildiade do controller ficca apenas pegar a requisicao e
        devolver a resposta. */            
        const { name, email, password} = request.body

        const userRepository = new UserRepository()
        const userCreateService = new UserCreateService(userRepository)
        await userCreateService.execute({name, email, password})

        return response.status(201).json()
    }

    async update(request, response){
        const { name, email, password, old_password } = request.body
        /*
        aqui nois nao vamos mais pegar o id do usuario pelo parametro da url
        e sim, vamos pegar pelo middleware. lembra que la no middleware a gente
        depois de capturar o token com aquele verify, nois CRIAMOS uma propriedade
        dentro de (request)?

        request.user = {
            id: Number(user_id)
        }
        entao agora, pra pegar o id do usuario, eh so acessar o id do user do request.
         */
        //const { id } = request.params
        const user_id  = request.user.id
        const database = await sqliteConnection()
        //user = user em json
        const user = await database.get('SELECT * FROM users WHERE id = (?)', [user_id])
        console.log(user)
        if(!user){
            throw new AppError('Usuario nao encontrado!!')
        }

        const userWithUpdatedEmail = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        //se tiver um usuario com esse email que o usuario quer colocar, e o id
        //desse usuario que possui esse email nao for o mesmo id desse usuario
        // que esta tentando trocar o email, entao quer dizer que o usuario esta
        //tentando trocar o email para um email ja usado por outra pessoa.

        /*
        repare o seguinte:
        o id, que veio do request.params, eh uma string.
        o user.id, que veio pelo banco, eh um number
        entao, como userWithUpdatedEmail.id eh um number, pois veio do
        banco, que tem o campo id confugurado como id, entao para compararmos
        de forma correta aqui no condition, temos que tambem usar o user.id que
        eh number, pois tbm veio do banco.
        entao no caso, temos que tomar cuidado na hora de comparar, pois
        as o "valor" pode ate ser igual, mas o tipo nao, entao 
        tem que averiguar certinho se devemos usar != ou !==.*/
        if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
            throw new AppError('Esse email ja esta sendo usado')
        }



        user.name = name ?? user.name
        user.email = email ?? user.email

        if( password && !old_password){
            throw new AppError('voce precisa passar sua senha antiga para alterar.')
        }

        if(password && old_password){
            const checkOldPassword = await compare(old_password, user.password)

            if(!checkOldPassword){
                throw new AppError('Senha errada')
            }

            user.password = await hash(password, 8)
        }

        await database.run(
            `UPDATE users SET
             name = ?, 
             email = ?,
             password = ?, 
             updated_at = DATETIME('now')
             WHERE id = ?`, 
            [user.name, user.email, user.password, user_id]
        )

        return response.json()

        /*
        no caso desse exemplo, eh nois  */

    }
}

module.exports = UsersControllers