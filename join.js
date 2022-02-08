const path = require("path")
const fs = require("fs")

const filenameAll = './out/linkdata.json';
const directoryPath = "./previews/"

let jsonArr = [];

async function joinPreviews(){
  fs.readdir(directoryPath, async function(err, files) {
    if (err) {
      console.log("Error getting directory information.")
    } else {

      for (const file of files) {
        if(file !=".keep"){
          var  basefile = file.replace(/\.[^/.]+$/, "")
          var filearr = basefile.split("_");

          let itemArr = {};
          itemArr.type = filearr[2];
          if(itemArr.type == "link"){

            const jsonItem = fs.readFileSync(path.join(directoryPath, file),{encoding:'utf8', flag:'r'});
            var jsonParsed = JSON.parse(jsonItem);
            jsonArr.push(jsonParsed);
          }
          else if(itemArr.type == "image"){
            //jsonData.push(itemArr);
          }
    fs.writeFileSync(filenameAll, data);
    console.log("wrote " + filenameAll);


  });

}

//////// MAIN

joinPreviews();
