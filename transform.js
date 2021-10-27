const fs = require('fs');
const csv = require('@fast-csv/parse');
const { writeToPath } = require('@fast-csv/format');


const FILE_NAME= 'yop.ldr'

function addLine(_color, _x, _y, _z, _partNo) {
	// body...
	let newLine = [];
	newLine.push(1)
	newLine.push(_color)
	newLine.push(_x)
	newLine.push(_y)
	newLine.push(_z)
	newLine.push(1)
	newLine.push(0)
	newLine.push(0)
	newLine.push(0)
	newLine.push(1)
	newLine.push(0)
	newLine.push(0)
	newLine.push(0)
	newLine.push(1)
	newLine.push(_partNo+'.dat')
	return newLine
}

function get(_row, _attr) {
	const ATTR = {
		"part": 0,
		"color": 1,
		"qty": 2,
		"spare": 3
	};
	return _row[ATTR[_attr]];
}


let outRows = [
    ['0'],
	['0','Name:', FILE_NAME],
	['0', 'Author:','me'],
];

fs.createReadStream('in.csv')
    .pipe(csv.parse(headers=true))
    .on('error', error => console.error(error))
    .on('data', inRow => {
    	console.log(`ROW=${JSON.stringify(inRow)}`);
    	for (var k = 0; k<get(inRow, 'qty'); k++) {
			let x = 50;
			let y = 50;
			let z = 50;
			outRows.push(addLine(get(inRow, 'color'), x,y, z, get(inRow, 'part')))
		}
    })
    .on('end', rowCount => {
    	console.log(`Parsed ${rowCount} rows`)

    	

		// Write to file
		writeToPath(FILE_NAME, outRows, { delimiter: ' ' })
		    .on('error', err => console.error(err))
		    .on('finish', () => console.log('Done writing.'));



    });


