require('express-async-errors')
require('dotenv/config')
//const database = require('./database/sqlite')
const migrationsRun = require('./database/sqlite/migrations')

const cors = require('cors')
const express = require("express")
const routes = require("./routes")
const AppError = require("./utils/AppError")
const uploadConfig = require("./configs/upload")

// database()
migrationsRun()
//ao clicar em send, vai nesse arquivo server.js

//como nao tem nada depois do routes, vai carregar por padrao a pasta com nome index.
//e entao ao ir nas routes, vai la onde ta armazenadas todas as rotas (no index)

const app = express()
app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.UPLOADS_FOLDER))

//1 - vai nas rotas - use essas rotas
app.use(routes)

app.use((error, request, response, next) => {
    /**
     * la no controller nois demos um throw no error, com a mensagem personalizada
     * que condiz com aquele contexto esepcifico da funcao que lancou o erro
     * 
     * aqui, o erro vai ser capturado. se o error lancado foi do tipo AppError, que criamos
     * pra lancar erros relacioandos a erros do cliente, entao nois retornamos um objeto
     * com a mensagem que esta dentro do error. (ja que veio de AppError, que tem atributo chamado message
     * e que no caso desse if, error = AppError, entao error.message = AppError.message)
     * 
     * entao agora, todo erro que lancarmos durante o app para lidar com erros relacionados ao cliente,
     * vamos utilizar esse AppError la no throw new Exception,
     */
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message,
        })
    }

    console.log(error)

    //se nao foi error do tipo AppError, entao foi um erro que tem nada a ver com cliente, entao
    //tacamos um 500 com mensagem generica de erro interno

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error',
    })
    
})

//caso  o dev nao setar variaveis de ambiente, fazemos entao essa precaucao de ||
//3333 pois a 3000 geralmente eh usada pelo react
const PORT = process.env.SERVER_PORT || 3333
app.listen(PORT, () => console.log(`rodando no ${PORT}`))