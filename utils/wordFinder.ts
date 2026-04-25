import { WordLibrary } from '@/storage/wordLibraryStorage';
import { CellInformation } from '@/app/(GameScreen)/gameScreen';

export const FindAvailableWordsCount = (grid: CellInformation[][]): number => {
    if (!grid || grid.length === 0) return 0;

    const size = grid.length;
    const foundWords = new Set<string>();


    const visited = Array.from({ length: size }, () => Array(size).fill(false));


    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
    ];


    const dfs = (row: number, col: number, currentWord: string) => {
        // En az 3 harf kuralı ve kelime doğrulama
        if (currentWord.length >= 3 && WordLibrary.isValidWord(currentWord)) {
            foundWords.add(currentWord);
        }



        // 8 komşu yöne doğru ilerle
        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;


            if (newRow >= 0 && newRow < size && newCol >= 0 && newCol < size && !visited[newRow][newCol]) {
                const nextWord = currentWord + grid[newRow][newCol].cellValue;


                if (WordLibrary.isValidPrefix(nextWord)) {
                    visited[newRow][newCol] = true;
                    dfs(newRow, newCol, nextWord);
                    visited[newRow][newCol] = false;
                }
            }
        }
    };

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            visited[r][c] = true;
            dfs(r, c, grid[r][c].cellValue);
            visited[r][c] = false;
        }
    };

    return foundWords.size;
};