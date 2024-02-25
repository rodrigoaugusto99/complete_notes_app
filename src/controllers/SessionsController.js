class SessionsController {
    async create(request, response){
        //esse teste com log retorna no terminal
        console.log(request.body)
        //esse teste com response retorna no imnsonia(cliente)
        //return so pra parar de rodar a funcao do create
        return  response.json(request.body)
    }
}

module.exports = SessionsController