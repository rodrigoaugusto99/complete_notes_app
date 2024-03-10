const UserCreateService = require("./UserCreateService")
const UserRepositoryInMemory = require("../repositories/UserRepositoryInMemory")
const AppError = require("../utils/AppError")


describe("UserCreatedService", () => {

    let userRepositoryInMemory
    let userCreateService

    beforeEach(() => {
        userRepositoryInMemory = new UserRepositoryInMemory()
        userCreateService = new UserCreateService(userRepositoryInMemory)
    })
    it('user should be created', async () => {
        const user = {
            name: 'User Test',
            email: 'user@test.com',
            password: '123',
        }
        const userCreated = await userCreateService.execute(user)
    
        expect(userCreated).toHaveProperty('id')
    })

    it('user not should be created with exists email', async () => {
        //fizemos dois usuarios, porem com emails iguais
        const user1 = {
            name: 'User Test 1',
            email: 'user@test.com',
            password: '123',
        }

        const user2 = {
            name: 'User Test 2',
            email: 'user@test.com',
            password: '123',
        }

        //fazemos a execucao com o primeiro usuario
        await userCreateService.execute(user1)
        //na hora de cadastrar o segundo usuario, esperamos o erro igual ao AppError, com
        //essa mesma mensagem, que eh exatamente o resultado da exception la no service
        //se deixarmos a mensagem diferente, vai dar fail no teste, pois se aqui botarmos 
        //bla bla bla, vai dizer que o esperado era bla bla bla mas o que veio foi 
        //esse "este email ja esta em uso"

        /*lembrando que nos testes, nao precisa do await pois eh tudo feito em memoria, mas 
        deixamos com await p manter-se fiel ao service.*/
        await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError('Este email ja esta em uso'))
    })
})
