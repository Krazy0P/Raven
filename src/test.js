const path = require('path')
const fs = require('fs')

const folderPath = path.join(__dirname,'commands')
const cmdFolders = fs.readdirSync(folderPath)

for (const folder of cmdFolders) {
    const cmdPath = path.join(folderPath,folder)
    const cmdFiles = fs.readdirSync(cmdPath).filter()
}