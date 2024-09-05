const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resolution = 10;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const COLS = Math.floor(canvas.width / resolution);
const ROWS = Math.floor(canvas.height / resolution);

let grid = buildGrid();
let generations = 0;
const generationCounter = document.getElementById('generation-counter');

// Function to create an empty grid
function buildGrid() {
  return new Array(COLS).fill(null).map(() => new Array(ROWS).fill(0));
}

// Function to render the grid
function render(grid) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = cell === 2 ? 'blue' : (cell === 1 ? 'green' : 'black');
      ctx.fill();
      ctx.stroke();
    }
  }
}

// Function to copy the grid
function copyGrid(grid) {
  return grid.map(arr => [...arr]);
}

// Function to generate the next generation
function nextGeneration(grid) {
  const nextGen = buildGrid();
  let newProteinFound = false;
  
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      const numNeighbors = countNeighbors(grid, col, row);

      // Amino acids and proteins rules
      if (cell === 1 && numNeighbors < 2) {
        nextGen[col][row] = 0; // Amino acid dies
      } else if (cell === 1 && numNeighbors > 3) {
        nextGen[col][row] = 0; // Amino acid dies
      } else if (cell === 0 && numNeighbors === 3) {
        nextGen[col][row] = 1; // Amino acid born
      } else {
        nextGen[col][row] = cell;
      }

      // Transform a group of amino acids into a protein (blue) within grid boundaries
      if (numNeighbors >= 4) {
        if (col > 0 && col < COLS - 1 && row > 0 && row < ROWS - 1) {
          nextGen[col][row] = 2; // Protein
          newProteinFound = true;
        }
      }
    }
  }

  // If no new protein found, randomly move an existing protein
  if (!newProteinFound) {
    moveRandomProtein(nextGen);
  }

  return nextGen;
}

// Function to count neighbors
function countNeighbors(grid, col, row) {
  let sum = 0;
  const neighbors = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],         [0, 1],
    [1, -1], [1, 0], [1, 1]
  ];
  for (let i = 0; i < neighbors.length; i++) {
    const [x, y] = neighbors[i];
    const newCol = col + x;
    const newRow = row + y;

    if (newCol >= 0 && newCol < COLS && newRow >= 0 && newRow < ROWS) {
      sum += grid[newCol][newRow];
    }
  }
  return sum;
}

// Function to move a random protein to a new position
function moveRandomProtein(grid) {
  const proteinCells = [];

  // Collect all protein cells
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      if (grid[col][row] === 2) {
        proteinCells.push({ col, row });
      }
    }
  }

  if (proteinCells.length > 0) {
    const { col, row } = proteinCells[Math.floor(Math.random() * proteinCells.length)];
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    const [dx, dy] = directions[Math.floor(Math.random() * directions.length)];
    const newCol = col + dx;
    const newRow = row + dy;

    if (newCol >= 0 && newCol < COLS && newRow >= 0 && newRow < ROWS) {
      grid[col][row] = 0; // Remove protein from old position
      grid[newCol][newRow] = 2; // Place protein at new position
    }
  }
}

// Function to adjust the update interval
function update() {
  grid = nextGeneration(grid);

  // Render the new generation
  render(grid);

  // Update generation counter
  generations++;
  generationCounter.innerText = `Generations: ${generations}`;

  // Update the next frame
  setTimeout(() => requestAnimationFrame(update), 100); // Adjusted interval for smoother transition
}

// Initialize the grid with some random amino acids
function seedGrid() {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      grid[col][row] = Math.floor(Math.random() * 2);
    }
  }
}

// Start the simulation
seedGrid();
update(); // Start the simulation
