import { CellInformation, CellPosition } from "@/app/(GameScreen)/gameScreen";
import { generateGrid } from "./gridGenerator";
import { PointCalculator } from "./pointCalculator";
import { CellRemover } from "./popCells";

export const JokerLogic = {
    executeJoker: function(jokerId: string, grid: CellInformation[][], gridSize: number, row?: number, col?: number, targetRow?: number, targetCol?: number) {
        let clonedGrid = grid.map(r => [...r]);
        let cellsToRemove: CellPosition[] = [];
        let earnedScore = 0; // YENİ: Jokerden kazanılacak puan

        switch(jokerId) {
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
                    cellsToRemove.push({row, col});
                }
                break;
                
            case 'balik':
                // YENİ: Balık artık ana harfi ve rastgele 2 komşusunu yutuyor!
                if (row !== undefined && col !== undefined) {
                    cellsToRemove.push({row, col}); // Hedef harf
                    
                    let neighbors: CellPosition[] = [];
                    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
                    
                    for (let [dx, dy] of directions) {
                        const nRow = row + dx;
                        const nCol = col + dy;
                        if (nRow >= 0 && nRow < gridSize && nCol >= 0 && nCol < gridSize) {
                            neighbors.push({row: nRow, col: nCol});
                        }
                    }
                    
                    // Komşuları karıştır ve 2 tanesini seç
                    neighbors = neighbors.sort(() => Math.random() - 0.5).slice(0, 2);
                    cellsToRemove.push(...neighbors);
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
                return { success: true, newGrid: shuffledGrid, earnedScore: 0 };

            case 'partiGuclendiricisi':
                for(let i = 0; i < 5; i++){
                    cellsToRemove.push({
                        row: Math.floor(Math.random() * gridSize),
                        col: Math.floor(Math.random() * gridSize)
                    });
                }
                break;
                
            default:
                return { success: false, newGrid: grid, earnedScore: 0 };
        }

        if (cellsToRemove.length > 0) {
            // YENİ: Harfler silinmeden önce puanlarını arkadaşının hesaplayıcısıyla topluyoruz
            let destroyedWord = "";
            cellsToRemove.forEach(cell => {
                destroyedWord += clonedGrid[cell.row][cell.col].cellValue;
            });
            earnedScore = PointCalculator.calculateScore(destroyedWord);

            clonedGrid = CellRemover.handleCellRemoval(cellsToRemove, clonedGrid, gridSize);
            clonedGrid = generateGrid(gridSize, clonedGrid);
            
            console.log(`[JOKER] ${jokerId} kullanıldı. Kazanılan Puan: ${earnedScore}. Yeni Grid: `, clonedGrid);
            return { success: true, newGrid: clonedGrid, earnedScore };
        }

        return { success: false, newGrid: grid, earnedScore: 0 };
    }
}