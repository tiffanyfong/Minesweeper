/* Game parameters. */
var Rows;
var Cols;
var over;
var mines;
var spacesLeft;
var initial;

/* Colors and images */
var numbers = ["black", "#2AD12A", "#5EDAFF", "#FFAC40", "#FF0000"];
var unrevealed = "#003A69";
var revealed = "#004F82";
var zero = "#106094";
var mineRed = "#DB1F1F";
var mineImage = "url(img/Mine_Icon.png)";


/* Game models. */
var Board = document.getElementById("board") ;
var Cells;

// Returns an array of the cell's neighbors
function neighbors() {
    var n = [] ;
    for (var i = -1; i <= 1; ++i)
        for (var j = -1; j <= 1; ++j) {
            if (Cells[this.row+i] && Cells[this.row+i][this.col+j] && !(i == 0 && j == 0))
                n.push(Cells[this.row+i][this.col+j]) ;
        }
    return n; 
};

// Returns the number of neighboring mines
function neighboringMines() {
    var n = this.neighbors();
    var count = 0;
    for (var i = 0; i < n.length; ++i) {
        if (n[i].hasMine)
            ++count;
    }
    return count;
};  

// When a cell is clicked
function HandleCellClick(event) {
    cell = event.target ;
    if (initial) {
        initial = false;
        generateMines(cell.row, cell.col);
        Sweep(cell);
    }
    else if (!over) {
        if (cell.hasMine)
            GameOver(0);
        else if (cell.neighboringMines() === 0)
            Sweep(cell);
        else
            Show(cell);
    }
    
    if (!over && spacesLeft === 0)
        GameOver(1);
};

// Clearing multiple cells
function Sweep(sweepCell) {
    var stack = new Array();
    stack.push(sweepCell);

    while(stack.length > 0) {
        var cell = stack.pop();
        var n = cell.neighbors();
        Show(cell);
        for (var i = 0; i < n.length; i++) {
            if (!n[i].visible && n[i].neighboringMines() === 0)
                stack.push(n[i]);
            else if (!n[i].visible)
                Show(n[i]);
        }
        
    }
};

// Determines the image/text of the cell when it is clicked
function Show(cell) {
    if (!cell.visible) {
        var img = cell.neighboringMines();
        if (cell.hasMine) {
            img = "<span></span>";
            cell.style.backgroundImage = mineImage;
            cell.style.backgroundColor = mineRed;
            cell.style.backgroundSize = "100% 100%";
            cell.style.textShadow = "none";
            spacesLeft++;
        }
        else {
            cell.style.color = numbers[Math.min(4,img)];
            if (img === 0) {
                cell.style.backgroundColor = zero;
                img = "<span></span>";
            }
            else {
                cell.style.backgroundColor = revealed;
            }
        }
        
        spacesLeft--;
        cell.visible = true;
        cell.innerHTML = img;
        $("#spaces").text("Spaces left: " + spacesLeft); 
    }
};

// Generates the board
function generateBoard() {
    // clears board
    $("#board").empty();
    Cells = [];

    for (var i = 0; i < Rows; ++i) {
        var row = document.createElement("tr") ;
        Cells[i] = [] ;
        Board.appendChild(row) ;
        for (var j = 0; j < Cols; ++j) {
            var cell = document.createElement("td") ;
            cell.innerHTML = "<span></span>" ;
            cell.style.backgroundColor = unrevealed;

            cell.row = i;
            cell.col = j;
            cell.visible = false;
            cell.hasFlag = false;
            cell.hasMine = false;
            cell.onclick = HandleCellClick ;
            cell.hover = 
      
            Cells[i][j] = cell ;
            row.appendChild(cell) ;
        }
    }
};

// Generates mines
function generateMines(startRow, startCol) {
    var countMines = mines;
    var i, j;
    
    while (countMines > 0) {
        i = Math.floor(Math.random() * Rows);
        j = Math.floor(Math.random() * Cols);
        if (!(Cells[i][j].hasMine) && GenerateValid(i,j,startRow,startCol)) {
            Cells[i][j].hasMine = true;
            countMines--;
        }
    }
    for (var i = 0; i < Rows; i++) {
        for (var j = 0; j < Cols; j++) {
            Cells[i][j].neighbors = neighbors;
            Cells[i][j].neighboringMines = neighboringMines;
        }
    }
};

function GenerateValid(genRow, genCol, r, c) {
    if (genRow >= r-1 && genRow <= r+1 && genCol >= c-1 && genCol <= c+1)
        return false;
    return true;
};

// Endgame
function GameOver(win) {
    if (win === 1) {
        $("#message").text("Congrats! You win!");
    }
    else {
        $("#message").text("YOU LOSE. YOU GET NOTHING");
        for (var i = 0; i < Rows; i++) {
            for (var j = 0; j < Cols; j++) {
                if (Cells[i][j].hasMine)
                    Show(Cells[i][j]);
            }
        }
    }
    over = true;
};

// Sets and checks validity of custom board sizes and mines
function custom(form) {
    var r = form.elements[0].value;
    var c = form.elements[1].value;
    var m = form.elements[2].value;

    if (r < 8 || r > 20) {
        alert("Number of rows must be between 8 and 20. Creating 8 rows");
        Rows = 8;
        form.elements[0].value = 8;
    }
    else
        Rows = r;

    if (c < 8 || c > 20) {
        alert("Number of columns must be between 8 and 20. Creating 8 columns");
        Cols = 8;
        form.elements[1].value = 8;
    }
    else
        Cols = c;

    if (m < 8 || m > Math.floor(Rows*Cols/4)) {
        alert("Number of mines must be between 8 and " + Math.floor(Rows*Cols/4) + ". Setting 8 mines");
        mines = 8;
        form.elements[2].value = 8;
    }
    else
        mines = m;

    spacesLeft = Rows*Cols - mines;

    // adjust footer to stay on bottom
    //document.getElementById("footer").style.bottom = (-37*(Rows-8)).toString() + "px";
};

$("#start").click(function() {
    $("#message").text("Avoid the mines");

    // Custom board size and mines
    custom(document.getElementById("customize"));

    generateBoard(); // clears and generates mines
    initial = true;
    over = false;
    $("#spaces").text("Spaces left: " + spacesLeft);
});

// Starts a new game
function main() {
    $("#start").click();
};

$(document).ready(main);
/* http://matt.might.net/articles/learning-javascript-in-small-bites-part-4/ */
