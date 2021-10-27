const fs = require('fs');
const csv = require('@fast-csv/parse');
const { writeToPath } = require('@fast-csv/format');


const FILE_NAME= 'yop.ldr'
const FILE_AUTHOR= 'change_author'
const DIMENSIONS = {
	x_min: 0,
	x_max: 500,
	x_step: 50,
	y_min: 0,
	y_step: 50,
	z_value: 0
}

function addLine(_color, _x, _y, _z, _partNo) {
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
	console.log(JSON.stringify(postition))
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
	
		currentPosition = nextPosition(currentPosition, DIMENSIONS);

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
    })
    .on('end', rowCount => {
    	console.log(`Parsed ${rowCount} rows`)


		// Write to file
		writeToPath(FILE_NAME, outRows, { delimiter: ' ' })
		    .on('error', err => console.error(err))
		    .on('finish', () => console.log('Done writing.'));



    });


