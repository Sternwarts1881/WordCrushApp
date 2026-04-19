import wordsData from './words.json';


const wordDictionary: Set<string> = new Set(wordsData);

export const WordLibrary = {

  isValidWord: (word: string): boolean => {

    return wordDictionary.has(word.toUpperCase());
  }
};