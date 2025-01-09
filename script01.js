document.addEventListener("DOMContentLoaded", () => {
    const gridContainer = document.getElementById("grid-container");
    const gridSize = 4;
    let grid = [];
  
    // Initialize the grid
    function initializeGrid() {
      grid = Array(gridSize)
        .fill(null)
        .map(() => Array(gridSize).fill(0));
      gridContainer.innerHTML = ""; // Clear any existing cells
      for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        gridContainer.appendChild(cell);
      }
      spawnTile();
      spawnTile();
      updateGrid();
    }
  
    // Spawn a new tile
    function spawnTile() {
      let emptyCells = [];
      grid.forEach((row, rowIndex) =>
        row.forEach((value, colIndex) => {
          if (value === 0) emptyCells.push({ x: rowIndex, y: colIndex });
        })
      );
      if (emptyCells.length > 0) {
        const randomCell =
          emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.x][randomCell.y] = Math.random() > 0.1 ? 2 : 4;
      }
    }
  
    // Update the grid UI
    function updateGrid() {
      const cells = document.querySelectorAll(".cell");
      cells.forEach((cell, i) => {
        const x = Math.floor(i / gridSize);
        const y = i % gridSize;
        const value = grid[x][y];
        cell.textContent = value === 0 ? "" : value;
        cell.dataset.value = value;
        cell.style.backgroundColor = value > 0 ? "#f2b179" : "#eee4da";
      });
    }
  
    // Move tiles in a specific direction
    function move(direction) {
      let moved = false;
  
      if (direction === "ArrowUp") {
        moved = slideUp();
      } else if (direction === "ArrowDown") {
        moved = slideDown();
      } else if (direction === "ArrowLeft") {
        moved = slideLeft();
      } else if (direction === "ArrowRight") {
        moved = slideRight();
      }
  
      if (moved) {
        spawnTile();
        updateGrid();
        if (gameOver()) {
          setTimeout(() => {
            window.location.href = "play-again.html";
          }, 500);
        }
      }
    }
  
    // Slide tiles up
    function slideUp() {
      let moved = false;
      for (let col = 0; col < gridSize; col++) {
        let values = [];
        for (let row = 0; row < gridSize; row++) {
          if (grid[row][col] !== 0) values.push(grid[row][col]);
        }
        let merged = mergeTiles(values);
        for (let row = 0; row < gridSize; row++) {
          if (grid[row][col] !== (merged[row] || 0)) moved = true;
          grid[row][col] = merged[row] || 0;
        }
      }
      return moved;
    }
  
    // Slide tiles down
    function slideDown() {
      let moved = false;
      for (let col = 0; col < gridSize; col++) {
        let values = [];
        for (let row = gridSize - 1; row >= 0; row--) {
          if (grid[row][col] !== 0) values.push(grid[row][col]);
        }
        let merged = mergeTiles(values);
        for (let row = gridSize - 1; row >= 0; row--) {
          if (grid[row][col] !== (merged[gridSize - 1 - row] || 0)) moved = true;
          grid[row][col] = merged[gridSize - 1 - row] || 0;
        }
      }
      return moved;
    }
  
    // Slide tiles left
    function slideLeft() {
      let moved = false;
      for (let row = 0; row < gridSize; row++) {
        let values = grid[row].filter((val) => val !== 0);
        let merged = mergeTiles(values);
        for (let col = 0; col < gridSize; col++) {
          if (grid[row][col] !== (merged[col] || 0)) moved = true;
          grid[row][col] = merged[col] || 0;
        }
      }
      return moved;
    }
  
    // Slide tiles right
    function slideRight() {
      let moved = false;
      for (let row = 0; row < gridSize; row++) {
        let values = grid[row].filter((val) => val !== 0).reverse();
        let merged = mergeTiles(values);
        for (let col = gridSize - 1; col >= 0; col--) {
          if (grid[row][col] !== (merged[gridSize - 1 - col] || 0)) moved = true;
          grid[row][col] = merged[gridSize - 1 - col] || 0;
        }
      }
      return moved;
    }
  
    // Merge tiles
    function mergeTiles(values) {
      let merged = [];
      while (values.length > 0) {
        if (values.length > 1 && values[0] === values[1]) {
          merged.push(values[0] * 2);
          values.shift();
        } else {
          merged.push(values[0]);
        }
        values.shift();
      }
      return merged;
    }
  
    // Check for game over
    function gameOver() {
      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          if (grid[row][col] === 0) return false;
          if (row > 0 && grid[row][col] === grid[row - 1][col]) return false;
          if (col > 0 && grid[row][col] === grid[row][col - 1]) return false;
        }
      }
      return true;
    }
  
    // Event listener for arrow keys
    document.addEventListener("keydown", (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        move(e.key);
      }
    });
  
    initializeGrid();
  });
  