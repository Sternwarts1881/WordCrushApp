# Word Crush App
<img width="921" height="2048" alt="image" src="https://github.com/user-attachments/assets/ee32a55b-77f0-4db7-87d2-feba07bea252" />


Modern, fast, and dynamic 2D word puzzle game. Developed with React Native and Expo infrastructure, this game aims to go beyond standard word games with letter sliding mechanics, fluid physics animations, combo systems, and deadlock prevention algorithms.

## Features
<img width="921" height="2048" alt="image" src="https://github.com/user-attachments/assets/e4e2cf10-8f01-4bfa-8f87-2d317af59d7c" />

<img width="921" height="2048" alt="image" src="https://github.com/user-attachments/assets/469a2727-de09-44ac-819e-9d78b6964bfd" />

* **Dynamic Grid and Fluid Controls:** Create words by connecting adjacent letters with a finger swipe motion on an 6x6, 8x8 or 10x10 game board.
* **Advanced Combo System:** A custom ComboChecker algorithm that detects hidden sub-words (substrings) within the main word and applies a score multiplier.
<img width="921" height="2048" alt="image" src="https://github.com/user-attachments/assets/af42f40e-5be0-4bfd-841e-4ee49a66551a" />

* **Power-Ups and Wildcards:** * Creating Row Clear, Area Blast, Column Clear, and Mega Blast tiles with 4, 5, 6+ letter words.
    * Special wildcards available for purchase through the market (Fish, Wheel, Lollipop, Free Swap, Letter Shuffle, Party Booster).
* **Deadlock Prevention:** Autonomously refreshes the grid when there are no more words left to form on the board, using a Trie Tree, Depth-First Search (DFS), and Greedy algorithms running in the background.
* **60 FPS Animations:** Letter falling physics and Explosion Particle effects run at the hardware level using react-native-reanimated.
<img width="921" height="2048" alt="image" src="https://github.com/user-attachments/assets/b9214d74-0078-402e-ab93-2b6ae86bbbb3" />

* **Advanced Scoreboard:** A dashboard featuring metrics such as game history, highest score, average score, longest word, and total time, saved locally using AsyncStorage.

## Technologies Used

* **Framework:** React Native & Expo (v54.0.33)
* **Language:** TypeScript
* **Animation and Interaction:** react-native-reanimated (v4.1.1), react-native-gesture-handler (v2.28.0)
* **Local Storage:** @react-native-async-storage/async-storage
* **Data Structures:** Trie Tree for a 63,000-word Turkish dictionary.

## License
This project uses the MIT License.
