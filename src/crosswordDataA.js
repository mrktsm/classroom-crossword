// Crossword Variant A

export const ROWS = 28;
export const COLS = 24;

export const GRID = [
    [null, null, null, 'F', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, 'A', null, 'S', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, 'T', 'A', 'H', 'R', 'I', 'R', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, 'W', null, 'A', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, 'A', null, 'R', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, 'I', null, null, 'M', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, 'C', 'A', 'S', 'T', 'E', 'L', 'L', 'S', null, 'A', null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, 'D', null, null, null, null, 'U', null, null, null, null, null, null, null, null, null, null],
    [null, null, null, 'M', 'O', 'B', 'I', 'L', 'I', 'Z', 'E', null, null, 'T', null, null, null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, 'A', null, null, null, null, 'H', null, 'W', 'O', 'M', 'E', 'N', null, null, null, null],
    [null, null, null, null, null, null, 'H', null, 'S', null, null, null, null, 'O', null, 'A', null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, 'A', null, 'C', 'E', 'N', 'S', 'O', 'R', 'S', 'H', 'I', 'P', null, null, null, null, null, null],
    [null, null, 'T', 'U', 'N', 'I', 'S', 'I', 'A', null, 'E', null, null, 'I', null, 'H', null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, 'H', null, 'P', null, 'T', null, null, 'T', null, 'A', null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, 'T', null, 'E', null, 'W', null, null, 'Y', null, 'B', 'L', 'O', 'G', null, null, null, null, null],
    [null, null, null, null, null, null, 'A', null, null, null, 'O', null, null, null, null, 'I', null, null, null, null, null, null, null, null],
    ['D', 'R', 'I', 'V', 'I', 'N', 'G', null, null, null, 'R', null, null, null, null, 'S', null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, 'K', null, null, null, null, 'M', 'U', 'B', 'A', 'R', 'A', 'K', null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'E', null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'T', 'W', 'I', 'T', 'T', 'E', 'R', null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'W', null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'E', 'G', 'Y', 'P', 'T'],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'A', null, 'E', null, null, null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'P', 'R', 'O', 'T', 'E', 'S', 'T', null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'A', null, null, null, 'A', null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'B', null, null, 'H', 'U', 'B', null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'D', null, null],
    [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'I', null, null],
];

export const LABELS = [
    { n: 1, r: 1, c: 4 },
    { n: 2, r: 2, c: 6 },
    { n: 3, r: 3, c: 4 },
    { n: 4, r: 6, c: 9 },
    { n: 5, r: 7, c: 5 },
    { n: 6, r: 7, c: 14 },
    { n: 7, r: 9, c: 4 },
    { n: 8, r: 10, c: 16 },
    { n: 9, r: 11, c: 7 },
    { n: 10, r: 12, c: 9 },
    { n: 11, r: 12, c: 11 },
    { n: 12, r: 13, c: 3 },
    { n: 13, r: 15, c: 16 },
    { n: 14, r: 17, c: 1 },
    { n: 15, r: 18, c: 16 },
    { n: 16, r: 18, c: 20 },
    { n: 17, r: 20, c: 17 },
    { n: 18, r: 22, c: 20 },
    { n: 19, r: 23, c: 18 },
    { n: 20, r: 24, c: 17 },
    { n: 21, r: 24, c: 22 },
    { n: 22, r: 26, c: 21 },
];

export const ACROSS_CLUES = [
    { n: 3, clue: 'Cairo square where Egyptian protests were centered' },
    { n: 5, clue: 'Scholar who theorized network power and counter-power' },
    { n: 7, clue: 'What Twitter helped citizens do during Arab Spring' },
    { n: 8, clue: 'Saudi group banned from driving until a campaign emerged' },
    { n: 10, clue: 'Government restriction of online content in KSA' },
    { n: 12, clue: 'Country where Bouazizi\'s self-immolation sparked protests' },
    { n: 13, clue: 'Online journal used by Egyptian activists before Twitter' },
    { n: 14, clue: 'Activity Saudi women were banned from doing' },
    { n: 15, clue: 'Egyptian president ousted after 30-year reign' },
    { n: 17, clue: 'Social media platform central to both articles' },
    { n: 18, clue: 'Country where Mubarak was ousted in 2011' },
    { n: 20, clue: 'Public demonstration banned by Saudi government' },
    { n: 22, clue: 'Twitter accounts that redistribute information widely' },
];

export const DOWN_CLUES = [
    { n: 1, clue: 'Religious decree issued against Twitter use in Saudi Arabia' },
    { n: 2, clue: 'Islamic law used to justify internet rules in Saudi Arabia' },
    { n: 4, clue: 'Appadurai\'s concept for electronic media landscapes' },
    { n: 6, clue: 'Twitter accounts creating original protest content' },
    { n: 8, clue: 'Strict Sunni Islam interpretation followed in Saudi Arabia' },
    { n: 9, clue: 'Symbol (#) used to organize tweets by topic' },
    { n: 11, clue: 'Castells\' key concept for understanding modern power' },
    { n: 16, clue: 'Sharing another user\'s tweet with your followers' },
    { n: 19, clue: 'Spring uprisings across this cultural region in 2011' },
    { n: 21, clue: 'Kingdom that banned news contradicting sharia law' },
];

export const PREFILLED = {};
