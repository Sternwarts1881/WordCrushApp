import { CellInformation, CellPosition } from "../app/(GameScreen)/gameScreen";

export const CellRemover = {
    removeSelectedCells: function (selectedCells: CellPosition[], grid: CellInformation[][]) {
        for (let cells of selectedCells) {
            grid[cells.row][cells.col] = { cellValue: '', powerUp: '' };
        };

        return grid;
    },

    moveCellsDown: function (grid: CellInformation[][], gridSize: number) {
        for (let col = 0; col < gridSize; col++) {

            for (let row = gridSize - 1; row >= 0; row--) {

                if (grid[row][col].cellValue === '') {

                    for (let j = row - 1; j >= 0; j--) {
                        if (grid[j][col].cellValue !== '') {
                            grid[row][col] = grid[j][col];
                            
                            grid[j][col] = { cellValue: '', powerUp: '' };


                            break;
                        };
                    };
                };
            };
        };
        return grid;
    },

    handleCellRemoval: function (selectedCells: CellPosition[], grid: CellInformation[][], gridSize: number) {
        grid = this.removeSelectedCells(selectedCells, grid);
        grid = this.moveCellsDown(grid, gridSize);
      
        const yeniGrid = grid.map(row => [...row]);
        return yeniGrid;
    }



}


