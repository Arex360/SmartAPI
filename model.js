const fs = require('fs');
const path = require('path');

function readJsonFiles(directoryPath) {
    const dataList = [];

    // Read all files in the directory
    fs.readdirSync(directoryPath).forEach(file => {
        if (file.endsWith('.json')) {
            const filePath = path.join(directoryPath, file);

            // Read and parse the JSON file
            const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            // Extract file name without the extension
            const fileName = path.parse(file).name;

            // Add file name to the JSON data
            jsonData.i = fileName;

            // Append data to the list
            dataList.push(jsonData);
        }
    });

    return dataList;
}
module.exports = readJsonFiles
// Specify the directory path where your JSON files are located
//const directoryPath = 'Dec/client2';

// Call the function to read JSON files
//const result = readJsonFiles(directoryPath);

// Print the result
//console.log(result);
