import { CellPosition } from "../app/(GameScreen)/gameScreen";

export const CellRemover =  {
    removeSelectedCells: function(selectedCells: CellPosition[], grid:string[][]) {
        for(let cells of selectedCells){
            grid[cells.row][cells.col] = '';
        };
        return grid;
    }


}


