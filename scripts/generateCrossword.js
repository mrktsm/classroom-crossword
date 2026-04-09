import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The list of words and their two clue variants
const WORDS = [
    { word: 'TWITTER', clueA: 'Social media platform central to both articles', clueB: 'Microblogging site used in Arab Spring protests' },
    { word: 'HASHTAG', clueA: 'Symbol (#) used to organize tweets by topic', clueB: 'A keyword prefix for tracking Twitter conversations' },
    { word: 'SAUDI', clueA: 'Kingdom that banned news contradicting sharia law', clueB: 'Nation with the fastest-growing Twitter user base' },
    { word: 'EGYPT', clueA: 'Country where Mubarak was ousted in 2011', clueB: 'Nation where Tahrir Square protests took place' },
    { word: 'MUBARAK', clueA: 'Egyptian president ousted after 30-year reign', clueB: 'Leader whose removal was organized via social media' },
    { word: 'ARAB', clueA: 'Spring uprisings across this cultural region in 2011', clueB: 'Regional identity shared by protests in Tunisia, Egypt, Libya' },
    { word: 'CENSORSHIP', clueA: 'Government restriction of online content in KSA', clueB: 'Practice of filtering websites by Saudi Arabia\\\'s ISU' },
    { word: 'SHARIA', clueA: 'Islamic law used to justify internet rules in Saudi Arabia', clueB: 'Religious legal framework referenced in Saudi internet decree' },
    { word: 'WAHHABISM', clueA: 'Strict Sunni Islam interpretation followed in Saudi Arabia', clueB: 'Islamic doctrine that shapes Saudi political identity' },
    { word: 'TAHRIR', clueA: 'Cairo square where Egyptian protests were centered', clueB: 'Liberation square that became symbol of the revolution' },
    { word: 'TUNISIA', clueA: 'Country where Bouazizi\\\'s self-immolation sparked protests', clueB: 'Nation whose revolution preceded Egypt\\\'s uprising' },
    { word: 'RETWEET', clueA: 'Sharing another user\\\'s tweet with your followers', clueB: 'Method of information redistribution on Twitter' },
    { word: 'CASTELLS', clueA: 'Scholar who theorized network power and counter-power', clueB: 'Theorist of "Networks of Outrage and Hope"' },
    { word: 'FATWA', clueA: 'Religious decree issued against Twitter use in Saudi Arabia', clueB: 'Islamic ruling by the Grand Mufti denouncing social media' },
    { word: 'PROTEST', clueA: 'Public demonstration banned by Saudi government', clueB: 'Form of citizen action that brought down Mubarak' },
    { word: 'BLOG', clueA: 'Online journal used by Egyptian activists before Twitter', clueB: 'Digital writing platform that preceded social media activism' },
    { word: 'WOMEN', clueA: 'Saudi group banned from driving until a campaign emerged', clueB: '#Women2Drive campaign fought for their right to drive' },
    { word: 'DRIVING', clueA: 'Activity Saudi women were banned from doing', clueB: 'The #Women2Drive campaign demanded this basic right' },
    { word: 'MOBILIZE', clueA: 'What Twitter helped citizens do during Arab Spring', clueB: 'To organize people for collective action via social media' },
    { word: 'NETWORK', clueA: 'Castells\\\' key concept for understanding modern power', clueB: 'Digital structure connecting people for information sharing' },
    { word: 'MEDIASCAPE', clueA: 'Appadurai\\\'s concept for electronic media landscapes', clueB: 'Framework for understanding Twitter as a slice of reality' },
    { word: 'AUTHORITY', clueA: 'Twitter accounts creating original protest content', clueB: 'Leaders identified by high eigenvector centrality in the study' },
    { word: 'HUB', clueA: 'Twitter accounts that redistribute information widely', clueB: 'Data dissemination points with large follower counts' }
];

