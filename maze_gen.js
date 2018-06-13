/** JavaScript DFS maze-generator
 * @author	Russell Estes
 * @date	06-10-2018
 * This software is produced as open-source
 * and released under the Mozilla Public License (2.0).
*/


// TODO:

// 1. maze map should store bitwise value to indicate open doors
// 2. after maze is generated, load maze_map[][] into JSON
// 3. write method to generate maze by feeding JSON
// 4. write method to solve maze
// 5. add objects to maze
// 6. add animation and effects to maze




 
 
/** Global Variables **/
// used to store map for easy traversal
var maze_map = [];

// used to track visited cells - prevents cycles
var visited_list = ["-1x-1"];

// Using an enum simplifies the process of randomizing/shuffling
// directions to traverse.

var DIRECTION = Object.freeze({
    "N": 0,
    "S": 1,
    "E": 2,
    "W": 3
});


//~ console.log(JSON.stringify(DIRECTION));
//~ var objDirs = JSON.parse({"N":0, "S":1, "E":2, "W":3});
//~ var DIRECTION2 = JSON.parse(JSON.stringify(DIRECTION));



/** Function init() 
 * Gets user input, initializes maze_map[][], and calls gen_maze()
 */					
function init() {

    // get inputs
    var rows = document.getElementById("input_height").value;
    var cols = document.getElementById("input_width").value;

    // initialize maze map
    for (var i = 0; i < rows; i++) {
        maze_map.push(new Array(cols));
        for (var j = 0; j < cols; j++) {
            maze_map[i][j] = 0;
        }
    }

    // Generate grid
    gen_maze(rows, cols);

	// Carve maze through grid
	carve_maze("0x0");


}


/** Function gen_maze(rows, cols)
 * Generates a grid of cells which form the fundamental
 * structure of a maze.
 * 
 * @param	rows	Number of rows to include in the grid.
 * @param	cols	Number of columns to include in the grid.
 * 
 * 
 */

function gen_maze(rows, cols) {
    // cells are 30px each having left and right borders
    // of 1px each. Total maze width is then:
    maze_width = cols * 32;

    // create fill area to insert cells,
    // then set id & class
    var maze_container = document.createElement('div');
    maze_container.setAttribute("id", "maze_container");
    document.body.appendChild(maze_container);
    document.body.replaceChild(maze_container, maze_container);
    maze_container.style.width = maze_width + "px";

    // generate grid having rows x cols
    for (var i = 0; i < rows; i++) {
        // Create first row...
        var row = document.createElement('div');
        row.setAttribute("class", "row");
        maze_container.appendChild(row);
        row.style.width = maze_width + "px";

        // Fill row with cells...
        for (var j = 0; j < cols; j++) {
            var temp = document.createElement('span');

            // We want to be able to identify individual cells,
            // so assign each an ID having form "row# col#"
            var id_string = i + "x" + j;
            temp.setAttribute("id", id_string);
            temp.setAttribute("class", "cell");
            row.appendChild(temp);

            // Map the maze
            maze_map[i][j] = id_string;
        }
    }
} // end gen_maze()



/** Function carve_maze(current_cell_index)
 * Carves a path from starting cell at 0x0 to a 
 * random endpoint.
 * 
 * @param	current_cell_index	The index of the current cell
 * 								having form '1x4' where 1 is the row
 * 								number and 4 is the column number. 
 */
function carve_maze(current_cell_index) {

    /** Depth-first traversal
	*
	* Steps:
	*
	*	1)	Choose a starting point in the field.
	*	2)	Randomly choose a wall at that point and carve
	*		a passage through to the adjacent cell, but only
	* 		if the adjacent cell has not been visited yet.
	* 		This becomes the new current cell.
	* 	3)	If all adjacent cells have been visited, back up
	* 		to the last cell that has uncarved walls and repeat.
	* 	4)	The algorithm ends when the process has backed all
	* 		the way up to the starting point.
    *	
    * Source:
    * 	http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
    **/

	// randomize a list of four directions 
	// TODO: At most, only three directions are possible.
    var directions = shuffle([DIRECTION.N, DIRECTION.S, DIRECTION.E, DIRECTION.W]);
    
		for (var i = 0; i < directions.length; i++) {
	        var new_cell_index = getNeighbor(current_cell_index, directions[i]);
	        if (new_cell_index != "-1x-1") {
	            // remove borders between cells...
	            open(current_cell_index, new_cell_index, directions[i]);
	            carve_maze(new_cell_index);
	        }
	        else {	// neighboring cell is invalid. Try next.
				continue;
			}
	    }
} // end carve_maze




/** Function getNeighbor(current_cell_index, direction)
 * Returns maze_map[][] index of current_cell_index's <direction> neighbor,
 * 
 * @param          current_cell_index	maze_map[][] index of current cell
 * @param          direction			Direction to look for neighbor.  
 * @return         new_cell_index		maze_map index value of neighboring cell
 * 										value is of form "row col" where 'row' and
 * 										'col' are integers.
 */

