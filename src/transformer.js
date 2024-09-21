// transformer.js

const fs = require('fs');
const path = require('path');

// Read the raw data from the file
const rawData = fs.readFileSync('lotto_raw_data.txt', 'utf-8');

// Split the raw data into lines
const lines = rawData.trim().split('\n');

// Initialize an object to store data per year
const dataByYear = {};

// Process each line
lines.forEach((line) => {
  // Trim the line and skip if empty
  line = line.trim();
  if (line === '') return;

  // Split the line into parts using semicolons
  const parts = line.split(';');

  // Ensure there are at least 3 parts (index, date, numbers)
  if (parts.length < 3) {
    console.error(`Invalid line format: ${line}`);
    return;
  }

  // Extract date and convert it to YYYY-MM-DD format
  const dateParts = parts[1].split('.');
  const day = dateParts[0].padStart(2, '0');
  const month = dateParts[1].padStart(2, '0');
  const year = dateParts[2];
  const formattedDate = `${year}-${month}-${day}`;

  // Extract numbers and convert them to integers
  const numbersString = parts[2].replace(/[^0-9,]/g, ''); // Remove any non-numeric characters except commas
  const numbersArray = numbersString
    .split(',')
    .filter((num) => num !== '') // Remove empty strings from trailing comma
    .map((num) => parseInt(num, 10));

  const superNumber = parts[3].trim();
  // Create the entry object
  const entry = {
    date: formattedDate,
    numbers: numbersArray,
    superNumber: superNumber === '' ? null : parseInt(superNumber, 10),
  };

  // Add the entry to the dataByYear object
  if (!dataByYear[year]) {
    dataByYear[year] = [];
  }
  dataByYear[year].push(entry);
});

// Create an output directory if it doesn't exist
const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Write each year's data to a separate JSON file with the naming format 'numbers-<year>.json'
for (const [year, entries] of Object.entries(dataByYear)) {
  const filePath = path.join(outputDir, `numbers-${year}.json`);
  fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));
  console.log(`Data for year ${year} written to ${filePath}`);
}

console.log('Data transformation complete.');