// Helper: Seeded simple random number generator
function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Simple shuffle
function shuffleSequence(array, prng) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(prng() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

// Generate Crossword Implementation
function generateCrosswordLayout(wordsList, prng) {
    let bestGrid = null;
    let bestPlacements = [];
    let maxWordsPlaced = 0;

    // Grid sizes: initial very large, we trim it later
    const GRID_SIZE = 100;
    const OFFSET = 50;

    // We'll try multiple times to get a good layout
    for (let attempt = 0; attempt < 50; attempt++) {
        // Shuffle the order we try words, but keep longer words towards the front generally
        // One way: split into buckets by length, shuffle buckets, then concatenate
        let buckets = {};
        wordsList.forEach(w => {
            let len = w.word.length;
            if (!buckets[len]) buckets[len] = [];
            buckets[len].push(w);
        });

        let orderedWords = [];
        let lengths = Object.keys(buckets).sort((a, b) => b - a);
        lengths.forEach(l => {
            shuffleSequence(buckets[l], prng);
            orderedWords.push(...buckets[l]);
        });

        // Let's add top 3 longest to the front
        let grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        let placements = []; // { word, r, c, dir, item }

        // Helper to check if placement is valid
        function canPlace(wordStr, r, c, dir) {
            for (let i = 0; i < wordStr.length; i++) {
                let checkR = dir === 'across' ? r : r + i;
                let checkC = dir === 'across' ? c + i : c;

                if (checkR < 0 || checkR >= GRID_SIZE || checkC < 0 || checkC >= GRID_SIZE) return false;

                let currentCell = grid[checkR][checkC];
                let charToPlace = wordStr[i];

                // If occupied by a different letter, conflict
                if (currentCell !== null && currentCell !== charToPlace) return false;

                // Check adjacent cells to ensure we don't accidentally create adjacent invalid words
                if (dir === 'across') {
                    if (currentCell === null) {
                        // Check top and bottom
                        if (checkR > 0 && grid[checkR - 1][checkC] !== null) return false;
                        if (checkR < GRID_SIZE - 1 && grid[checkR + 1][checkC] !== null) return false;
                    }
                    // check left of start
                    if (i === 0 && checkC > 0 && grid[checkR][checkC - 1] !== null) return false;
                    // check right of end
                    if (i === wordStr.length - 1 && checkC < GRID_SIZE - 1 && grid[checkR][checkC + 1] !== null) return false;
                } else {
                    if (currentCell === null) {
                        // Check left and right
                        if (checkC > 0 && grid[checkR][checkC - 1] !== null) return false;
                        if (checkC < GRID_SIZE - 1 && grid[checkR][checkC + 1] !== null) return false;
                    }
                    // check top of start
                    if (i === 0 && checkR > 0 && grid[checkR - 1][checkC] !== null) return false;
                    // check bottom of end
                    if (i === wordStr.length - 1 && checkR < GRID_SIZE - 1 && grid[checkR + 1][checkC] !== null) return false;
                }
            }
            return true;
        }

        // Place word
        function doPlace(wordStr, r, c, dir, item) {
            for (let i = 0; i < wordStr.length; i++) {
                let pr = dir === 'across' ? r : r + i;
                let pc = dir === 'across' ? c + i : c;
                grid[pr][pc] = wordStr[i];
            }
            placements.push({ word: wordStr, r, c, dir, item });
        }

        // Algorithm
        for (let i = 0; i < orderedWords.length; i++) {
            let item = orderedWords[i];
            let wordStr = item.word;

            if (placements.length === 0) {
                // First word goes in the middle across
                doPlace(wordStr, OFFSET, OFFSET - Math.floor(wordStr.length / 2), 'across', item);
                continue;
            }

            // Try to find intersections with already placed words
            let placedWord = false;
            let options = [];

            for (let p of placements) {
                for (let k = 0; k < wordStr.length; k++) {
                    let charToMatch = wordStr[k];

                    // Look through the placed word for a matching char
                    for (let j = 0; j < p.word.length; j++) {
                        if (p.word[j] === charToMatch) {
                            // Possible intersection!
                            let targetR = p.dir === 'across' ? p.r : p.r + j;
                            let targetC = p.dir === 'across' ? p.c + j : p.c;

                            let newDir = p.dir === 'across' ? 'down' : 'across';
                            let testR = newDir === 'across' ? targetR : targetR - k;
                            let testC = newDir === 'across' ? targetC - k : targetC;

                            if (canPlace(wordStr, testR, testC, newDir)) {
                                // Score this placement (favor placements near center or lots of intersections, let's keep it simple for now and pick random option)
                                options.push({ r: testR, c: testC, dir: newDir });
                            }
                        }
                    }
                }
            }

            if (options.length > 0) {
                // Pick one option randomly
                let opt = options[Math.floor(prng() * options.length)];
                doPlace(wordStr, opt.r, opt.c, opt.dir, item);
            }
        }

        if (placements.length > maxWordsPlaced) {
            maxWordsPlaced = placements.length;
            bestGrid = grid;
            bestPlacements = JSON.parse(JSON.stringify(placements)); // deep copy primitive subset
        }
    }

    // Trim Grid
    let minR = GRID_SIZE, maxR = -1, minC = GRID_SIZE, maxC = -1;
    for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
            if (bestGrid[r][c] !== null) {
                minR = Math.min(minR, r);
                maxR = Math.max(maxR, r);
                minC = Math.min(minC, c);
                maxC = Math.max(maxC, c);
            }
        }
    }

    // Ensure bounds are safe (no extra padding per user request)
    minR = Math.max(0, minR);
    maxR = Math.min(GRID_SIZE - 1, maxR);
    minC = Math.max(0, minC);
    maxC = Math.min(GRID_SIZE - 1, maxC);

    let rows = maxR - minR + 1;
    let cols = maxC - minC + 1;
    let trimmedGrid = [];
    for (let r = minR; r <= maxR; r++) {
        trimmedGrid.push(bestGrid[r].slice(minC, maxC + 1));
    }

    let trimmedPlacements = bestPlacements.map(p => ({
        ...p,
        r: p.r - minR,
        c: p.c - minC
    }));

    return { grid: trimmedGrid, placements: trimmedPlacements, rows, cols };
}

