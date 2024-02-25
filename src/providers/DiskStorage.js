const fs = require('fs')
const path = require('path')
const uploadConfig = require('../configs/upload')

class DiskStorage{
    async saveFile(file){
        /*renomear, mudar o arquivo de lugar
        pega o arquivo dentro da pasta temporaria, 
        e leva pra nova pasta
        
        quando for pra pasta temporaria, backend vai ficar esperando o que vamos fazer com aquela imagem.
        quando salvar o arquivo, pegamos da pasta temporaria e leva pra pasta de upload*/
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
            await fs.promises.stat(filePath)
        }catch{
            return
        }

        await fs.promises.unlink(filePath)
    }
}

module.exports = DiskStorage