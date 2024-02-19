//p padronizar o tipo de msg pra cada tipo de excecao

//caso status code n seja informado, vai ser 400(bad request)(erro do client)

//this.message - pegar a message q vai chegar pelo construtor da classe e passar pra message do contexto global

class AppError{
    message;
    statusCode;

    constructor(message, statusCode = 400){
        this.message = message;
        this.statusCode = statusCode;
    }
}

module.exports = AppError

