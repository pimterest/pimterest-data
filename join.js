const path = require("path")
const fs = require("fs")
const util = require("util")
const linkPreviewGenerator = require("link-preview-generator");

const directoryPath = path.join(__dirname, "telegram")
let jsonData = [];

async function showPreview(link){
  const previewData = await linkPreviewGenerator( link);
  return previewData;
}

async function walkTelegramFiles(){
  fs.readdir(directoryPath,async function(err, files) {
    if (err) {
      console.log("Error getting directory information.")
    } else {

      for (const file of files) {
        if(file !=".keep"){
          var  basefile = file.replace(/\.[^/.]+$/, "")
          var filearr = basefile.split("_");

          let itemArr = {};
          itemArr.permid = file;
          itemArr.date = filearr[0];
          itemArr.type = filearr[2];
          itemArr.source = "telegram";

          if(itemArr.type == "link"){
            const link = fs.readFileSync(path.join(directoryPath, file),{encoding:'utf8', flag:'r'});
		
            itemArr.url = link;
            itemArr.preview = await showPreview(link);
            jsonData.push(itemArr);
          }
          else if(itemArr.type == "image"){
            itemArr.image = file;
            jsonData.push(itemArr);
          }
        }
      };

      // convert JSON object to string
      const data = JSON.stringify(jsonData);
      
      // write JSON string to a file
      fs.writeFile('out/telegram.json', data, (err) => {
         if (err) {
            throw err;
         }
         console.log("JSON data is saved.");
      });


    }
  })


}

walkTelegramFiles();





