const fs = require("fs");
const path = require("path");

function update(location, value) {
    const userDataPath = path.join(__dirname,"../../data/user.json");
    const userData = JSON.parse(fs.readFileSync(userDataPath));
    
    
    const defaultDataPath = path.join(__dirname,"./defaultStructure.json");
    const defaultData = JSON.parse(fs.readFileSync(defaultDataPath));

    

}

update(["daily","currency"],5)