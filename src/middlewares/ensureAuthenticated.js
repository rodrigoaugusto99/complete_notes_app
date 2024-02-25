const { verify } = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth')

function ensureAuthenticated(request, response, next){
    //acessando o token(vai estar no authorization, dentro do cabecalho, dentro da requisicao)
    const authHeader = request.headers.authorization

    if(!authHeader){
        throw new AppError('JWT token nao informado', 401)
    }

    //dentro do header tem o token, vamos tirar o espaco que existe la
   // Bare xxxxx
   //nao queremos a parte do bare, entao pode deixar vazio ali [,]

   //o que estamos dando split eh o _.USER_TOKEN que estamos passando la com o imnsonia
   //e com ele, tamo pegando a parte com Bearer xxx.., pegando so o id e tirando o espaco 
    const [, token] = authHeader.split(" ")

    try{
        //verify passando esse token que pegamos  e tbm passamos o secret do jwt do authCOnfig.
        //isso vai nos dizer se o token EH VALIDO, se eh jwt
        //isso devolve um sub. vamos chamar o sub de user_id ja.

        const {sub: user_id} = verify(token, authConfig.jwt.secret)

        //pegando a requisicao e criando uma propriedade chamada user
        //nela, colocar propriedade chamada id e passando aquele user_id como NUMBER
        //pois na hora de fazer o token la em create sessions, fizemos como uma string
        //mas no banco vamos guardar como numero
        request.user = {
            id: Number(user_id)
        }
        console.log(request.user.id)
//se td der certo, chamar a proxima funcao(pois esse middleware interceptou no meio)
        return next()
    }catch{
        throw new AppError('JWT token invalido', 401)
    }  
}

module.exports = ensureAuthenticated

/*
la no metodo put, ao passar esse middleware, agora a rota put(/users/id) nao
vai ser mais reconhecida, vai ser so put(/users) mesmo. Porem, como passamos 
o token nessa requisicao entao?

no 
 */