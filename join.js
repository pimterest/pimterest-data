const path = require("path")
const fs = require("fs")

const directoryPath = path.join(__dirname, "telegram")

const linkPreviewGenerator = require("link-preview-generator");

async function showPreview(){
  const previewData = await linkPreviewGenerator(
    "https://www.youtube.com/watch?v=8mqqY2Ji7_g"
  );
  console.log(previewData);
}

showPreview();


fs.readdir(directoryPath, function(err, files) {
  if (err) {
    console.log("Error getting directory information.")
  } else {
    files.forEach(function(file) {
      if(file !=".keep"){
        console.log(file)


      }
    })
  }
})
