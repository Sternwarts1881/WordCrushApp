import { WordLibrary } from "@/storage/wordLibraryStorage";

export const ComboChecker = {
    wordList:[] as string[],
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

    checkCombo: function (mainWord:string): string[]{
        this.wordList.push(mainWord);
        const funcResult = this.getSubWords(mainWord);
        for (let elem in funcResult){
            if (WordLibrary.isValidWord(elem)) this.wordList.push(elem);
        }
        return this.wordList;
    },




 };