import { useState, useRef, useEffect, useCallback } from 'react';
import { GRID, ROWS, COLS, LABELS, ACROSS_CLUES, DOWN_CLUES } from '../crosswordData';
import './Crossword.scss';

export default function Crossword({ readOnly = false, externalState = {}, onCellChange, teamName = '', compact = false, status = 'playing' }) {
    const [cells, setCells] = useState({});
    const inputRefs = useRef({});
    const [focusedCell, setFocusedCell] = useState(null);
    const [direction, setDirection] = useState('across');

    // Use external state (from WebSocket) in read-only mode
    const displayCells = readOnly ? externalState : cells;
    const isEffectivelyReadOnly = readOnly || status !== 'playing';

    // DEBUG: Auto-complete for testing
    useEffect(() => {
        if (readOnly) return;
        const handleDebugKey = (e) => {
            if (e.ctrlKey && e.shiftKey && e.code === 'Slash') { // Ctrl+Shift+?
                for (let r = 0; r < ROWS; r++) {
                    for (let c = 0; c < COLS; c++) {
                        if (GRID[r][c] !== null) {
                            // Directly update state to avoid massive re-renders from handleChange
                            setCells(prev => {
                                const next = { ...prev };
                                for (let _r = 0; _r < ROWS; _r++) {
                                    for (let _c = 0; _c < COLS; _c++) {
                                        if (GRID[_r][_c]) {
                                            next[`${_r + 1}-${_c + 1}`] = GRID[_r][_c];
                                        }
                                    }
                                }
                                return next;
                            });
                            // Must notify server too
                            if (onCellChange) {
                                for (let _r = 0; _r < ROWS; _r++) {
                                    for (let _c = 0; _c < COLS; _c++) {
                                        if (GRID[_r][_c]) {
                                            onCellChange(_r + 1, _c + 1, GRID[_r][_c]);
                                        }
                                    }
                                }
                            }
                            break; // only need to do this once
                        }
                    }
                    break;
                }
            }
        };
        window.addEventListener('keydown', handleDebugKey);
        return () => window.removeEventListener('keydown', handleDebugKey);
    }, [readOnly, onCellChange]);

    const handleChange = useCallback((r, c, value) => {
        const letter = value.slice(-1).toUpperCase();
        const key = `${r}-${c}`;
        setCells(prev => ({ ...prev, [key]: letter }));
        if (onCellChange) onCellChange(r, c, letter);

        // Auto-advance to next cell in the current word
        if (letter) {
            const next = direction === 'across' ? findNextInRow(r, c) : findNextInCol(r, c);
            if (next && inputRefs.current[`${next.r}-${next.c}`]) {
                inputRefs.current[`${next.r}-${next.c}`].focus();
            }
        }
    }, [onCellChange, direction]);

    const handleKeyDown = useCallback((e, r, c) => {
        if (e.key === 'Backspace') {
            const key = `${r}-${c}`;
            if (!displayCells[key]) {
                // Cell is empty, go to previous in word
                const prev = direction === 'across' ? findPrevInRow(r, c) : findPrevInCol(r, c);
                if (prev && inputRefs.current[`${prev.r}-${prev.c}`]) {
                    inputRefs.current[`${prev.r}-${prev.c}`].focus();
                }
            }
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            setDirection('across');
            const next = findNextInRow(r, c);
            if (next) inputRefs.current[`${next.r}-${next.c}`]?.focus();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            setDirection('across');
            const prev = findPrevInRow(r, c);
            if (prev) inputRefs.current[`${prev.r}-${prev.c}`]?.focus();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            setDirection('down');
            const next = findNextInCol(r, c);
            if (next) inputRefs.current[`${next.r}-${next.c}`]?.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setDirection('down');
            const prev = findPrevInCol(r, c);
            if (prev) inputRefs.current[`${prev.r}-${prev.c}`]?.focus();
        }
    }, [displayCells, direction]);

    const handlePointerDown = (e) => {
        if (isEffectivelyReadOnly) return;
        if (document.activeElement === e.target) {
            setDirection(prev => prev === 'across' ? 'down' : 'across');
        }
    };

    const handleFocus = (r, c) => {
        if (isEffectivelyReadOnly) return;
        if (!focusedCell || focusedCell.r !== r || focusedCell.c !== c) {
            setFocusedCell({ r, c });
        }
    };

    const handleBlur = (e) => {
        // Only clear focus if we're not moving to another input
        if (!e.relatedTarget || !e.relatedTarget.classList.contains('crossword-board__item')) {
            setFocusedCell(null);
        }
    };

    // Check if all cells are correctly filled
    const isComplete = checkComplete(displayCells);

    const rootClass = `crossword ${compact ? 'crossword--compact' : ''} ${isEffectivelyReadOnly ? 'crossword--readonly' : ''}`;

    const highlightedCells = new Set(
        focusedCell && !isEffectivelyReadOnly ? getWordCells(focusedCell.r, focusedCell.c, direction) : []
    );
    const activeClue = focusedCell && !isEffectivelyReadOnly ? getActiveClue(focusedCell.r, focusedCell.c, direction) : null;

    return (
        <div className={rootClass}>
            {teamName && <div className="crossword__team-name">{teamName}</div>}
            <div className="crossword-board-container">
                <div className="crossword-board">
                    {/* Grid cells */}
                    {Array.from({ length: ROWS }, (_, r) =>
                        Array.from({ length: COLS }, (_, c) => {
                            const letter = GRID[r][c];
                            const key = `${r + 1}-${c + 1}`;
                            if (letter === null) {
                                return <span key={key} className="crossword-board__item--blank" />;
                            }
                            const value = displayCells[key] || '';
                            const isCorrect = value.toUpperCase() === letter.toUpperCase();
                            const isHighlighted = highlightedCells.has(key);

                            return (
                                <input
                                    key={key}
                                    ref={el => inputRefs.current[key] = el}
                                    className={`crossword-board__item ${isCorrect ? 'crossword-board__item--correct' : ''} ${isHighlighted ? 'crossword-board__item--highlight' : ''}`}
                                    type="text"
                                    maxLength={1}
                                    value={value}
                                    readOnly={isEffectivelyReadOnly}
                                    tabIndex={isEffectivelyReadOnly ? -1 : 0}
                                    onChange={e => !isEffectivelyReadOnly && handleChange(r + 1, c + 1, e.target.value)}
                                    onKeyDown={e => !isEffectivelyReadOnly && handleKeyDown(e, r + 1, c + 1)}
                                    onFocus={(e) => {
                                        handleFocus(r + 1, c + 1);
                                        e.target.select();
                                    }}
                                    onPointerDown={handlePointerDown}
                                    onBlur={handleBlur}
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck={false}
                                />
                            );
                        })
                    )}

                    {/* Number labels */}
                    <div className="crossword-board crossword-board--labels">
                        {LABELS.map(({ n, r, c }) => (
                            <span
                                key={n}
                                className="crossword-board__item-label"
                                style={{ gridColumn: c, gridRow: r }}
                            >
                                <span className="crossword-board__item-label-text">{n}</span>
                            </span>
                        ))}
                    </div>

                    {/* Completion overlay (winner) */}
                    {(isComplete && status !== 'lost' && status !== 'kicked' || status === 'won') && (
                        <div className="crossword-complete">
                            <div className="crossword-complete__text">DONE!</div>
                        </div>
                    )}

                    {/* Lost overlay */}
                    {status === 'lost' && (
                        <div className="crossword-complete">
                            <div className="crossword-complete__text" style={{ color: '#e11d48' }}>GAME OVER</div>
                        </div>
                    )}

                    {/* Kicked overlay */}
                    {status === 'kicked' && (
                        <div className="crossword-complete">
                            <div className="crossword-complete__text" style={{ color: '#e11d48' }}>KICKED</div>
                        </div>
                    )}
                </div>

                {/* Clues */}
                {!compact && (
                    <div className="crossword-clues">
                        <dl className="crossword-clues__list">
                            <dt className="crossword-clues__list-title">Across</dt>
                            {ACROSS_CLUES.map(({ n, clue }) => (
                                <dd key={n} className={`crossword-clues__list-item ${direction === 'across' && activeClue === n ? 'crossword-clues__list-item--active' : ''}`} data-number={n}>
                                    {clue}
                                </dd>
                            ))}
                        </dl>
                        <dl className="crossword-clues__list">
                            <dt className="crossword-clues__list-title">Down</dt>
                            {DOWN_CLUES.map(({ n, clue }) => (
                                <dd key={n} className={`crossword-clues__list-item ${direction === 'down' && activeClue === n ? 'crossword-clues__list-item--active' : ''}`} data-number={n}>
                                    {clue}
                                </dd>
                            ))}
                        </dl>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Helpers ---

function findNextCell(r, c) {
    // Move right, then down
    for (let col = c + 1; col <= COLS; col++) {
        if (GRID[r - 1][col - 1] !== null) return { r, c: col };
    }
    for (let row = r + 1; row <= ROWS; row++) {
        for (let col = 1; col <= COLS; col++) {
            if (GRID[row - 1][col - 1] !== null) return { r: row, c: col };
        }
    }
    return null;
}

function findPrevCell(r, c) {
    for (let col = c - 1; col >= 1; col--) {
        if (GRID[r - 1][col - 1] !== null) return { r, c: col };
    }
    for (let row = r - 1; row >= 1; row--) {
        for (let col = COLS; col >= 1; col--) {
            if (GRID[row - 1][col - 1] !== null) return { r: row, c: col };
        }
    }
    return null;
}

function findNextInRow(r, c) {
    if (c + 1 <= COLS && GRID[r - 1][c] !== null) return { r, c: c + 1 };
    return null;
}

function findPrevInRow(r, c) {
    if (c - 1 >= 1 && GRID[r - 1][c - 2] !== null) return { r, c: c - 1 };
    return null;
}

function findNextInCol(r, c) {
    if (r + 1 <= ROWS && GRID[r][c - 1] !== null) return { r: r + 1, c };
    return null;
}

function findPrevInCol(r, c) {
    if (r - 1 >= 1 && GRID[r - 2][c - 1] !== null) return { r: r - 1, c };
    return null;
}

function getWordCells(r, c, direction) {
    if (!r || !c || GRID[r - 1][c - 1] === null) return [];
    const cells = [];
    if (direction === 'across') {
        let startC = c;
        while (startC > 1 && GRID[r - 1][startC - 2] !== null) startC--;
        let endC = c;
        while (endC < COLS && GRID[r - 1][endC] !== null) endC++;
        for (let col = startC; col <= endC; col++) cells.push(`${r}-${col}`);
    } else {
        let startR = r;
        while (startR > 1 && GRID[startR - 2][c - 1] !== null) startR--;
        let endR = r;
        while (endR < ROWS && GRID[endR][c - 1] !== null) endR++;
        for (let row = startR; row <= endR; row++) cells.push(`${row}-${c}`);
    }
    return cells;
}

function getActiveClue(r, c, direction) {
    if (!r || !c || GRID[r - 1][c - 1] === null) return null;
    let startR = r;
    let startC = c;
    if (direction === 'across') {
        while (startC > 1 && GRID[r - 1][startC - 2] !== null) startC--;
    } else {
        while (startR > 1 && GRID[startR - 2][c - 1] !== null) startR--;
    }
    const label = LABELS.find(l => l.r === startR && l.c === startC);
    return label ? label.n : null;
}

function checkComplete(cells) {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (GRID[r][c] !== null) {
                const key = `${r + 1}-${c + 1}`;
                const val = cells[key];
                if (!val || val.toUpperCase() !== GRID[r][c].toUpperCase()) return false;
            }
        }
    }
    return true;
}
