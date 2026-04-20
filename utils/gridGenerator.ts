
const generateLetterPool = (): string[] => {
  const pool: string[] = [];
  

  const highFreq = ['A', 'E', 'İ', 'L', 'R', 'N', 'K', 'T'];
  highFreq.forEach(char => {
    for (let i = 0; i < 8; i++) pool.push(char);
  });


  const medFreq = ['M', 'S', 'Y', 'D', 'O', 'U', 'I', 'B', 'Ü', 'Ş'];
  medFreq.forEach(char => {
    for (let i = 0; i < 4; i++) pool.push(char);
  });

 
  const lowFreq = ['C', 'Ç', 'Z', 'H', 'P', 'G', 'F', 'Ö', 'V', 'Ğ', 'J'];
  lowFreq.forEach(char => {
    for (let i = 0; i < 1; i++) pool.push(char);
  });

  return pool;
};

const LETTER_POOL = generateLetterPool();


export const getRandomLetter = (): string => {
  const randomIndex = Math.floor(Math.random() * LETTER_POOL.length);
  return LETTER_POOL[randomIndex];
};


export const generateInitialGrid = (size: number): string[][] => {
  const grid: string[][] = [];
  for (let row = 0; row < size; row++) {
    const newRow: string[] = [];
    for (let col = 0; col < size; col++) {
      newRow.push(getRandomLetter());
    }
    grid.push(newRow);
  }
  return grid;
};