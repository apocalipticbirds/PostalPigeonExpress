

/*Message object example in DB
{
    _id:"5ca1d6321c9d440000b498b9",
    id_conversation: "5ca1cfae1c9d440000b498b8"
    id_sender: "5ca1c9a11c9d4400003e3590"
    content: "Hello"
    tags:[] //to nowe
    date: "2019-04-01T18:18:28.716Z"
}*/

//This method searching '#' symbols, read text after it until meet ' ' or next '#'
const findTags = (message) => {
    let tag = "";
    let isTag = false;
    for(let letter of message.content){
        //reading chars for tag
        if(isTag){
            if(letter !==" " && letter !=="#")
                tag += letter;
            else{
                message.tags.push(tag);
                isTag = !isTag;
                tag = "";
            }
        }
        if(letter === "#"){
            isTag = !isTag;
        }
    }

    if(tag !=="")
        message.tags.push(tag);

    return message;
};