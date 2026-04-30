import { CellInformation, CellPosition } from "@/app/(GameScreen)/gameScreen";

export const PowerUpLogic = {
    executePowerUp: function (powerUpId: string, gridSize: number, selectedCells: CellPosition[], row?: number, col?: number) {
        let cellsToRemove: CellPosition[] = [];

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

            case 'megaPatlatma':
                if (row !== undefined && col !== undefined) {
                    for (let r = Math.max(0, row - 2); r <= Math.min(gridSize - 1, row + 2); r++) {
                        for (let c = Math.max(0, col - 2); c <= Math.min(gridSize - 1, col + 2); c++) {
                            cellsToRemove.push({ row: r, col: c });
                        }
                    }
                }
                break;
            default:
                return { success: false, selectedCells };
        }

        if (cellsToRemove.length > 0) {
            const combinedCells = [...selectedCells, ...cellsToRemove];

            const updatedSelectedCells = combinedCells.filter((cell, index, self) =>
                index === self.findIndex((c) => c.row === cell.row && c.col === cell.col)
            );

            console.log(`[JOKER] ${powerUpId} kullanıldı. Mükerrer hücreler filtrelenerek selectedCells'e eklendi.`);
            return { success: true, selectedCells: updatedSelectedCells };
        }

        return { success: false, selectedCells };
    }
}