const {
    compile
} = require('nexe')
const fs = require('fs');

async function exists(filename) {
    try {
        return (await fs.promises.stat(filename)).size > 0
    } catch {}
    return false;
}




const name = 'בוט סקריבל';
const version = "1,0,0,0";
const iconPath = undefined;

const rc = {
    CompanyName: "OlympicAngel",
    ProductName: name,
    FileDescription: "כלי ללייבים שמסתיר את המסך כשתורך",
    FileVersion: version,
    ProductVersion: version,
    OriginalFileName: name,
    InternalName: name
}

compile({
    input: './index.js',
    name: name,
    /*/build: true, //required to use patches/*/
    ico: iconPath,
    rc: Object.assign({
        'PRODUCTVERSION': version,
        'FILEVERSION': version,
    }, rc)
}).then(() => {
    console.log('success')
})