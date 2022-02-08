const path = require("path")
const fs = require("fs")
const util = require("util")
const Parser = require('rss-parser');
const seeLink = require('see-link');

const rssurl = "https://rss.pimsnel.com/i/?a=rss&get=s&hours=168000000000000";
const directoryPath = path.join(__dirname, "telegram");
const filenameCache = './cache/previews-uid.json';

async function exists (path) {
  try {
    await fs.accessSync(path)
    return true
  } catch {
    return false
  }
}

async function showPreview(link){
  const previewData = await seeLink(link, {executablePath: 'chromium'});
  return previewData;
}

async function cachePreview(link, filename, type, source ){

  if(await exists(filename)){
    console.log("already in cache: "+ link);
    return true;
  }

  previewData = await showPreview(link);
  previewData.source = source;
  previewData.type = type;
  const data = JSON.stringify(previewData);
  fs.writeFileSync(filename, data);
  console.log("wrote preview of " + link + " to " + filename);
  return true;
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
          itemArr.type = filearr[2];
          if(itemArr.type == "link"){

            const link = fs.readFileSync(path.join(directoryPath, file),{encoding:'utf8', flag:'r'});
            var filename = 'previews/'+filearr[0]+'_'+ filearr[1]+'_link.json';
            cachePreview(link,filename,"link", "telegram");
          }
          else if(itemArr.type == "image"){
            //jsonData.push(itemArr);
          }
        }
      };
    }
  })

  return true
}

async function walkRSS(){
  let parser = new Parser({
    xml2js: {
      //strict: false,
    }
  });

  (async () => {

    let feed = await parser.parseURL(rssurl);

    //let i=0;
    for(const item of feed.items){
      /*
      i++;
      if(i > 5){
        break;
      }
      */
      var pubDate = new Date(item.pubDate).toISOString().substring(0,10);
      var filename = 'previews/'+pubDate+'_'+item.guid+'_link.json';
      await cachePreview(item.link,filename, "link", "rss");
    };

  })();

  return true;
}

//////// MAIN

walkTelegramFiles();
walkRSS();

