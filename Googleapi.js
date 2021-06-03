const config = require("./config.js");
var {google} = require('googleapis');
const keys = require('./keys.json');

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.Googleapis.com/auth/spreadsheets']
) //Json Web Token

client.authorize(function(err, tokens) {
    if (err){
        console.log(err);
        return;
    }

    console.log('Connected Google Sheets Api!');
    gsrun(client);
});

let gsapi;

async function gsrun(cl){
    gsapi = google.sheets({version:'v4', auth:cl})
}



async function getValues(range)
{
    const opt = {
        spreadsheetId: config.spreadid,
        range : range
    }

    let data = await gsapi.spreadsheets.values.get(opt);
    let dataArray = data.data.values;

    return dataArray;
}

    async function getLastRow() // Get the number of the last row in the table
{
    const opt = {
        spreadsheetId: config.spreadid,
        range: 'Data!A1:A'
    }
    let response = await gsapi.spreadsheets.values.get(opt);
    return response.data.values.length;
}

async function updateSheet(name, phone) // Write in the last row of the table the data.
{
    let lastRow = await getLastRow() + 1;
    const opt = {
            spreadsheetId : config.spreadid,
            range: 'Data!A' + lastRow,
            valueInputOption:'USER_ENTERED',
            resource: {values: [[name, phone]]}
    }
    await gsapi.spreadsheets.values.update(opt);
}


module.exports.updateSheet = updateSheet;
module.exports.getValues = getValues;
module.exports.getLastRow = getLastRow;