// Process the raw layout into the structured data format expected by React + pre-filling
function processCrosswordData(layout, variant, prng) {
    let grid = layout.grid;
    let rows = layout.rows;
    let cols = layout.cols;

    // Compute labels
    let labels = [];
    let acrossClues = [];
    let downClues = [];
    let labelNum = 1;

    // Sort placements by position (top to bottom, left to right)
    let orderedPlacements = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let placementsHere = layout.placements.filter(p => p.r === r && p.c === c);
            if (placementsHere.length > 0) {
                // If both across and down start here, order doesn't really matter for assigning number
                let acrossP = placementsHere.find(p => p.dir === 'across');
                let downP = placementsHere.find(p => p.dir === 'down');

                labels.push({ n: labelNum, r: r + 1, c: c + 1 });
                if (acrossP) acrossClues.push({ n: labelNum, ...acrossP.item, dir: 'across' });
                if (downP) downClues.push({ n: labelNum, ...downP.item, dir: 'down' });

                labelNum++;
            }
        }
    }

    // Removed pre-filling logic entirely
    let prefilled = {};

    // Format output code
    let output = `// Crossword Variant ${variant}\n\n`;
    output += `export const ROWS = ${rows};\nexport const COLS = ${cols};\n\n`;

    output += `export const GRID = [\n`;
    for (let r = 0; r < rows; r++) {
        let rowStr = grid[r].map(cell => cell === null ? 'null' : `'${cell}'`).join(', ');
        output += `    [${rowStr}],\n`;
    }
    output += `];\n\n`;

    output += `export const LABELS = [\n`;
    labels.forEach(l => {
        output += `    { n: ${l.n}, r: ${l.r}, c: ${l.c} },\n`;
    });
    output += `];\n\n`;

    output += `export const ACROSS_CLUES = [\n`;
    acrossClues.forEach(c => {
        let clueText = variant === 'A' ? c.clueA : c.clueB;
        output += `    { n: ${c.n}, clue: '${clueText.replace(/'/g, "\\'")}' },\n`;
    });
    output += `];\n\n`;

    output += `export const DOWN_CLUES = [\n`;
    downClues.forEach(c => {
        let clueText = variant === 'A' ? c.clueA : c.clueB;
        output += `    { n: ${c.n}, clue: '${clueText.replace(/'/g, "\\'")}' },\n`;
    });
    output += `];\n\n`;

    output += `export const PREFILLED = ${JSON.stringify(prefilled, null, 4)};\n`;

    return output;
}

// -- Main --
console.log('Generating crosswords...');

// Generate Variant A
let prngA = mulberry32(12345); // Seed 1
let layoutA = generateCrosswordLayout(WORDS, prngA);
let codeA = processCrosswordData(layoutA, 'A', prngA);
fs.writeFileSync(path.join(__dirname, '../src/crosswordDataA.js'), codeA);
console.log(`Variant A generated: ${layoutA.placements.length}/${WORDS.length} words placed. size: ${layoutA.rows}x${layoutA.cols}`);

// Generate Variant B
let prngB = mulberry32(98765); // Seed 2
let layoutB = generateCrosswordLayout(WORDS, prngB);
let codeB = processCrosswordData(layoutB, 'B', prngB);
fs.writeFileSync(path.join(__dirname, '../src/crosswordDataB.js'), codeB);
console.log(`Variant B generated: ${layoutB.placements.length}/${WORDS.length} words placed. size: ${layoutB.rows}x${layoutB.cols}`);

// Generate Router crossWordData.js
let routerCode = `
// Crossword Data Router
// Returns Variant A or Variant B based on env/url

import * as VariantA from './crosswordDataA.js';
import * as VariantB from './crosswordDataB.js';

// Default routing logic: 
// Can be overridden by query string ?variant=B or env format
export function getCrosswordVariant(variant = 'A') {
    if (variant === 'B') return VariantB;
    return VariantA; // Default
}

// By default, export variant A definitions so existing code works without refactor immediately,
// though ideally we refactor components to use getCrosswordVariant()
const DefaultVariant = VariantA;

export const ROWS = DefaultVariant.ROWS;
export const COLS = DefaultVariant.COLS;
export const GRID = DefaultVariant.GRID;
export const LABELS = DefaultVariant.LABELS;
export const ACROSS_CLUES = DefaultVariant.ACROSS_CLUES;
export const DOWN_CLUES = DefaultVariant.DOWN_CLUES;
export const PREFILLED = DefaultVariant.PREFILLED || {};
`;

fs.writeFileSync(path.join(__dirname, '../src/crosswordData.js'), routerCode);

console.log('Done!');
