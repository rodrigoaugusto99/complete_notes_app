const sqliteConnection = require('../database/sqlite')

class UserRepository{
    
    async findByEmail(email){
        const database = await sqliteConnection()
        const user = await database.get('SELECT * FROM users WHERE email = (?)', [email])

        return user
    }

    async createUser({ name, email, password}){
        const database = await sqliteConnection()
        
        const userId = await database.run(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
             [name, email, password]
        )
//colocando como objeto pra caso no futuro quisermos retornar email tbm, sei la
        return {id: userId}
    }
}

module.exports = UserRepository