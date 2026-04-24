

const generateLetterPool = (): string[] => {
    const pool: string[] = [];
    

    const highFreq = ['A', 'E', 'İ', 'L', 'R', 'N', 'K', 'T', 'I', 'M'];
    highFreq.forEach(char => { for (let i = 0; i < 6; i++) pool.push(char); });

    const medFreq = ['O', 'S', 'U', 'B', 'D', 'Ü', 'Y', 'Ş', 'Z', 'Ç'];
    medFreq.forEach(char => { for (let i = 0; i < 3; i++) pool.push(char); });

    const lowFreq = ['C', 'H', 'G', 'P', 'V', 'Ö', 'F', 'Ğ', 'J'];
    lowFreq.forEach(char => { for (let i = 0; i < 1; i++) pool.push(char); });

    return pool;
};

const LETTER_POOL = generateLetterPool();

export const getRandomLetter = (): string => {
    const randomIndex = Math.floor(Math.random() * LETTER_POOL.length);
    return LETTER_POOL[randomIndex];
};


export const generateInitialGrid = (size: number, currentGrid?: string[][]): string[][] => {
    const grid: string[][] = [];
    
    for (let row = 0; row < size; row++) {
        const newRow: string[] = [];
        for (let col = 0; col < size; col++) {
            
            
            if (currentGrid && currentGrid[row] && currentGrid[row][col] !== '') {
                newRow.push(currentGrid[row][col]);
            } 
           
            else {
                newRow.push(getRandomLetter());
            }
            
        }
        grid.push(newRow);
    }
    return grid;
};