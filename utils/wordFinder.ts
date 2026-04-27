import { CellInformation } from '@/app/(GameScreen)/gameScreen';
import { WordLibrary } from '@/storage/wordLibraryStorage';

export const FindAvailableWordsCount = (grid: CellInformation[][]): number => {
    if (!grid || grid.length === 0) return 0;
    
    const size = grid.length;
    let disjointWordCount = 0; 
    
    
    let globalUsed = Array.from({ length: size }, () => Array(size).fill(false));

    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];

    
    const findOneWord = (): { found: boolean, path: {r: number, c: number}[] } => {
        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                
                if (globalUsed[r][c] || !grid[r][c] || grid[r][c].cellValue === '') continue;

                let localVisited = Array.from({ length: size }, () => Array(size).fill(false));
                let pathFound: {r: number, c: number}[] = [];

                const dfs = (currR: number, currC: number, currentWord: string, currentPath: {r: number, c: number}[]): boolean => {
                    if (currentWord.length >= 3 && WordLibrary.isValidWord(currentWord)) {
                        pathFound = [...currentPath];
                        return true; 
                    }

                    for (const [dx, dy] of directions) {
                        const nR = currR + dx;
                        const nC = currC + dy;

                        if (nR >= 0 && nR < size && nC >= 0 && nC < size && 
                            !globalUsed[nR][nC] && !localVisited[nR][nC] && 
                            grid[nR][nC] && grid[nR][nC].cellValue !== '') {
                            
                            const nextWord = currentWord + grid[nR][nC].cellValue;
                            
                            if (WordLibrary.isValidPrefix(nextWord)) {
                                localVisited[nR][nC] = true;
                                currentPath.push({r: nR, c: nC});
                                
                                if (dfs(nR, nC, nextWord, currentPath)) return true;
                                
                                currentPath.pop();
                                localVisited[nR][nC] = false;
                            }
                        }
                    }
                    return false;
                };

                localVisited[r][c] = true;
                if (dfs(r, c, grid[r][c].cellValue, [{r, c}])) {
                    return { found: true, path: pathFound };
                }
            }
        }
        return { found: false, path: [] };
    };

    
    while (true) {
        const result = findOneWord();
        if (result.found) {
            disjointWordCount++;
          
            for (const cell of result.path) {
                globalUsed[cell.r][cell.c] = true;
            }
        } else {
            break; 
        }
    }

    return disjointWordCount;
};