// Vim-styled grid game
(() => {
    "use strict";

    // DOM elements
    const bufferEl = document.getElementById("vim-buffer");
    const gutterEl = document.getElementById("vim-gutter");
    const statusEl = document.getElementById("vim-statusline");
    const mapInputEl = document.getElementById("map-input");
    const loadBtn = document.getElementById("load-map-btn");
    const exportBtn = document.getElementById("export-map-btn");

    if (!bufferEl || !gutterEl || !statusEl) return;

    // Symbols mapping
    const SYM = {
        wall: "#",
        floor: ".", // or space
        player: "@",
        enemyUp: "^",
        enemyDown: "v",
        enemyLeft: "<",
        enemyRight: ">",
        coin: "$",
        victory: "Z",
    };

    // Token to CSS class
    const CLASS = {
        [SYM.wall]: "token-wall",
        [SYM.player]: "token-player",
        [SYM.enemyUp]: "token-enemy",
        [SYM.enemyDown]: "token-enemy",
        [SYM.enemyLeft]: "token-enemy",
        [SYM.enemyRight]: "token-enemy",
        [SYM.coin]: "token-coin",
        [SYM.victory]: "token-victory",
    };

    // Enemy helpers
    const ENEMY_CHARS = new Set([
        SYM.enemyUp,
        SYM.enemyDown,
        SYM.enemyLeft,
        SYM.enemyRight,
    ]);
    const charToDir = (ch) =>
        ({
            [SYM.enemyUp]: "up",
            [SYM.enemyDown]: "down",
            [SYM.enemyLeft]: "left",
            [SYM.enemyRight]: "right",
        }[ch]);
    const dirToChar = (dir) =>
        ({
            up: SYM.enemyUp,
            down: SYM.enemyDown,
            left: SYM.enemyLeft,
            right: SYM.enemyRight,
        }[dir] || SYM.enemyDown);
    const dirDelta = (dir) =>
        ({
            up: { dc: 0, dr: -1 },
            down: { dc: 0, dr: 1 },
            left: { dc: -1, dr: 0 },
            right: { dc: 1, dr: 0 },
        }[dir] || { dc: 0, dr: 1 });
    const oppositeDir = (dir) =>
        ({
            up: "down",
            down: "up",
            left: "right",
            right: "left",
        }[dir] || "down");

    // Game state
    const state = {
        rows: 0,
        cols: 0,
        grid: [], // array of strings or chars
        px: 0, // player col
        py: 0, // player row
        mode: "NORMAL",
        countBuf: "", // numeric prefix buffer
        collected: 0,
        won: false,
        cmdBuf: "", // command-line buffer after ':'
        currentText: "", // last exported text (without @)
        originalText: "", // last loaded text including '@' (used for restart)
        spawnx: 0,
        spawny: 0,
        enemies: [], // {x,y,dir}
        enemyTimerId: null,
    };

    // Sample level to start
    const SAMPLE = [
        "################",
        "#@..$..v.......#",
        "#..###..###....#",
        "#..#......#...Z#",
        "#..#..$..<#....#",
        "#..###..###....#",
        "#.....^........#",
        "################",
    ].join("\n");

    // Utilities
    function clamp(n, min, max) {
        return Math.max(min, Math.min(max, n));
    }

    function setStatus(message) {
        const pos = `${state.py + 1},${state.px + 1}`;
        if (state.mode === "CMD") {
            statusEl.textContent = `:${state.cmdBuf}`;
            return;
        }
        const prefix = state.countBuf ? state.countBuf : "";
        const left = `-- ${state.mode} --`;
        const msg = message ? `  ${message}` : "";
        statusEl.textContent = `${left}  ${pos}  ${prefix}${msg}`.trim();
    }

    function parseMapFromText(text) {
        const lines = text.replace(/\r/g, "").split("\n");
        const cols = Math.max(...lines.map((l) => l.length));
        const padded = lines.map((l) => l.padEnd(cols, " "));
        const grid = padded.map((l) => l.split(""));
        // keep a normalized copy that retains '@' for proper restarts
        state.originalText = padded.join("\n");
        let px = 0,
            py = 0;
        const enemies = [];
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                const ch = grid[r][c];
                if (ch === SYM.player) {
                    px = c;
                    py = r;
                    grid[r][c] = SYM.floor;
                } else if (ENEMY_CHARS.has(ch)) {
                    enemies.push({ x: c, y: r, dir: charToDir(ch) });
                    grid[r][c] = SYM.floor;
                }
            }
        }
        state.rows = grid.length;
        state.cols = cols;
        state.grid = grid;
        state.px = px;
        state.py = py;
        state.spawnx = px;
        state.spawny = py;
        state.collected = 0;
        state.won = false;
        state.countBuf = "";
        state.cmdBuf = "";
        // Save a normalized export (without @) separately if needed elsewhere
        state.currentText = exportMapToText();
        state.enemies = enemies;
        startEnemyLoop();
    }

    function exportMapToText() {
        // Include player and enemies so exports are reloadable
        const out = state.grid.map((row) => row.slice());
        for (const e of state.enemies) {
            if (
                e.y >= 0 &&
                e.y < out.length &&
                e.x >= 0 &&
                e.x < out[e.y].length
            ) {
                out[e.y][e.x] = dirToChar(e.dir);
            }
        }
        if (
            state.py >= 0 &&
            state.py < out.length &&
            state.px >= 0 &&
            state.px < (out[state.py]?.length || 0)
        ) {
            out[state.py][state.px] = SYM.player;
        }
        return out.map((row) => row.join("")).join("\n");
    }

    // Rendering
    function render() {
        // gutter
        const width = String(state.rows).length;
        gutterEl.innerHTML = Array.from(
            { length: state.rows },
            (_, i) => `<div>${String(i + 1).padStart(width, " ")}</div>`
        ).join("");

        // grid -> spans
        const lines = [];
        for (let r = 0; r < state.rows; r++) {
            const row = state.grid[r].slice();
            // overlay enemies on this row
            for (const e of state.enemies) {
                if (e.y === r && e.x >= 0 && e.x < row.length) {
                    row[e.x] = dirToChar(e.dir);
                }
            }
            // ensure exactly one player rendered: override cell at player pos visually (player on top)
            if (r === state.py) {
                row[state.px] = SYM.player;
            }
            const cells = row
                .map((ch, c) => {
                    const cls = CLASS[ch] || "";
                    const isCursor = r === state.py && c === state.px;
                    const extra = isCursor ? " cell-cursor" : "";
                    const safe = ch === " " ? "&nbsp;" : ch;
                    return `<span class="${cls}${extra}">${safe}</span>`;
                })
                .join("");
            const lineClass = r === state.py ? "cursor-line" : "";
            lines.push(`<div class="${lineClass}">${cells}</div>`);
        }
        // Important: avoid inserting raw newlines between block elements inside <pre>
        // which creates extra blank lines due to white-space: pre
        bufferEl.innerHTML = lines.join("");
    }

    // Movement and collision
    function isWall(c, r) {
        if (r < 0 || r >= state.rows || c < 0 || c >= state.cols) return true;
        return state.grid[r][c] === SYM.wall;
    }

    function enemiesStep() {
        if (state.won) return;
        let moved = false;
        for (const e of state.enemies) {
            const { dc, dr } = dirDelta(e.dir);
            let nx = clamp(e.x + dc, 0, state.cols - 1);
            let ny = clamp(e.y + dr, 0, state.rows - 1);
            if (isWall(nx, ny)) {
                // bounce to opposite direction
                e.dir = oppositeDir(e.dir);
                const b = dirDelta(e.dir);
                nx = clamp(e.x + b.dc, 0, state.cols - 1);
                ny = clamp(e.y + b.dr, 0, state.rows - 1);
                if (isWall(nx, ny)) {
                    continue; // stuck
                }
            }
            e.x = nx;
            e.y = ny;
            moved = true;
        }

        // collision with player -> reset to spawn
        for (const e of state.enemies) {
            if (e.x === state.px && e.y === state.py) {
                state.px = state.spawnx;
                state.py = state.spawny;
                break;
            }
        }
        if (moved) {
            render();
            setStatus("");
        }
    }

    function startEnemyLoop() {
        if (state.enemyTimerId) {
            clearInterval(state.enemyTimerId);
            state.enemyTimerId = null;
        }
        if (!state.enemies || state.enemies.length === 0) return;
        state.enemyTimerId = setInterval(enemiesStep, 300);
    }

    function tryStep(dc, dr, count) {
        let steps = count || 1;
        while (steps-- > 0) {
            const nx = clamp(state.px + dc, 0, state.cols - 1);
            const ny = clamp(state.py + dr, 0, state.rows - 1);
            if (isWall(nx, ny)) break; // stop at wall
            state.px = nx;
            state.py = ny;
            // pick coin
            if (state.grid[ny][nx] === SYM.coin) {
                state.collected++;
                state.grid[ny][nx] = SYM.floor;
            }
            // victory
            if (state.grid[ny][nx] === SYM.victory) {
                state.won = true;
            }
            // enemy collision
            for (const e of state.enemies) {
                if (e.x === state.px && e.y === state.py) {
                    state.px = state.spawnx;
                    state.py = state.spawny;
                    steps = 0; // stop further stepping in this motion
                    break;
                }
            }
        }
        render();
        setStatus(state.won ? "Victory! (press :q to exit)" : "");
    }

    // Input handling: NORMAL mode with counts and hjkl motions
    function handleKeydown(e) {
        // allow Ctrl sequences for future; prevent page scroll on arrows
        if (
            [
                "ArrowUp",
                "ArrowDown",
                "ArrowLeft",
                "ArrowRight",
                " ",
                "PageUp",
                "PageDown",
            ].includes(e.key)
        )
            e.preventDefault();

        // Command-line mode handling (after ':')
        if (state.mode === "CMD") {
            if (e.key === "Escape") {
                state.mode = "NORMAL";
                state.cmdBuf = "";
                setStatus("");
                return;
            }
            if (e.key === "Backspace") {
                state.cmdBuf = state.cmdBuf.slice(0, -1);
                setStatus("");
                e.preventDefault();
                return;
            }
            if (e.key === "Enter") {
                const cmd = state.cmdBuf.trim();
                // Minimal command support
                if (cmd === "q") {
                    // Restart current map from original text containing '@'
                    parseMapFromText(
                        state.originalText || mapInputEl?.value || ""
                    );
                    render();
                    state.won = false;
                    state.mode = "NORMAL";
                    state.cmdBuf = "";
                    setStatus("Restarted");
                } else {
                    state.mode = "NORMAL";
                    const msg = cmd ? `Unknown command: ${cmd}` : "";
                    state.cmdBuf = "";
                    setStatus(msg);
                }
                return;
            }
            // add printable characters
            if (e.key.length === 1) {
                state.cmdBuf += e.key;
                setStatus("");
            }
            return;
        }

        if (/^[0-9]$/.test(e.key)) {
            // number prefix count; ignore leading 0 when buffer empty
            if (e.key === "0" && state.countBuf === "") return;
            state.countBuf += e.key;
            setStatus("");
            return;
        }

        const count = state.countBuf ? parseInt(state.countBuf, 10) : 1;
        state.countBuf = "";

        switch (e.key) {
            case "h":
            case "ArrowLeft":
                tryStep(-1, 0, count);
                break;
            case "j":
            case "ArrowDown":
                tryStep(0, 1, count);
                break;
            case "k":
            case "ArrowUp":
                tryStep(0, -1, count);
                break;
            case "l":
            case "ArrowRight":
                tryStep(1, 0, count);
                break;
            case ":":
                // enter command-line mode
                state.mode = "CMD";
                state.cmdBuf = "";
                setStatus("");
                break;
            default:
                // ignore for now
                setStatus("");
        }
    }

    // Wire buttons
    loadBtn?.addEventListener("click", () => {
        parseMapFromText(mapInputEl.value || SAMPLE);
        render();
        setStatus("Loaded map");
    });
    exportBtn?.addEventListener("click", () => {
        mapInputEl.value = exportMapToText();
        setStatus("Exported current map to textarea");
    });

    // Init with sample
    mapInputEl && (mapInputEl.value = SAMPLE);
    parseMapFromText(SAMPLE);
    render();
    setStatus("Type a count then hjkl to move.");

    // Focus buffer for keyboard control
    bufferEl.tabIndex = 0;
    bufferEl.focus();
    window.addEventListener("keydown", handleKeydown);
})();
