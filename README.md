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
![](https://i.imgur.com/5yDt1M7.png)[^1]

[^1]: Prototype image: the player being the red ball; enemy = blue ball; coin = yellow ball.

Most of the time was spent on the foundational elements, including

1. collision detection
2. a level builder
3. per-level enemy AI programming

Once these elements were in place, focus was shifted towards graphics and audio implementation.

## Early Design Pong

For my game design, I just decided to stick with the classic game of pong, black background, two white paddles, white boundary lines and white center white line.

![Wireframe1](assets/images/hacketonpicsver6.png)
I first got a ball bouncing on screen, I followed some tutorials and read documentation for canvas on to draw the ball and make it move, when I was happy with that I added the black background and made the ball red to make it stand out.

![Wireframe2](assets/images/hacketonpicvers1.png)
I then drew the center line and added two rectangle paddles to the canvas

![Wireframe3](assets/images/finishedproduct.png)
I then drew two boundary lines on the canvas and that was it the design was done and it was time to implement game features. I also added player and computer score text which increment when either player or computer score and added a button which starts the game.

I spent the most time on the AI player, trying to improve it, by not making it to hard or to easy.

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

Pong

The main bug in pong is the AI is very janky and is to easy to play against, at one point it was unbeatable.

…

## Future Improvements

I want to make the following future improvements for Pong:

-   Improve the AI and not have it so janky.
-   Add buttons to set number of games the player wants to play.
-   Add a reset button to reset game and start over.
-   Add buttons or a slider to make the game harder, increase ball speed etc.
-   Make where the ball bounces more unpredictable and random.
-   Have the ability to drop in more balls.
-   Add sound effects when the ball bounces off walls or the player or AI score.

## Technologies and References

For this project we used the following technologies

HTML 5 Canvas
Javascript
CSS

…

## Deployment

## Credits

---
