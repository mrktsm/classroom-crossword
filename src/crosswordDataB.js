// Crossword Variant B

export const ROWS = 22;
export const COLS = 26;

export const GRID = [
    [null, null, null, null, null, null, null, null, null, 'H', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, 'S', 'A', 'U', 'D', 'I', null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, 'H', null, 'B', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, 'A', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, 'R', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, 'W', null, 'I', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, 'M', 'U', 'B', 'A', 'R', 'A', 'K', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, 'H', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'F', null, null, null, null],
    [null, null, null, 'T', 'A', 'H', 'R', 'I', 'R', null, null, null, null, null, null, null, null, 'H', null, 'P', null, 'A', null, null, null, null],
    [null, null, null, null, null, 'A', null, null, null, null, null, null, null, null, 'C', null, null, 'A', null, 'R', 'E', 'T', 'W', 'E', 'E', 'T'],
    [null, null, null, null, null, 'B', null, null, null, null, 'C', null, 'A', 'R', 'A', 'B', null, 'S', null, 'O', null, 'W', null, null, null, null],
    ['M', 'O', 'B', 'I', 'L', 'I', 'Z', 'E', null, null, 'E', null, null, null, 'S', null, null, 'H', null, 'T', null, 'A', null, null, null, null],
    [null, null, 'L', null, null, 'S', null, null, null, null, 'N', null, null, null, 'T', 'W', 'I', 'T', 'T', 'E', 'R', null, null, null, null, null],
    [null, null, 'O', null, null, 'M', 'E', 'D', 'I', 'A', 'S', 'C', 'A', 'P', 'E', null, null, 'A', null, 'S', null, null, null, null, null, null],
    [null, null, 'G', null, null, null, null, 'R', null, null, 'O', null, 'U', null, 'L', null, null, 'G', null, 'T', 'U', 'N', 'I', 'S', 'I', 'A'],
    [null, null, null, null, null, null, null, 'I', null, null, 'R', null, 'T', null, 'L', null, null, null, null, null, null, 'E', null, null, null, null],
    [null, null, null, null, null, null, null, 'V', null, null, 'S', null, 'H', null, 'S', null, null, 'E', 'G', 'Y', 'P', 'T', null, null, null, null],
    [null, null, null, null, null, null, null, 'I', null, null, 'H', null, 'O', null, null, null, null, null, null, null, null, 'W', null, null, null, null],
    [null, null, null, null, null, null, null, 'N', null, null, 'I', null, 'R', null, null, null, null, null, null, null, 'W', 'O', 'M', 'E', 'N', null],
    [null, null, null, null, null, null, null, 'G', null, null, 'P', null, 'I', null, null, null, null, null, null, null, null, 'R', null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, 'T', null, null, null, null, null, null, null, null, 'K', null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, 'Y', null, null, null, null, null, null, null, null, null, null, null, null, null],
];

export const LABELS = [
    { n: 1, r: 1, c: 10 },
    { n: 2, r: 2, c: 8 },
    { n: 3, r: 6, c: 6 },
    { n: 4, r: 7, c: 3 },
    { n: 5, r: 8, c: 22 },
    { n: 6, r: 9, c: 4 },
    { n: 7, r: 9, c: 18 },
    { n: 8, r: 9, c: 20 },
    { n: 9, r: 10, c: 15 },
    { n: 10, r: 10, c: 20 },
    { n: 11, r: 11, c: 11 },
    { n: 12, r: 11, c: 13 },
    { n: 13, r: 12, c: 1 },
    { n: 14, r: 12, c: 3 },
    { n: 15, r: 13, c: 15 },
    { n: 16, r: 14, c: 6 },
    { n: 17, r: 14, c: 8 },
    { n: 18, r: 14, c: 13 },
    { n: 19, r: 15, c: 20 },
    { n: 20, r: 15, c: 22 },
    { n: 21, r: 17, c: 18 },
    { n: 22, r: 19, c: 21 },
];

export const ACROSS_CLUES = [
    { n: 2, clue: 'Nation with the fastest-growing Twitter user base' },
    { n: 4, clue: 'Leader whose removal was organized via social media' },
    { n: 6, clue: 'Liberation square that became symbol of the revolution' },
    { n: 10, clue: 'Method of information redistribution on Twitter' },
    { n: 12, clue: 'Regional identity shared by protests in Tunisia, Egypt, Libya' },
    { n: 13, clue: 'To organize people for collective action via social media' },
    { n: 15, clue: 'Microblogging site used in Arab Spring protests' },
    { n: 16, clue: 'Framework for understanding Twitter as a slice of reality' },
    { n: 19, clue: 'Nation whose revolution preceded Egypt\'s uprising' },
    { n: 21, clue: 'Nation where Tahrir Square protests took place' },
    { n: 22, clue: '#Women2Drive campaign fought for their right to drive' },
];

export const DOWN_CLUES = [
    { n: 1, clue: 'Data dissemination points with large follower counts' },
    { n: 2, clue: 'Religious legal framework referenced in Saudi internet decree' },
    { n: 3, clue: 'Islamic doctrine that shapes Saudi political identity' },
    { n: 5, clue: 'Islamic ruling by the Grand Mufti denouncing social media' },
    { n: 7, clue: 'A keyword prefix for tracking Twitter conversations' },
    { n: 8, clue: 'Form of citizen action that brought down Mubarak' },
    { n: 9, clue: 'Theorist of "Networks of Outrage and Hope"' },
    { n: 11, clue: 'Practice of filtering websites by Saudi Arabia\'s ISU' },
    { n: 14, clue: 'Digital writing platform that preceded social media activism' },
    { n: 17, clue: 'The #Women2Drive campaign demanded this basic right' },
    { n: 18, clue: 'Leaders identified by high eigenvector centrality in the study' },
    { n: 20, clue: 'Digital structure connecting people for information sharing' },
];

export const PREFILLED = {};
