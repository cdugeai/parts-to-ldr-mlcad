const fs = require('fs');
const csv = require('@fast-csv/parse');
const { writeToPath } = require('@fast-csv/format');
require('dotenv').config({ path: '.config' })

const FILE_NAME = process.env.FILE_NAME;
const FILE_AUTHOR= process.env.FILE_AUTHOR;


const DIMENSIONS = {
	x_min: parseInt(process.env.X_MIN),
	x_max: parseInt(process.env.X_MAX),
	x_step: parseInt(process.env.X_STEP),
	y_min: parseInt(process.env.Y_MIN),
	y_step: parseInt(process.env.Y_STEP),
	z_value: parseInt(process.env.Z_VALUE)
}

function addLine(_color, _x, _y, _z, _partNo) {
	let newLine = [];
	// 1 means it is a part. See LDraw File Format Specification https://www.ldraw.org/article/218.html
	newLine.push(1)
	// color
	newLine.push(_color)
	// Position
	newLine.push(_x)
	newLine.push(_y)
	newLine.push(_z)
	// homogeneous transformation matrix coefficients
	newLine.push(1)
	newLine.push(0)
	newLine.push(0)
	newLine.push(0)
	newLine.push(1)
	newLine.push(0)
	newLine.push(0)
	newLine.push(0)
	newLine.push(1)
	// No of the part
	newLine.push(_partNo+'.dat')

	return newLine;
}

function get(_row, _attr) {
	// Aliases and indices of columns
	const ATTR = {
		"part": process.env.COLUMN_PARTNO,
		"color": process.env.COLUMN_COLOR,
		"qty": process.env.COLUMN_QUANTITY
	};

	return _row[ATTR[_attr]];
}

function nextPosition(_currentPosition, _dimensions) {

	let postition = {
		x: _currentPosition.x + _dimensions.x_step, 	// increment X
		y: _currentPosition.y, 							// keep Y
		z: _dimensions.z_value							// keep constant Z
	}

	// If X is too high, set it to min value and increment Y
	if (postition.x > _dimensions.x_max) {
		postition.x = _dimensions.x_min;
		postition.y = _currentPosition.y + _dimensions.y_step;
	}
	return postition;

}


let outRows = [
    ['0'],
	['0','Name:', FILE_NAME],
	['0', 'Author:',FILE_AUTHOR],
];

let currentPosition = {
	x: DIMENSIONS.x_min,
	y: DIMENSIONS.y_min,
	z: DIMENSIONS.z_value
}

fs.createReadStream('in.csv')
    .pipe(csv.parse(headers=true))
    .on('error', error => console.error(error))
    .on('data', inRow => {
    	console.log(`ROW=${JSON.stringify(inRow)}`);
	

    	for (var k = 0; k<get(inRow, 'qty'); k++) {
			outRows.push(
				addLine(
					get(inRow, 'color'), 
					currentPosition.x, 
					currentPosition.y, 
					currentPosition.z, 
					get(inRow, 'part')
				)
			)
		}

		currentPosition = nextPosition(currentPosition, DIMENSIONS);

    })
    .on('end', rowCount => {
    	console.log(`Parsed ${rowCount} rows`)


		// Write to file
		writeToPath(FILE_NAME, outRows, { delimiter: ' ' })
		    .on('error', err => console.error(err))
		    .on('finish', () => console.log('Done writing.'));



    });


