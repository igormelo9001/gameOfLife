const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resolution = 10;
canvas.width = 800;
canvas.height = 600;
const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

let grid = buildGrid();
let generations = 0;
const generationCounter = document.getElementById('generation-counter');
let zoomFactor = 1; // Fator inicial de zoom (1 = sem zoom)
const zoomSpeed = 0.01; // Velocidade de zoom
const minZoomFactor = 0.1; // Fator de zoom mínimo

// Função para criar o tabuleiro vazio
function buildGrid() {
  return new Array(COLS).fill(null)
    .map(() => new Array(ROWS).fill(0));
}

// Função para desenhar o tabuleiro com zoom out gradual
function render(grid) {
  ctx.save(); // Salva o estado do contexto

  // Aplica o zoom e centraliza o canvas
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(zoomFactor, zoomFactor);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);

  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      const cell = grid[col][row];
      ctx.beginPath();
      ctx.rect(col * resolution, row * resolution, resolution, resolution);
      ctx.fillStyle = cell === 2 ? 'blue' : (cell === 1 ? 'green' : 'white');
      ctx.fill();
      ctx.stroke();
    }
  }

  ctx.restore(); // Restaura o estado do contexto
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

      // Condições para aminoácidos e proteínas
      if (cell === 1 && numNeighbors < 2) {
        nextGen[col][row] = 0; // Aminoácido morre
      } else if (cell === 1 && numNeighbors > 3) {
        nextGen[col][row] = 0; // Aminoácido morre
      } else if (cell === 0 && numNeighbors === 3) {
        nextGen[col][row] = 1; // Aminoácido nasce
      } else {
        nextGen[col][row] = cell;
      }

      // Transformar um grupo de aminoácidos em proteína (azul) sem sair do grid
      if (numNeighbors >= 4) {
        if (col > 0 && col < COLS - 1 && row > 0 && row < ROWS - 1) {
          nextGen[col][row] = 2; // Proteína
        }
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

// Função para ajustar o intervalo de atualização e aplicar o zoom out gradual
function update() {
  grid = nextGeneration(grid);

  // Renderiza a nova geração
  render(grid);

  // Atualiza o contador de gerações
  generations++;
  generationCounter.innerText = `Generations: ${generations}`;

  // Aplica o zoom out gradual
  zoomFactor -= zoomSpeed;
  if (zoomFactor < minZoomFactor) { // Limite mínimo para o zoom
    zoomFactor = minZoomFactor; // Impede o zoom de diminuir demais
  }

  // Atualiza o próximo frame
  setTimeout(() => requestAnimationFrame(update), 50); // Ajuste o intervalo aqui
}

// Inicializa o jogo com alguns aminoácidos aleatórios
function seedGrid() {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      grid[col][row] = Math.floor(Math.random() * 2);
    }
  }
}

// Iniciar o jogo
seedGrid();
update(); // Inicia a simulação
