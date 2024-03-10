const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')

class UserCreateService{
    /*nao queremos depender desse userRepository, entao vamos colocar no construtor,
    ele vai ser instanciado no momento que essa classe for instanciada */
    constructor(userRepository){
        /*this eh o contexto global dessa classe. Colocamos esse userReposity
        que veio por parametro e atribuimos a uma variavel com o mesmo nome nessa classe.
        Essa classe vai ter acesso ao repository, ai podemos colocar dentro do execute*/
        this.userRepository = userRepository
    }
    async execute({email, name, password}){
        
/*dessa forma, nao vamos instanciar o userRepository aqui nessa classe, vamos
usar assim com o this, com o userRepository que o controller instanciou.

ou seja, aqui no execute tem toda a logica para a criacao do usuario, mas
nao eh aqui que definimos qual vai ser o userReposotory. vai ser definido
no momento em que chamamos essa classe. Podemos jogar aqui um userRepository
que usa sqlite, outra hora podemos colocar um outro userRepository que usa
PostgreesSQL. No caso, poderiamos fazer uma classe abstrata UserRepositoryAbstract
e criar um UserRepositorySqlite, UserRepositoryMySql, UserRepositoryPostgrees, e
nois poderiamos intercalar entre esses quando quisermos, pois o  nois iriamos
falar que o construtor vai RECEBER a classe abstrata, ou seja, vai aceitar todos
os filhos dessa classe abstrata, que sao as classes concretas. Aqui ESPERARIA uma classe 
do tipo UserRepositoryAbstract, mas que nao seria essa abstracao, seria uma
das implementacoes.

quem vai usar essa classe eh quem diz qual banco sera utilizado.*/
        const checkUserExists = await this.userRepository.findByEmail(email)

        if(checkUserExists){
            throw new AppError('Este email ja esta em uso')
        }

        const hashedPassword = await hash(password, 8)

        const userCreated = await this.userRepository.createUser({name, email, hashedPassword})
        //pegando o retorno, que no caso eh um objeto apenas com o id por enquant
        return userCreated
    }
}

module.exports = UserCreateService