function getNeighbor(current_cell_index, direction) {

    var new_cell_index;
    var temp = current_cell_index.split("x");
    var row = Number(temp[0]);
    var col = Number(temp[1]);
   
	//~ // DEBUG
	//~ alert("row: " + row + ", col: " + col);
    switch (direction) {
        case DIRECTION.N: // North
            {
				if ((row-1) >= 0 && (row-1) < maze_map.length) {
					if (col >= 0 && col < maze_map[0].length) {
		                if (!visited_list.includes(maze_map[row-1][col])) {
		                    new_cell_index = maze_map[row-1][col];
		                    visited_list.push(new_cell_index);
		                    //~ // DEBUG
							//~ alert("(North) new_cell_index: " + new_cell_index);
		                    return new_cell_index;
						} 
						else {
							new_cell_index = "-1x-1";
						}
					} 
					else {
						new_cell_index = "-1x-1";
					}
                } 
                else { 
                    new_cell_index = "-1x-1";
                }
                return new_cell_index;
                break;
            }
        case DIRECTION.S: // South
            {
				if ((row+1) >= 0 && (row+1) < maze_map.length) {
					if (col >= 0 && col < maze_map[0].length) {
		                if (!(visited_list.includes(maze_map[row+1][col]))) {
		                    new_cell_index = maze_map[row+1][col];
							visited_list.push(new_cell_index);
							//~ // DEBUG
							//~ alert("(South) new_cell_index: " + new_cell_index);
		                    return new_cell_index;
						} 
						else {
							new_cell_index = "-1x-1";
						}visited_list
					} 
					else {
						new_cell_index = "-1x-1";
					}
                } 
                else { 
                    new_cell_index = "-1x-1";
                }
                return new_cell_index;
                break;
            }
        case DIRECTION.E: // East
            {
				if (row >= 0 && row < maze_map.length) {
					if ((col+1) >= 0 && (col+1) < maze_map[0].length) {
		                if (!visited_list.includes(maze_map[row][col+1])) {
		                    new_cell_index = maze_map[row][col+1];
		                    visited_list.push(new_cell_index);
		                    //~ // DEBUG
							//~ alert("(East) new_cell_index: " + new_cell_index);
		                    return new_cell_index;
						} 
						else {
							new_cell_index = "-1x-1";
						}
					} 
					else {
						new_cell_index = "-1x-1";
					}
                } 
                else { 
                    new_cell_index = "-1x-1";
                }
                return new_cell_index;
                break;
            }
        case DIRECTION.W: // West
            {
				if (row >= 0 && row < maze_map.length) {
					if ((col-1) >= 0 && (col-1) < maze_map[0].length) {
		                if (!visited_list.includes(maze_map[row][col-1])) {
		                    new_cell_index = maze_map[row][col-1];
		                    visited_list.push(new_cell_index);
		                    //~ // DEBUG
							//~ alert("(West) new_cell_index: " + new_cell_index);
		                    return new_cell_index;
						} 
						else {
							new_cell_index = "-1x-1";
						}
					} 
					else {
						new_cell_index = "-1x-1";
					}
                } 
                else { 
                    new_cell_index = "-1x-1";
                }
                return new_cell_index;                
                break;
            }
        default: // Invalid input
            {
                new_cell_index = "-1x-1";
            }
            return new_cell_index;
    }

}


/** Function open(current_cell_index, new_cell_index, direction)
 * Opens walls standing between two cells.
 * 
 *
 * @param	current_cell_index	index of starting cell
 * @param	new_cell_index		index of ending cell
 * @param	direction			direction from current cell to open
 *
 */

function open(current_cell_index, new_cell_index, direction) {
	

	
	var current_cell = document.getElementById(current_cell_index);
	var new_cell = document.getElementById(new_cell_index);
	

	


	switch (direction) {
		case DIRECTION.N:
		{
			current_cell.className += " openNorth";
			new_cell.className += " openSouth";
			break;
		}
		case DIRECTION.S:
		{
			current_cell.className += " openSouth";
			new_cell.className += " openNorth";
			break;
		}
		case DIRECTION.E:
		{
			current_cell.className += " openEast";
			new_cell.className += " openWest";
			break;
		}
		case DIRECTION.W:
		{
			current_cell.className += " openWest";
			new_cell.className += " openEast";
			break;
		}
	}

    
    
}	// end open()


// *********************
/** Helper functions **/
// *********************



/** Function shuffle(directions)
 * Shuffles an array of 4 integers
 *
 * @param	directions				Contains 4 integers representing
 * 									four possible directions on a grid
 *									in no particular order: N, S, E, and W.
 * @return	directions_randomized	An array of shuffled integer values.
 * 
 */

function shuffle(directions) {

var directions_randomized = [];
var max = Math.max(...directions);
var min = Math.min(...directions);	// what about negative values??

	for (var i = 0; i < directions.length; i++) {
		var random_int = Math.floor(Math.random() * (max - min + 1) ) + min;
		if (directions_randomized.includes(random_int)) {
			i--;
		} 
		else {
			directions_randomized.push(random_int);
		}
	}
	return directions_randomized;
}


