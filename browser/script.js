const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const CELL_SIZE = 10; // Tamanho de cada célula
const WIDTH = 60;     // Número de células na largura
const HEIGHT = 40;    // Número de células na altura
canvas.width = WIDTH * CELL_SIZE;
canvas.height = HEIGHT * CELL_SIZE;

let grid = createGrid(WIDTH, HEIGHT);
let generation = 0;

// Função para criar o grid inicial aleatório
function createGrid(width, height) {
  return Array.from({ length: height }, () =>
    Array.from({ length: width }, () => Math.random() > 0.7 ? 1 : 0)
  );
}

// Função para desenhar o grid no canvas
function drawGrid(grid) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
  for (let row = 0; row < HEIGHT; row++) {
    for (let col = 0; col < WIDTH; col++) {
      ctx.fillStyle = grid[row][col] === 1 ? 'white' : 'black';
      ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    }
  }
}

// Função para contar os vizinhos vivos de uma célula
function countNeighbors(grid, x, y) {
  let neighbors = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      if (i === 0 && j === 0) continue; // Ignora a célula atual
      const row = (x + i + HEIGHT) % HEIGHT; // Garantir que não sai da borda
      const col = (y + j + WIDTH) % WIDTH;   // Grid toroidal (volta no outro lado)
      neighbors += grid[row][col];
    }
  }
  return neighbors;
}

// Função para calcular a próxima geração
function nextGeneration(grid) {
  const newGrid = grid.map(arr => [...arr]);
  for (let row = 0; row < HEIGHT; row++) {
    for (let col = 0; col < WIDTH; col++) {
      const aliveNeighbors = countNeighbors(grid, row, col);
      if (grid[row][col] === 1) {
        if (aliveNeighbors < 2 || aliveNeighbors > 3) {
          newGrid[row][col] = 0; // Morre por solidão ou superpopulação
        }
      } else {
        if (aliveNeighbors === 3) {
          newGrid[row][col] = 1; // Nasce nova célula
        }
      }
    }
  }
  return newGrid;
}

// Função para rodar o jogo de forma contínua
function gameLoop() {
  drawGrid(grid);
  grid = nextGeneration(grid);
  generation++;
  document.getElementById('generation-counter').textContent = `Generations: ${generation}`;
  setTimeout(gameLoop, 100); // Chama o próximo frame a cada 100ms
}

// Inicia o jogo
gameLoop();
