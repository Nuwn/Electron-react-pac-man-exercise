import CoroutineUtility, { WaitForSeconds } from "./CoroutineUtility";
import { EventManager } from "./EventManager";

export default class Gamemanager {
    
    x: number = 0;
    coroutine: any;

    *GameLoop(){
        yield* WaitForSeconds(10);
        console.log("Game Starts");
        EventManager.Invoke("OnSetPause", false);
        yield* WaitForSeconds(10);
        EventManager.Invoke("OnSetPause", true);
    }

    constructor() {
        this.coroutine = CoroutineUtility.StartCoroutine(this.GameLoop());
    }

    Dispose() {
        CoroutineUtility.StopCoroutine(this.coroutine);
    }

}
