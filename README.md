# Hackathon title

> An arcade baked into a terminal interface, explore our three blast from the past classic recreations. From a game based on the classic Frogger, a Worlds Hardest Game callback, or back to the old faithful with classic pong.

This website serves as a base for 3 minigames made over the course of 3 days. These minigames are accesed on the main page through a terminal style interface. We wanted to capture some of the games we were fond of on our youth. As well as this, we wanted to give an added sense of nostalgia through interacting with a command line interface.

## User Experience (UX)

### User Stories

…

## Early Design

![](https://i.imgur.com/554E7Nn.png)

We initially started with the terminal homepage as a connector for the site games. Then we each worked individually on our own pages, fleshing out our games in isolation.

Early development of zipbomb:

![](https://i.imgur.com/5yDt1M7.png)

Prototype image: the player being the red ball; enemy = blue ball; coin = yellow ball.

Most of the time was spent on the foundational elements, including

1. collision detection
2. a level builder
3. per-level enemy AI programming

The limitations of the canvas became apparent later on in development, mainly that it would be much smoother to use text directly for the games graphical interface, rather than trying to emulate a vim environment in canvas. After this early version was finished, the game was rewritten from the ground up.

![](https://i.imgur.com/qSWBta9.png)

Prototype image: the assets were converted to text characters and were styled to match the previous theme.

After the base rewrite, more emphasis was focused on utilizing the text medium to the games advantage, including
- ASCII art for some of the level design
- Font options to change graphics without introducing blurriness or compression
- Lightweight performance on GPU-limited machines

Early development of Car Crosser:

Initially the game was designed to be like the game frogger, but over time the game turned into a game where you are a car driving while avoiding oncoming cars.

Early development included:

1. Creating a square the user could control with the keyboard.
2. Creating other shapes that moved around the screen acting as obstacles.
3. Create events when the player square collided with an obstacle shape.

## Features

### Arcade Homepage

…

### Fully-Functional Games

…

#### Zipbomb

#### Frogger

#### Pong

### Navigation & User Experience

-   **Accessibility options**: graphical game menu
-   …

## Design Philosophy

-   **Layout and Navigation**:…
-   **Color scheme**:
    -   …
-   **Typography**:…

## Testing

### Manual Testing

…

### Browser Validation

…

## Known Bugs

…

## Future Improvements

Car Crosser:
1. Adding a difficultly setting to the main menu which would increase the oncoming cars speeds or make the cars themselves bigger.
2. Adding a score leaderboard based on how long you drove before crashing.
3. Have the car turn when the user drives left or right. (Would be challenging due to changes in collision)

## Technologies and References

…

---
