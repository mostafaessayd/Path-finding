var visited = [];
var path = [];
var startCell = [0, 0];
var endCell = [4, 9];
var grid = [];
let matrixContainer;
var found = false;
var Battery = 100;
var cost = [];
var cur = 0;
document.getElementById("matrixForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const columns = parseInt(document.getElementById("columns").value);
    const rows = parseInt(document.getElementById("rows").value);

    path = [];
    visited = [];
    cost = [];
    found = false;
    Battery = 100;
    grid = [];
    cur = 0;

    generateMatrix(columns, rows);
    
    console.log(Battery);
});

function f() {
    generateMatrix(columns, rows);   
}
function generateMatrix(columns, rows) {

      startCell[0] = Math.floor(Math.random() * (rows));
      startCell[1] = Math.floor(Math.random() * (columns));
  
      endCell[0] = Math.floor(Math.random() * (rows));
      endCell[1] = Math.floor(Math.random() * (columns));

    // Define colors
    const colors = ["black", "green", "blue", "yellow"];

    // Generate the matrix
    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        cost[i] = [];
        for (let j = 0; j < columns; j++) {
            if (i === startCell[0] && j === startCell[1])
                grid[i][j] = "R";
            else {
                if (i === endCell[0] && j === endCell[1])
                    grid[i][j] = "T";
                else
                    grid[i][j] = colors[Math.floor(Math.random() * 4)];
            }

            cost[i][j] = 1 + Math.floor(Math.random() * 4);
        }
    }

    path.push({ x: startCell[0], y: startCell[1] });
    visited.push({ x: startCell[0], y: startCell[1] });

    matrixContainer = document.getElementById("original-matrix-container");

    matrixContainer.innerHTML = "";

    showMaze(grid);

    TracePath(startCell[0], startCell[1], rows, columns);

    cleanPath(path, visited);

    grid[startCell[0]][startCell[1]] = "chocolate";

    matrixContainer = document.getElementById("matrixContainer");

    matrixContainer.innerHTML = ""

    showMaze(grid);

    console.log(path);
    console.log(visited);
}

function heuristic(a, b) {
    var dx = Math.abs(a - endCell[0]);
    var dy = Math.abs(b - endCell[1]);
    var distance = dx + dy;
    return distance;
}

function TracePath(a, b, rows, columns) {

    // console.log('start cell x = ' + a + 'y = ' + b);

    if (a === endCell[0] && b === endCell[1]) {
        found = true;
        return;
    }

    // Extract x and y coordinates from the startCell object
    const x = a;
    const y = b;

    const nextCell = [];

    if (x + 1 >= 0 && x + 1 < rows) {
        nextCell.push({ x: x + 1, y: y });
    }
    if (x - 1 >= 0) {
        nextCell.push({ x: x - 1, y: y });
    }
    if (y + 1 >= 0 && y + 1 < columns) {
        nextCell.push({ x: x, y: y + 1 });
    }
    if (y - 1 >= 0) {
        nextCell.push({ x: x, y: y - 1 });
    }

    
    for (let i = 0; i < nextCell.length - 1; i++) {
        for (let j = i + 1; j < nextCell.length; j++) {
            if (heuristic(nextCell[i].x, nextCell[i].y) + cost[nextCell[i].x][nextCell[i].y] > heuristic(nextCell[j].x, nextCell[j].y) + cost[nextCell[j].x][nextCell[j].y]) {
                var tmp = nextCell[i];
                nextCell[i] = nextCell[j];
                nextCell[j] = tmp;
            }
        }
    }

    for (let i = 0; i < nextCell.length; i++) {
        if (grid[nextCell[i].x][nextCell[i].y] !== "black")
            if (grid[nextCell[i].x][nextCell[i].y] !== "blue" || grid[a][b] !== "blue")
                if (find(nextCell[i].x, nextCell[i].y) === false) {

                    path.push({ x: nextCell[i].x, y: nextCell[i].y });
                    visited.push({ x: nextCell[i].x, y: nextCell[i].y });

                    Battery -= cost[nextCell[i].x][nextCell[i].y];

                    if (Battery < 0){
                        Battery = 100;
                        cur++;
                    }

                    TracePath(nextCell[i].x, nextCell[i].y, rows, columns);

                    if (found === false) {
                        Battery -= cost[nextCell[i].x][nextCell[i].y];
                       // document.getElementById("Battery").innerText=Battery;

                        if (Battery < 0){
                            Battery = 100;
                            cur++;
                        }

                        path.pop();
                        visited.pop();
                    } else {
                        break;
                    }
                }
    }
}

