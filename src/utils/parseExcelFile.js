//parseExcelFile.js

const xlsx = require('xlsx');

async function parseExcelFile(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    return data;
}

module.exports = { parseExcelFile };