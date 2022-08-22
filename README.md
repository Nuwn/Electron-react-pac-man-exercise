# Electron-pac-man-exercise
 Building a game in react and electron to rearn more about the tools, frameworks and typescript.
 
 Many of the tools is directly inspired by Unity, where I have most experience in.
 
######  Currently in development.
 
#####  Key features:
- Tick system, Using "requestAnimationFrame" that gives me a good base for implementing deltaTime, incase browsers have different tick rates.
- Coroutines, The powerhouse of Unity is an absolute include in any game, the flexibility it provides when threading is not accessible is invaluable.
- Input system, A simple made input system that reads a key and time stamps it. This is made for the unique "queue like" movement feeling in the game.
- Singleton, Most of the systems is built with the singleton pattern, and initialized at start. It makes it alot easier to work with when you know you will only have 1 instance, that many components want to access. I've read about shared states for react, but that doesn't feel right for these systems.

These systems can be found in [Scripts](http://https://github.com/Nuwn/Electron-react-pac-man-exercise/tree/main/src/scripts "Scripts")

More to come.
