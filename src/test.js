const fs = require("fs");
const path = require("path");


(async () => {
    const response = await fetch("https://emoji.gg/")
    const body = await response.text();

    const srcs = body.split(" ")
        .filter(text => text.includes("data-src=\"https://cdn3.emoji.gg/emojis"))
        .map(text => text.substring(39,text.length-1))

    const emojiID = srcs.at(Number(Math.random() * srcs.length));
    
    const serverEmojiPath = path.join(__dirname,"../data/emoji.json")
    const serverEmojiData = JSON.parse(fs.readFileSync(serverEmojiPath))
    let i = 1;

    const serverID = "serverID";
    if (serverEmojiData[serverID] === undefined) {
        serverEmojiData[serverID] = [emojiID]
        //upload emoji and task done
    } 
    else {
        for (;serverEmojiData[serverID].includes(emojiID) && i <= srcs.length;i++) {
            emojiID = srcs.at(Number(Math.random() * srcs.length))
        }        
    }
    if (i===srcs.length) {
        //there seems to be no emoji left
        //return msg
    }



    const a = await fetch(`https://cdn3.emoji.gg/emojis/${emojiID}`)

    
    console.log(a.url)
    console.log(`https://cdn3.emoji.gg/emojis/${emojiID}`)
    
})()