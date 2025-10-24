// Central map store. Add your levels here. Index 0 is the landing menu level.
// You can include optional header lines starting with ';' for settings like enemyTick or fontsize.
// Example:
// ; enemyTick=200
// ; fontsize=16
// Then followed by ASCII map rows.
(function () {
    const LANDING = [
        "; title=zipbomb.rar",
        "; fontsize=24",
        "   ________ ____  ____   ___  __  __ ____  ",
        "  |__  /_ _|  _ \\| __ ) / _ \\|  \\/  | __ ) ",
        "    / / | || |_) |  _ \\| | | | |\\/| |  _ \\ ",
        "   / /_ | ||  __/| |_) | |_| | |  | | |_) |",
        "  /____|___|_|   |____/ \\___/|_|  |_|____/ ",
        "",
        "         h j k l  or  Arrow Keys",
        "         pre/nxt  map:  J  /  L",
        "",
        "  @       get to the z to start!         Z",
    ].join("\n");

    const LEVEL_1 = [
        "; title=zipbomb.rar/lvls/babysteps.txt",
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

    const LEVEL_2 = [
        "; title=zipbomb.rar/lvls/gottagofast.txt",
        "; enemyTick=250",
        "#####################",
        "#@....#...........#Z#",
        "#>....#....<#>....#.#",
        "#....<#>....#....<#.#",
        "#>....#....<#>....#.#",
        "#....<#>....#....<#.#",
        "#>....#....<#>....#.#",
        "#....<#>....#....<#.#",
        "#>....#....<#>....#.#",
        "#....<#>....#....<#.#",
        "#...........#.......#",
        "#####################",
    ].join("\n");

    const LEVEL_3 = [
        "; title=zipbomb.rar/lvls/money_sandwich.txt",
        "; enemyTick=300",
        "###################",
        "#..v.v.v.v.v.v.v.Z#",
        "#.#.#.#.#.#.#.#.#.#",
        "#........$........#",
        "#........$........#",
        "#@.......$........#",
        "##.#.#.#.#.#.#.#.##",
        "#.^.^.^.^.^.^.^.^.#",
        "###################",
    ].join("\n");

    const LEVEL_4 = [
        "; title=zipbomb.rar/lvls/chaos.txt",
        "; enemyTick=180",
        "############################",
        "#@.........#.......>......Z#",
        "#####.##...#..###.#.##.#####",
        "#.$#...#...#..##..#.#...####",
        "#$.#.^.#...#..##$.#.#.^.####",
        "#....$.....<..###.#.##..####",
        "#..#...#...#.....^......####",
        "#..##.##...######.####..####",
        "#..........######$.........#",
        "############################",
    ].join("\n");

    const LEVEL_5 = [
        "; title=zipbomb.rar/lvls/hell.txt",
        "; enemyTick=140",
        "#######################",
        "#@...............#....#",
        "#.....................#",
        "#..#...........#...#..#",
        "#^.^.^.^.^.^.^.^.^.^.^#",
        "#.<.<#<.<.<.>#>.>.>.>##",
        "#v.v.v.v.v.v.v.v.v.v.v#",
        "#......#...#..........#",
        "#.....................#",
        "#........#...........Z#",
        "#######################",
    ].join("\n");

    const LEVEL_10 = [
        "; title=zipbomb.rar/lvls/gg.txt",
        "; enemyTick=140",
        "; fontsize=14",
        "                                                                         ZZZZZZ                               ",
        "                                                                         ZZZZZZ                               ",
        "                                                                         ZZZZZZ                               ",
        "             ZZZZZZZZZZ              ZZZZZZZZZZ               ZZZZZZZZZZ ZZZZZZ         ZZZZZZZZZZ            ",
        "          ZZZZZZZZZZZZZZZZ         ZZZZZZZZZZZZZZZ          ZZZZZZZZZZZZZZZZZZZ       ZZZZZZZZZZZZZZ          ",
        "        ZZZZZZZZZZZZZZZZZZZZ     ZZZZZZZZZZZZZZZZZZZ      ZZZZZZZZZZZZZZZZZZZZZ     ZZZZZZZZZZZZZZZZZZ        ",
        "       ZZZZZZZZZ    ZZZZZZZZ    ZZZZZZZZ    ZZZZZZZZZ    ZZZZZZZZZ   ZZZZZZZZZZ   ZZZZZZZZ      ZZZZZZZZ      ",
        "       ZZZZZZZ        ZZZZZZZ  ZZZZZZZ         ZZZZZZZ  ZZZZZZZ         ZZZZZZZ   ZZZZZZ          ZZZZZZ      ",
        "      ZZZZZZZ                  ZZZZZZ           ZZZZZZ  ZZZZZZ           ZZZZZZ  ZZZZZZZZZZZZZZZZZZZZZZZZ     ",
        "      ZZZZZZ                  ZZZZZZZ           ZZZZZZ ZZZZZZZ           ZZZZZZ  ZZZZZZZZZZZZZZZZZZZZZZZZ     ",
        "      ZZZZZZZ                  ZZZZZZ           ZZZZZZ  ZZZZZZ           ZZZZZZ  ZZZZZZZZZZZZZZZZZZZZZZZZ     ",
        "       ZZZZZZZ        ZZZZZZZ  ZZZZZZZ         ZZZZZZZ  ZZZZZZZ         ZZZZZZZ   ZZZZZZ          ZZZZZZ      ",
        "       ZZZZZZZZZ    ZZZZZZZZ    ZZZZZZZZ    ZZZZZZZZZ   ZZZZZZZZZ     ZZZZZZZZZ   ZZZZZZZZ      ZZZZZZZZ      ",
        "        ZZZZZZZZZZZZZZZZZZZZ     ZZZZZZZZZZZZZZZZZZZ      ZZZZZZZZZZZZZZZZZZZZZ     ZZZZZZZZZZZZZZZZZZ        ",
        "          ZZZZZZZZZZZZZZZZ         ZZZZZZZZZZZZZZZ         ZZZZZZZZZZZZZZZZZZZZ      ZZZZZZZZZZZZZZZZ         ",
        "             ZZZZZZZZZZ               ZZZZZZZZZ                ZZZZZZZZZ ZZZZZZ          ZZZZZZZZZ            ",
        "                                                                                                              ",
        "                                                        @                                                     ",
        "                                                       ZZZ                ZZ  ZZ  ZZ          ZZ              ",
        "                                                        Z  ZZZZZ    ZZZZ ZZZZ ZZ ZZZZ  Z   ZZ ZZZZ  ZZZ       ",
        "                                                       ZZZ ZZ  ZZ ZZZ    ZZZ  ZZ  ZZ  ZZZ  ZZ ZZ   ZZ  ZZ     ",
        "                                                       ZZZ ZZ  ZZ  ZZZZZ ZZZ  ZZ  ZZ  ZZZ  ZZ ZZ  ZZZZZZZ     ",
        "                                                       ZZZ ZZ  ZZ ZZZZZZ  ZZZ ZZ  ZZZ  ZZZZZZ ZZZZ ZZZZZZ     ",
        "                                                                                                              ",
        "                                             thanks for playing!                                                                 ",
    ].join("\n");
    // Expose globally
    window.MAP_STORE = [LANDING, LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5, LEVEL_10];
})();
