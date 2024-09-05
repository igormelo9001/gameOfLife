const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resolution = 10;
canvas.width = 800;
canvas.height = 600;
const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

let grid = buildGrid();
let previousGrid; // Guardar a geração anterior
let generations = 0;
let staticGenerations = 0; // Contador de gerações estáticas
const maxStaticGenerations = 430; // Limite de 430 gerações estáticas

// Atualizar o contador de gerações
const generationCounter = document.getElementById('generation-counter');

// Função para criar o tabuleiro vazio
function buildGrid() {
  return new Array(COLS).fill(null)
    .map(() => new Array(ROWS).fill(0));
}

// Função para desenhar o tabuleiro
function render(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = cell ? 'white' : 'black';
      ctx.fill();
      ctx.stroke();
    }
  }
}

// Função para copiar o tabuleiro
function copyGrid(grid) {
  return grid.map(arr => [...arr]);
}

// Função para gerar a próxima geração
function nextGeneration(grid) {
  const nextGen = buildGrid();

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      const numNeighbors = countNeighbors(grid, col, row);

      // Aplicando as regras do Jogo da Vida
      if (cell === 1 && numNeighbors < 2) {
        nextGen[col][row] = 0;
      } else if (cell === 1 && numNeighbors > 3) {
        nextGen[col][row] = 0;
      } else if (cell === 0 && numNeighbors === 3) {
        nextGen[col][row] = 1;
      } else {
        nextGen[col][row] = cell;
      }
    }
  }
  return nextGen;
}

// Função para contar os vizinhos
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

// Função para adicionar movimento aleatório
function addRandomMovement(grid) {
  const randomCol = Math.floor(Math.random() * COLS);
  const randomRow = Math.floor(Math.random() * ROWS);
  grid[randomCol][randomRow] = grid[randomCol][randomRow] ? 0 : 1; // Alterna o estado da célula
}

// Loop de animação
function update() {
  // Verifica se o tabuleiro está estático
  if (previousGrid && JSON.stringify(grid) === JSON.stringify(previousGrid)) {
    staticGenerations++; // Incrementa o contador de gerações estáticas
    if (staticGenerations >= maxStaticGenerations) {
      // Adiciona movimento aleatório quando atinge o limite de 430 gerações estáticas
      addRandomMovement(grid);
      staticGenerations = 0; // Reinicia o contador de gerações estáticas
    }
  } else {
    // Se o tabuleiro não está estático, segue para a próxima geração
    previousGrid = copyGrid(grid);
    staticGenerations = 0; // Reinicia o contador se o tabuleiro mudar
    grid = nextGeneration(grid);
  }

  // Renderiza a nova geração
  render(grid);

  // Atualiza o contador de gerações
  generations++;
  generationCounter.innerText = `Generations: ${generations}`;

  requestAnimationFrame(update);
}

// Inicializa o jogo com algumas células aleatórias
function seedGrid() {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      grid[col][row] = Math.floor(Math.random() * 2);
    }
  }
}

// Iniciar o jogo
seedGrid();
requestAnimationFrame(update);
