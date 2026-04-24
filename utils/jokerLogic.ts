import { CellPosition } from "@/app/(GameScreen)/gameScreen";
import { generateInitialGrid } from "./gridGenerator";
import { CellRemover } from "./popCells";

export const JokerLogic = {
   
    executeJoker: function(jokerId: string, grid: string[][], gridSize: number, row?: number, col?: number, targetRow?: number, targetCol?: number) {
        let clonedGrid = grid.map(r => [...r]);
        let cellsToRemove: CellPosition[] = [];

        switch(jokerId) {
            case 'serbestDegistirme':
                
                if (row !== undefined && col !== undefined && targetRow !== undefined && targetCol !== undefined) {
                    const temp = clonedGrid[row][col];
                    clonedGrid[row][col] = clonedGrid[targetRow][targetCol];
                    clonedGrid[targetRow][targetCol] = temp;
                    
                    console.log(`[JOKER] ${jokerId} kullanıldı. Harfler yer değiştirdi.`);
                    return { success: true, newGrid: clonedGrid };
                }
                break;

            case 'lolipop':
            case 'balik':
                if (row !== undefined && col !== undefined) {
                    cellsToRemove.push({row, col});
                }
                break;
                
            case 'tekerlek':
                if (row !== undefined) {
                    for (let c = 0; c < gridSize; c++) {
                        cellsToRemove.push({row, col: c});
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
                return { success: true, newGrid: shuffledGrid };

            case 'partiGuclendiricisi':
                for(let i = 0; i < 5; i++){
                    cellsToRemove.push({
                        row: Math.floor(Math.random() * gridSize),
                        col: Math.floor(Math.random() * gridSize)
                    });
                }
                break;
                
            default:
                return { success: false, newGrid: grid };
        }

        if (cellsToRemove.length > 0) {
            clonedGrid = CellRemover.handleCellRemoval(cellsToRemove, clonedGrid, gridSize);
            clonedGrid = generateInitialGrid(gridSize, clonedGrid);
            
            console.log(`[JOKER] ${jokerId} kullanıldı. Yeni Grid: `, clonedGrid);
            return { success: true, newGrid: clonedGrid };
        }

        return { success: false, newGrid: grid };
    }
}