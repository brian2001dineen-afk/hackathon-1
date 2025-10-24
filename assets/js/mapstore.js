// Central map store. Add your levels here. Index 0 is the landing menu level.
// You can include optional header lines starting with ';' for settings like enemyTick or fontsize.
// Example:
// ; enemyTick=200
// ; fontsize=16
// Then followed by ASCII map rows.
(function () {
    const LANDING = [
        "; fontsize=16",
        "",
        "................................",
        "................................",
        ".................@..............",
        "................................",
        "................................",
    ].join("\n");

    const LEVEL_1 = [
        "; enemyTick=250",
        "################",
        "#@..$..v.......#",
        "#..###..###....#",
        "#..#......#...Z#",
        "#..#..$..<#....#",
        "#..###..###....#",
        "#.....^........#",
        "################",
    ].join("\n");

    // Expose globally
    window.MAP_STORE = [LANDING, LEVEL_1];
})();
