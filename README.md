# Electron-pac-man-exercise
 Building a game in react and electron to rearn more about the tools, frameworks and typescript.
 
 Keep in mind this is a learning and testing ground, so some code might not be the "optimal" way of doing the thing it does.
 There's many solutions to a problem, And I'm testing a lot of different solutions to learn more.  
 
 Many of the tools is directly inspired by Unity, where I have most experience in.
 
######  Currently in development.
 
#####  Key features:
- Tick system, Using "requestAnimationFrame" that gives me a good base for implementing deltaTime, incase browsers have different tick rates.
- Coroutines, The powerhouse of Unity is an absolute include in any game, the flexibility it provides when threading is not accessible is invaluable.
- Input system, A simple made input system that reads a key and time stamps it. This is made for the unique "queue like" movement feeling in the game.
- Singleton, Most of the systems is built with the singleton pattern, and initialized at start. It makes it alot easier to work with when you know you will only have 1 instance, that many components want to access. I've read about shared states for react, but that doesn't feel right for these systems.

These systems can be found in [Scripts](http://https://github.com/Nuwn/Electron-react-pac-man-exercise/tree/main/src/scripts "Scripts")

A* pathfinding from [EasystarJS](https://github.com/prettymuchbryce/easystarjs)

More to come.

# How to play
Clone, install, and run "npm run package", then navigate to release->build->win-unpacked and run "Pacman.exe"
