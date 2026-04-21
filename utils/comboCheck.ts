import { WordLibrary } from "@/storage/wordLibraryStorage";

export const ComboChecker = {
    
    getSubWords: function(mainWord: string): string[] {
        const result: string[] = [];
        const minLength = 3;

        if (mainWord.length < minLength) {
            return result; 
        }

        for (let length = minLength; length <= mainWord.length; length++) {
            for (let i = 0; i <= mainWord.length - length; i++) {
                const subWord = mainWord.substring(i, i + length);
                result.push(subWord);
            }
        }
        return result;
    },

    checkCombo: function (mainWord: string): string[] {
        const validWords: string[] = []; 
        
        const funcResult = this.getSubWords(mainWord);
        
        const uniqueSubWords = Array.from(new Set(funcResult));

        for (let elem of uniqueSubWords) { 
            if (WordLibrary.isValidWord(elem)) {
                validWords.push(elem);
            }
        }
        
        return validWords;
    },
};