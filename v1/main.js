/* Game parameters. */
var Rows = 9 ;
var Cols = 9 ;
var over = false;
var mines = 10;
var spacesLeft = Rows*Cols - mines;
var initial = true;

/* Game models. */
var Board = document.getElementById("board") ;
var Cells = [] ;

// Returns an array of the cell's neighbors
function neighbors() {
    var n = [] ;
    for (var i = -1; i <= 1; ++i)
        for (var j = -1; j <= 1; ++j) {
            if (Cells[this.row+i] && Cells[this.row+i][this.col+j] && !(i == 0 && j == 0))
                n.push(Cells[this.row+i][this.col+j]) ;
        }
    return n; 
}

// Returns the number of neighboring mines
function neighboringMines() {
    var n = this.neighbors() ;
    var count = 0 ;
    for (var i = 0; i < n.length; ++i) {
        if (n[i].hasMine)
            ++count ;
    }
    return count ;
}   

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
}

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
            Show(n[i]);
        }
        
    }
}

// Determines the image/text of the cell when it is clicked
function Show(cell) {
    if (!cell.visible) {
        var img;
        if (cell.hasMine) {
            img = "X";
            cell.style.backgroundColor = "red";
        }
        else {
            cell.style.backgroundColor = "white";
            img = cell.neighboringMines();
            switch(img) {
                case 0:
                    img = "<span></span>"; break;
                case 1:
                    cell.style.color = "green"; break;
                case 2:
                    cell.style.color = "blue"; break;
                case 3:
                    cell.style.color = "#ff8000"; break; // orange
                case 4:
                    cell.style.color = "red"; break;
                case 5:
                    cell.style.color = "brown"; break;
                default: 
                    cell.style.color = "black";
            }
        }
        
        spacesLeft--;
        cell.visible = true;
        cell.innerHTML = img;
        $("#spaces").text("Spaces left: " + spacesLeft); 
    }
};

// When a key is pressed?
function HandleKeyPress(event) {
    // console.log(event); 
    switch (event.charCode) {
        case 68: // D for Debug
            Debug();
            break ;

        case 102: // F
      // Toggle flag on/off.
            break ;
    }
}

document.onkeypress = HandleKeyPress ;
  
// Generates the board
function generateBoard() {
    $("#board").empty();

    for (var i = 0; i < Rows; ++i) {
        var row = document.createElement("tr") ;
        Cells[i] = [] ;
        Board.appendChild(row) ;
        for (var j = 0; j < Cols; ++j) {
            var cell = document.createElement("td") ;
            cell.innerHTML = "<span></span>" ;
            cell.style.backgroundColor = "gray";

            cell.row = i;
            cell.col = j;
            cell.visible = false;
            cell.hasFlag = false;
            cell.hasMine = false;
            cell.onclick = HandleCellClick ;
      
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
    $("#spaces").hide();
};

// Starts a new game
$("#start").click(function() {
    $("#message").text("Avoid the mines");

    generateBoard();
    initial = true;
    over = false;
    spacesLeft = Rows*Cols - mines;
    $("#spaces").text("Spaces left: " + spacesLeft);
    $("#spaces").show();
});
