const path = require("path")
const fs = require("fs")
const util = require("util")
const linkPreviewGenerator = require("link-preview-generator");

const directoryPath = path.join(__dirname, "telegram")
let jsonData = [];

async function showPreview(link){
	const previewData = await linkPreviewGenerator( link);
	console.log(previewData);
}

async function walkTelegramFiles(){
	console.log(directoryPath)
	fs.readdir(directoryPath,async function(err, files) {
		if (err) {
			console.log("Error getting directory information.")
		} else {
			files.forEach(async function(file) {

				console.log(file)
				if(file !=".keep"){

					var  basefile = file.replace(/\.[^/.]+$/, "")
					var filearr = basefile.split("_");

					let itemArr = {};
					itemArr.permid = file;
					itemArr.date = filearr[0];
					itemArr.type = filearr[2];
					itemArr.source = "telegram";

					if(itemArr.type == "link"){
						await fs.readFile (path.join(directoryPath, file), 'utf8',async function (err, link) {
							if (err) {
								console.log(err);
								process.exit(1);
							}
							itemArr.url = link;
							itemArr.preview = await showPreview(link);
						});

					}

					if(filearr[2] == "image"){
						itemArr.image = file;
					}

					console.log(file)
					jsonData.push(itemArr);
				}
			})

			console.log(jsonData);

		}
	})


}

walkTelegramFiles();




// convert JSON object to string
const data = JSON.stringify(jsonData);

// write JSON string to a file
fs.writeFile('out/telegram.json', data, (err) => {
	if (err) {
		throw err;
	}
	console.log("JSON data is saved.");
});

