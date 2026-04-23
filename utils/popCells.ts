import { CellPosition } from "../app/(GameScreen)/gameScreen";

export const CellRemover = {
    removeSelectedCells: function (selectedCells: CellPosition[], grid: string[][]) {
        for (let cells of selectedCells) {
            grid[cells.row][cells.col] = '';
        };

        return grid;
    },

    moveCellsDown: function (grid: string[][], gridSize: number) {
        for (let col = 0; col < gridSize; col++) {

            for (let row = gridSize - 1; row >= 0; row--) {

                if (grid[row][col] === '') {

                    for (let j = row - 1; j >= 0; j--) {
                        if (grid[j][col] !== '') {
                            grid[row][col] = grid[j][col];
                            
                            grid[j][col] = '';


                            break;
                        };
                    };
                };
            };
        };
        return grid;
    },

    handleCellRemoval: function (selectedCells: CellPosition[], grid: string[][], gridSize: number) {
        grid = this.removeSelectedCells(selectedCells, grid);
        grid = this.moveCellsDown(grid, gridSize);
        //
        const yeniGrid = grid.map(row => [...row]);
        return yeniGrid;
    }



}


