import wordsData from './words.json';


class TrieNode {
    children: Record<string, TrieNode> = {};
    isEndOfWord: boolean = false;
}

class Trie {
    root: TrieNode = new TrieNode();

    
    insert(word: string) {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
    }

  
    isValidWord(word: string): boolean {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) return false;
            node = node.children[char];
        }
        return node.isEndOfWord;
    }

   
    isValidPrefix(prefix: string): boolean {
        let node = this.root;
        for (const char of prefix) {
            if (!node.children[char]) return false;
            node = node.children[char];
        }
        return true;
    }
}


const DictionaryTrie = new Trie();
(wordsData as string[]).forEach(word => DictionaryTrie.insert(word));

export const WordLibrary = {
    isValidWord: (word: string) => DictionaryTrie.isValidWord(word),
    isValidPrefix: (prefix: string) => DictionaryTrie.isValidPrefix(prefix)
};