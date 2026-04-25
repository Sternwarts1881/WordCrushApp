import { CellInformation, CellPosition } from "@/app/(GameScreen)/gameScreen";
import { generateGrid } from "./gridGenerator";
import { PointCalculator } from "./pointCalculator";
import { CellRemover } from "./popCells";

export const PowerUpLogic = {
    executePowerUp: function (powerUpId: string, grid: CellInformation[][], gridSize: number, row?: number, col?: number, targetRow?: number, targetCol?: number) {
        let clonedGrid = grid.map(r => [...r]);
        let cellsToRemove: CellPosition[] = [];
        let earnedScore = 0;

        switch (powerUpId) {
            case 'sutunSilme':
                if (col != undefined) {
                    for (let r = 0; r < gridSize; r++) {
                        cellsToRemove.push({ row: r, col });
                    };

                };
                break;

            case 'satirSilme':
                if (row !== undefined) {
                    for (let c = 0; c < gridSize; c++) {
                        cellsToRemove.push({ row, col: c });
                    }
                }
                break;

            case 'alanPatlatma':
                if (row !== undefined && col !== undefined) {
                    for (let r = Math.max(0, row - 1); r <= Math.min(gridSize - 1, row + 1); r++) {
                        for (let c = Math.max(0, col - 1); c <= Math.min(gridSize - 1, col + 1); c++) {
                            cellsToRemove.push({ row: r, col: c });
                        }
                    }
                }
                break;

            case 'megaPatlama':
                if (row !== undefined && col !== undefined) {
                    for (let r = Math.max(0, row - 2); r <= Math.min(gridSize - 1, row + 2); r++) {
                        for (let c = Math.max(0, col - 2); c <= Math.min(gridSize - 1, col + 2); c++) {
                            cellsToRemove.push({ row: r, col: c });
                        }
                    }
                }
                break;
            default:
                return { success: false, newGrid: grid, earnedScore: 0 };
        }

        if (cellsToRemove.length > 0) {
            let destroyedWord = "";
            cellsToRemove.forEach(cell => {
                destroyedWord += clonedGrid[cell.row][cell.col].cellValue;
            });
            earnedScore = PointCalculator.calculateScore(destroyedWord);

            clonedGrid = CellRemover.handleCellRemoval(cellsToRemove, clonedGrid, gridSize);
            clonedGrid = generateGrid(gridSize, clonedGrid);

            console.log(`[JOKER] ${powerUpId} kullanıldı. Kazanılan Puan: ${earnedScore}. Yeni Grid: `, clonedGrid);
            return { success: true, newGrid: clonedGrid, earnedScore };
        }

        return { success: false, newGrid: grid, earnedScore: 0 };
    }
}