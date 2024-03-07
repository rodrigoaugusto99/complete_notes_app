const knex = require('../database/knex')

class NotesController{
    async create(request, response){
        //dados do corpo
        const {title, description, tags, links} = request.body
        //dados do params(id)
        //const { user_id } = request.params
        //PEGANDO PELO REQUEST.USER.ID APOS O MIDDLEWARE
        const user_id  = request.user.id

        //cadastrando a nota e recuperando o id daquela nota
        const [note_id] = await knex('notes').insert({
            title, 
            description, 
            user_id
        })

        /*
        pra cada link que veio do body, vamos passar por todos eles
        e retornar um objeto(mapa) com aquele note_id de cima e o link
         */

        //o note_id, como ficou sozinho, entao eh como se fosse note_id: note_id
        const linksInsert = links.map(link => {
            return {
                note_id,
                url: link
            }
        })
//vira um array de objetos, inserimos no linbk
        await knex('links').insert(linksInsert)

        //mesma coisa com as tags
        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id
            }
        })

        await knex('tags').insert(tagsInsert)

        response.json()
    }

    async show(request, response){
        const { id }= request.params

        const note = await knex('notes').where({id}).first()
        const tags = await knex('tags').where({note_id: id}).orderBy('name')
        const links = await knex('links').where({note_id: id}).orderBy('created_at')

        return response.json({note, tags, links})
    }

    async delete(request, response){
        const { id }= request.params

        const note = await knex('notes').where({id}).delete()

        return response.json()
    }

    async index(request, response){

        //const { title, user_id, tags} = request.query
        const { title, tags} = request.query
        //NAO VAMOS MAIS PEGAR DA QUERY
        //PEGANDO PELO REQUEST.USER.ID APOS O MIDDLEWARE
        const user_id  = request.user.id

        let notes

        if(tags){
            //o dado na query vem tipo - node,express
            const filterTags = tags.split(',').map(tag => tag.trim())
            //com essa logica, fica  -[ 'node', 'express' ]
            notes = await knex('tags')
            .select(['notes.id', 'notes.title', 'notes.user_id'])
            .where('notes.user_id', user_id)
            .whereLike('notes.title', `%${title}%`)
            .whereIn('name', filterTags)
            .innerJoin('notes', 'notes.id', 'tags.note_id')

            console.log(filterTags)
        }else{
        notes = await knex('notes')
        .where({ user_id })
        .whereLike('title', `%${title}%`)
        .orderBy('title')
        }
//pegando todas as tags desse usuario
        const userTags = await knex('tags').where({user_id})

        //percorrendo as notas do usuario, e em cada iteracao, percorrer todas 
        //as tags pra ver ha(filter) uma tag que tem o note_id igual ao note_id 
        //da aquele note.


        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note_id)
//se filtrou, se tal tag corresponde a tal nota, entao taca-lhe no return 
//pra retornar a nota inteira + todas essas tags filtradas
            return {
                ...note,
                tags: noteTags
            }
        })
        
//agora, inves de retornar so as notas, podemos retornar esse ultimo filtro, que sao
//as notas E as respectivas tags.
        return response.json(notesWithTags)
    }
}

module.exports = NotesController