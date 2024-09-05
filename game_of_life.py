import random
import os
import time

# Dimensões do grid
WIDTH = 20
HEIGHT = 20

def create_grid(width, height):
    """Cria um grid inicial aleatório."""
    return [[random.choice([0, 1]) for _ in range(width)] for _ in range(height)]

def display_grid(grid):
    """Exibe o grid no terminal."""
    os.system('cls' if os.name == 'nt' else 'clear')  # Limpa a tela
    for row in grid:
        print(' '.join(['█' if cell else ' ' for cell in row]))

def count_neighbors(grid, x, y):
    """Conta o número de vizinhos vivos ao redor de uma célula."""
    neighbors = 0
    for i in range(-1, 2):
        for j in range(-1, 2):
            if i == 0 and j == 0:
                continue
            if 0 <= x + i < len(grid) and 0 <= y + j < len(grid[0]):
                neighbors += grid[x + i][y + j]
    return neighbors

def next_generation(grid):
    """Gera a próxima geração do grid."""
    new_grid = [[0 for _ in range(WIDTH)] for _ in range(HEIGHT)]
    for i in range(HEIGHT):
        for j in range(WIDTH):
            alive_neighbors = count_neighbors(grid, i, j)
            if grid[i][j] == 1 and (alive_neighbors == 2 or alive_neighbors == 3):
                new_grid[i][j] = 1
            elif grid[i][j] == 0 and alive_neighbors == 3:
                new_grid[i][j] = 1
            else:
                new_grid[i][j] = 0
    return new_grid

def main():
    grid = create_grid(WIDTH, HEIGHT)
    while True:
        display_grid(grid)
        grid = next_generation(grid)
        time.sleep(0.5)

if __name__ == "__main__":
    main()
