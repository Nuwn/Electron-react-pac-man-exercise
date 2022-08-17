import CoroutineUtility, { WaitForSeconds } from "./CoroutineUtility";

export default class Gamemanager {
    x: number = 0;

    *GameLoop(){
        yield* WaitForSeconds(10);
        console.log("Game Starts");
    }

    constructor() {
        console.log("Gamemanager init");
        CoroutineUtility.StartCoroutine(this.GameLoop());

        // Tick.OnUpdate(() => {
        //     console.log("tick");
        // });
    }

}
