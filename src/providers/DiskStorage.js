const fs = require('fs')
const path = require('path')
const uploadConfig = require('../configs/upload')

class DiskStorage{
    async saveFile(file){
        /*rename permite renomear ou mudar o arquivo de lugar
        pega o arquivo dentro da pasta temporaria, 
        e leva pra nova pasta
        
        quando for pra pasta temporaria, backend vai ficar esperando o que vamos fazer com aquela imagem.
        quando salvar o arquivo, pegamos da pasta temporaria e leva pra pasta de upload*/

        /*path e fs sao pacotes do node,  o path resolve o caminho da pasta
        de acordo com o sistema operacional*/
        await fs.promises.rename(
            path.resolve(uploadConfig.TPM_FOLDER, file),
            path.resolve(uploadConfig.UPLOADS_FOLDER, file)
        )

        return file;
    }

    async deleteFile(file){
        //pegando endereco do arquivo na pasta de uploads.
        const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)
//eh bom fazer com try catch pq manipulacao de pasta pode dar ruim, e isso nao crasha
        try{
            //isso ve o estado do arquivo, se ta corrompido, sendo usado, disponivel, etc
            //retorna o estado do arquivo.
            await fs.promises.stat(filePath)
        }catch{
            return
        }
//remove o arquivo
        await fs.promises.unlink(filePath)
    }
}

module.exports = DiskStorage