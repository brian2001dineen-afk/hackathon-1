(() => {
    "use strict";

    const outputEl = document.getElementById("terminal-output");
    const formEl = document.getElementById("terminal-form");
    const inputEl = document.getElementById("terminal-input");
    const gameListEl = document.getElementById("gameList");

    // If page not yet wired, bail silently
    if (!outputEl || !formEl || !inputEl) return;

    // Define available games here to keep terminal and modal in sync
    const games = [
        {
            key: "zipbomb",
            name: "Zipbomb",
            description: "A difficult movement game.",
            url: "/zipbomb.html",
        },
        {
            key: "carcrosser",
            name: "Car Crosser",
            description: "Don't crash. The game gets harder over time.",
            url: "/cargame.html",
        },
        {
            key: "pong",
            name: "Pong",
            description: "Classic pong.",
            url: "/pong.html",
        },
    ];

    // History handling
    const history = [];
    let historyIndex = -1;

    // Helpers
    const scrollToBottom = () => {
        outputEl.scrollTop = outputEl.scrollHeight;
    };

    const printLine = (content, cls = "output") => {
        const line = document.createElement("div");
        line.className = `terminal-line ${cls}`;
        if (typeof content === "string") {
            line.innerHTML = `<span class="output">${content}</span>`;
        } else {
            line.append(content);
        }
        outputEl.appendChild(line);
        scrollToBottom();
    };

    const printPrompted = (cmd) => {
        const line = document.createElement("div");
        line.className = "terminal-line";
        const prompt = document.createElement("span");
        prompt.className = "prompt";
        prompt.textContent = "guest@arcade:~$";
        const span = document.createElement("span");
        span.className = "output";
        span.textContent = " " + cmd;
        line.append(prompt, span);
        outputEl.appendChild(line);
    };

    const clearOutput = () => {
        outputEl.innerHTML = "";
    };

    const showWelcome = () => {
        printLine("<strong>Welcome to the Arcade Lobby</strong>");
        printLine("Type <code>help</code> to see available commands.");
        printLine(
            "Use <code>list</code> to see games, then <code>play &lt;game&gt;</code>."
        );
    };

    // Commands
    const commands = {
        help() {
            printLine("Available commands:");
            printLine("<code>help</code> — show this help");
            printLine("<code>list</code> — list available games");
            printLine(
                "<code>play &lt;game&gt;</code> — start a game, e.g. <code>play snake</code>"
            );
            printLine("<code>about</code> — about this site");
            printLine("<code>clear</code> — clear the terminal");
            printLine("<code>menu</code> — open graphical menu");
        },
        list() {
            printLine("Available games:");
            games.forEach((g) => {
                printLine(
                    `<code>${g.key}</code> — ${g.name} — <span class="text-secondary">${g.description}</span>`
                );
            });
        },
        play(arg) {
            if (!arg) {
                printLine("Usage: <code>play &lt;game&gt;</code>", "error");
                return;
            }
            const key = arg.toLowerCase();
            const game = games.find((g) => g.key === key);
            if (!game) {
                printLine(
                    `Unknown game: <code>${arg}</code>. Try <code>list</code>.`,
                    "error"
                );
                return;
            }
            // Placeholder navigation — replace URLs once games exist
            printLine(`Launching ${game.name}...`, "success");
            // For base implementation, we can navigate to anchors or future routes
            if (game.url && game.url !== "#") {
                setTimeout(() => {
                    window.location.href = game.url;
                }, 400);
            }
        },
        clear() {
            clearOutput();
        },
        about() {
            printLine("Arcade of 3 mini-games with a terminal-style lobby.");
        },
        menu() {
            const modal = bootstrap.Modal.getOrCreateInstance(
                document.getElementById("menuModal")
            );
            modal.show();
        },
    };

    // Modal list setup
    const renderGameList = () => {
        if (!gameListEl) return;
        gameListEl.innerHTML = "";
        games.forEach((g) => {
            const a = document.createElement("a");
            a.href = g.url;
            a.className =
                "list-group-item list-group-item-action d-flex justify-content-between align-items-center";
            a.innerHTML = `<span><strong>${g.name}</strong><br><small class="text-secondary">${g.description}</small></span><span class="badge bg-secondary">${g.key}</span>`;
            a.addEventListener("click", (e) => {
                e.preventDefault();
                printPrompted(`play ${g.key}`);
                commands.play(g.key);
                const modalEl = document.getElementById("menuModal");
                const modal = bootstrap.Modal.getInstance(modalEl);
                modal?.hide();
            });
            gameListEl.appendChild(a);
        });
    };

    // Handle input submit
    formEl.addEventListener("submit", (e) => {
        e.preventDefault();
        const raw = inputEl.value.trim();
        if (!raw) return;

        // echo the command line
        printPrompted(raw);

        // history update
        history.push(raw);
        historyIndex = history.length;

        // parse
        const [cmd, ...rest] = raw.split(/\s+/);
        const arg = rest.join(" ");

        const fn = commands[cmd?.toLowerCase()];
        if (fn) {
            try {
                fn(arg);
            } catch (err) {
                console.error(err);
                printLine(
                    "An error occurred while executing the command.",
                    "error"
                );
            }
        } else {
            printLine(
                `Command not found: <code>${cmd}</code>. Try <code>help</code>.`,
                "error"
            );
        }

        inputEl.value = "";
        scrollToBottom();
    });

    // Keyboard history navigation
    inputEl.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") {
            if (historyIndex > 0) {
                historyIndex--;
                inputEl.value = history[historyIndex] || "";
                // move cursor to end
                setTimeout(
                    () =>
                        inputEl.setSelectionRange(
                            inputEl.value.length,
                            inputEl.value.length
                        ),
                    0
                );
            }
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            if (historyIndex < history.length) {
                historyIndex++;
                inputEl.value = history[historyIndex] || "";
                setTimeout(
                    () =>
                        inputEl.setSelectionRange(
                            inputEl.value.length,
                            inputEl.value.length
                        ),
                    0
                );
            }
            e.preventDefault();
        }
    });

    // Initial render
    renderGameList();
    showWelcome();
})();
