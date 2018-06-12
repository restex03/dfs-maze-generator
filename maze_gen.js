


// TODO:
// 1. finish carve_maze()
// 2. write open() method
// 3. maze map should store bitwise value to indicate open doors
// 4. after maze is generated, load maze_map[][] into JSON
// 5. write method to generate maze by feeding JSON
// 6. write method to solve maze
// 7. add objects to maze
// 8. add animation and effects to maze



/** JavaScript DFS maze-generator
 * @author	Russell Estes
 * @date	06-10-2018
 * This software is produced as open-source
 * and released under the Mozilla Public License.
*/
 
 
/** Global Variables **/
// used to store map for easy traversal
var maze_map = [];

// used to track visited cells - prevents cycles
var visited_list = [];

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

    // call function to generate maze
    gen_maze(rows, cols);

    // call function to carve maze, pass cell 0x0
    // carve_maze("0x0");



}




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
    // DEBUG ONLY
    var target_cell_test = window.prompt("Enter cell (eg. '0x0')", "5x4");
    document.getElementById(target_cell_test).innerHTML = "X";

} // end gen_maze()




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


    // Be sure to pass direction values as DIRECTION.N/S/E/W          

    // Step 1 - starting cell is passed as parameter to carve_maze

    // Step 2
    var directions = shuffle([DIRECTION.N, DIRECTION.S, DIRECTION.E, DIRECTION.W]);

    for (var i = 0; i < directions.length; i++) {
        if (getNeighbor(current_cell_index, direction[i]) != "-1x-1") {
            var new_cell_index = getNeighbor(current_cell_index, direction[i]);

            // remove borders between cells...
            var current_cell = document.getElementById("current_cell_index");
            var new_cell = document.getElementById("new_cell_index");

            // remove walls in getNeighbor ??????????????????
        }

        // make neighbor the new_cell_index;
        // mark new_cell_index as visited
    }

    carve_maze(new_cell_index);

} // end carve_maze




/** Function getNeighbor(current_cell_index, direction) -
 * returns maze_map[][] index of current_cell_index's <direction> neighbor,
 * 
 * @param          current_cell_index	maze_map[][] index of current cell
 * @param          direction			Direction to look for neighbor.  
 * @return          new_cell_index		maze_map index value of neighboring cell
 * 										value is of form "row col" where 'row' and
 * 										'col' are integers.
 */

function getNeighbor(current_cell_index, direction) {

    var new_cell_index;
    var temp = current_cell_index.split("x");
    var row = temp[0];
    var col = temp[1];

    alert(temp[0] + ", " + temp[1]);



    switch (direction) {
        case N: // North
            {
                if (maze_map[row - 1][col] && !visited_list.includes(maze_map[row - 1][col])) {
                    new_cell_index = maze_map[row - 1][col];
                    return new_cell_index;
                } else { // Northern cell is not valid
                    new_cell_index = "-1x-1";
                }
                break;
            }
        case S: // South
            {
                if (maze_map[row + 1][col] && !visited_list.includes(maze_map[row + 1][col])) {
                    new_cell_index = maze_map[row + 1][col];
                    return new_cell_index;
                } else { // Southern cell is not valid
                    new_cell_index = "-1x-1";
                }
                break;
            }
        case E: // East
            {
                if (maze_map[row][col + 1] && !visited_list.includes(maze_map[row][col + 1])) {
                    new_cell_index = maze_map[row][col + 1];
                    return new_cell_index;
                } else { // Eastern cell is not valid
                    new_cell_index = "-1x-1";
                }
                break;
            }
        case W: // West
            {
                if (maze_map[row][col - 1] && !visited_list.includes(maze_map[row][col - 1])) {
                    new_cell_index = maze_map[row][col - 1];
                    return new_cell_index;
                } else { // Western cell is not valid
                    new_cell_index = "-1x-1";
                }
                break;
            }
        default: // Invalid input
            {
                new_cell_index = "-1x-1";
            }
            return new_cell_index;
    }

    // RETURN... .WHAT?

}


/** Function open(current_cell_index, new_cell_index)
 * Opens walls standing between two cells.
 * 
 *
 * @param	current_cell_index	starting cell
 * @param	new_cell_index		ending cell
 *
 */

function open(current_cell, new_cell) {
    // do stuff...
}


// *********************
/** Helper functions **/
// *********************



/** Function shuffle(directions) - shuffles an array of 4 integers
 *
 * @param	directions	Contains 4 integers representing
 * 						four possible directions on a grid
 *						in no particular order: N, S, E, and W.
 * @return	directions	An array of shuffled integer values
 * 
 */

function shuffle(directions) {
    for (var i = 3; i > 0; i--) {
        j = Math.floor(Math.random() * (4 - 0));
        if (j == i) continue;
        var t = directions[j];
        directions[j] = directions[i];
        directions[i] = t;
    }
    return directions;
} // end shuffle()




/** The MIT License


Copyright (c) 2011 Dominic Tarr


Permission is hereby granted, free of charge,
to any person obtaining a copy of this software and
associated documentation files (the "Software"), to
deal in the Software without restriction, including
without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom
the Software is furnished to do so,
subject to the following conditions:


The above copyright notice and this permission notice
shall be included in all copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR
ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

**/