function find(x, y) {
    for (let i = 0; i < visited.length; i++)
        if (x === visited[i].x && y === visited[i].y)
            return true;
    return false;
}

function showMaze(grid) {

    const direction = ["up-arrow-symbols.gif", "right-arrow-symbols.gif", "left-arrow-symbols.gif", "down-arrow-symbols.gif"];

    let table = '<table class="matrix-table">';    
    for (let i = 0; i < grid.length; i++) {
        table += '<tr>';
        for (let j = 0; j < grid[i].length; j++) {
            if (i === startCell[0] && j === startCell[1])
                if (!found)
                    table += '<td class = "cell"><img src = "robot-angry.gif" alt = "end"></td>';
                else
                    table += '<td class = "cell"><img src = "robot-excited.gif" alt = "end"></td>';
            else {
                if (find(i, j) === true) {
                    if (i === endCell[0] && j === endCell[1])
                        table += '<td class = "cell"><img src = "happy-emo.gif" alt = "end"></td>'
                    else
                        table += '<td class = "cell"><img src = "' + direction[getDirection(i, j)] + '"alt = "end"></td>';
                    console.log(getDirection(i, j));
                }
                else {
                    if (i === endCell[0] && j === endCell[1]) {
                        if (!found)
                            table += '<td class = "cell"><img src = "adventure-time-cry.gif" alt = "end"></td>';
                        else
                            table += '<td class = "cell"><img src = "happy-emo.gif" alt = "end"></td>';
                    }
                    else
                        table += '<td class="cell" style="background-color: ' + grid[i][j] + ';"></td>';
                }
            }
        }
        table += '</tr>';
    }
    table += '</table>';
    matrixContainer.innerHTML = table;
}

function getDirection(x, y) {
    for (let i = 1; i < path.length - 1; i++) {
        if (path[i].x === x && path[i].y === y) {
            for (let k = i + 1; k < path.length; k++) {
                if (!find(path[k].x, path[k].y))
                    continue;
                if (x > path[k].x)
                    return 0;
                if (x < path[k].x)
                    return 3;
                if (y > path[k].y)
                    return 2;
                return 1;
            }
        }
    }
}

function isAdjacentCell(Cell1, Cell2) {
    if (Math.abs(Cell1.x - Cell2.x) === 1 && Cell1.y === Cell2.y)
        return true;

    if (Math.abs(Cell1.y - Cell2.y) === 1 && Cell1.x === Cell2.x)
        return true;

    return false;
}

function getIndex(Cell) {
    for (let i = 0; i < visited.length; i++)
        if (visited[i].x === Cell.x && visited[i].y === Cell.y)
            return i;
    return -1;
}

function cleanPath(path, visited) {
    var victim = [];

    for (let i = 0; i < path.length - 1; i++) {
        if (find(path[i].x, path[i].y) === false && i > 0)
            continue;

        let j = path.length - 1;
        while (!isAdjacentCell(path[i], path[j]) && j > i) {
            j--;
        }

        if (grid[path[i].x][path[i].y] !== "blue" || grid[path[j].x][path[j].y] !== "blue")
            for (let k = i + 1; k < j; k++) {

                var ind = getIndex(path[k]);

                if (ind > -1) {
                    visited.splice(ind, 1);
                }

                // victim.push(k);
            }
    }

    for (let i = 0; i < victim.length; i++) {
        path.splice(victim[i], 1);
    }
}

function ptiority(path){
    const resulte = [];
    return resulte;
}

function showStatment(){
    var statment = Battery.toString();
    alert("Battery : " + statment + "%\n" + "time charge : " + cur);
}