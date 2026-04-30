import { CellInformation, CellPosition } from "@/app/(GameScreen)/gameScreen";
import { generateGrid } from "./gridGenerator";
import { PointCalculator } from "./pointCalculator";
import { CellRemover } from "./popCells";
import { PowerUpLogic } from "./powerUp";

export const JokerLogic = {
    executeJoker: function (jokerId: string, grid: CellInformation[][], gridSize: number, row?: number, col?: number, targetRow?: number, targetCol?: number) {
        let clonedGrid = grid.map(r => [...r]);
        let cellsToRemove: CellPosition[] = [];
        let earnedScore = 0;

        switch (jokerId) {
            case 'serbestDegistirme':
                if (row !== undefined && col !== undefined && targetRow !== undefined && targetCol !== undefined) {
                    const temp = clonedGrid[row][col];
                    clonedGrid[row][col] = clonedGrid[targetRow][targetCol];
                    clonedGrid[targetRow][targetCol] = temp;

                    console.log(`[JOKER] ${jokerId} kullanıldı. Harfler yer değiştirdi.`);
                    return { success: true, newGrid: clonedGrid, earnedScore: 0 };
                }
                break;

            case 'lolipop':
                if (row !== undefined && col !== undefined) {
                    cellsToRemove.push({ row, col });
                }
                break;

            case 'balik':
                let allCellsForFish: CellPosition[] = [];
                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize; c++) {
                        allCellsForFish.push({ row: r, col: c });
                    }
                }
                allCellsForFish = allCellsForFish.sort(() => Math.random() - 0.5).slice(0, 3);
                cellsToRemove.push(...allCellsForFish);
                break;

            case 'tekerlek':
                if (row !== undefined && col !== undefined) {
                    for (let i = 0; i < gridSize; i++) {
                        cellsToRemove.push({ row: row, col: i });
                        if (i !== row) {
                            cellsToRemove.push({ row: i, col: col });
                        }
                    }
                }
                break;

            case 'harfKaristirma':
                const flatGrid = clonedGrid.flat();
                for (let i = flatGrid.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [flatGrid[i], flatGrid[j]] = [flatGrid[j], flatGrid[i]];
                }
                let shuffledGrid = [];
                while (flatGrid.length) shuffledGrid.push(flatGrid.splice(0, gridSize));

                console.log(`[JOKER] ${jokerId} kullanıldı. Yeni Grid: `, shuffledGrid);
                return { success: true, newGrid: shuffledGrid, earnedScore: 0 };

            case 'partiGuclendiricisi':
                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize; c++) {
                        cellsToRemove.push({ row: r, col: c });
                    }
                }
                break;

            default:
                return { success: false, newGrid: grid, earnedScore: 0 };
        }

        if (cellsToRemove.length > 0) {
            cellsToRemove.forEach(cell => {
                const existingPowerUp = grid[cell.row][cell.col].powerUp;

                if (existingPowerUp) {
                    const powerResult = PowerUpLogic.executePowerUp(existingPowerUp, gridSize, cellsToRemove, cell.row, cell.col);

                    if (powerResult && powerResult.success) {
                        cellsToRemove = [...cellsToRemove, ...powerResult.selectedCells];
                    }
                }
            });

            const uniqueCells = cellsToRemove.filter((v, i, a) => a.findIndex(t => (t.row === v.row && t.col === v.col)) === i);

            let destroyedWord = "";
            uniqueCells.forEach(cell => {
                destroyedWord += clonedGrid[cell.row][cell.col].cellValue;
            });
            earnedScore = PointCalculator.calculateScore(destroyedWord);

            clonedGrid = CellRemover.handleCellRemoval(uniqueCells, clonedGrid, gridSize);
            clonedGrid = generateGrid(gridSize, clonedGrid);

            console.log(`[JOKER] ${jokerId} kullanıldı. Kazanılan Puan: ${earnedScore}. Yeni Grid: `, clonedGrid);

            return { success: true, newGrid: clonedGrid, earnedScore, targetedCells: uniqueCells };
        }

        return { success: false, newGrid: grid, earnedScore: 0 };
    }
}