import CoroutineUtility, { WaitForSeconds } from "./CoroutineUtility";
import { EventManager } from "./EventManager";

export default class Gamemanager {
    
    x: number = 0;
    coroutine: any;
    score: number = 0;

    *GameLoop(){
        yield* WaitForSeconds(10);
        console.log("Game Starts");
        EventManager.Invoke("OnSetPause", false);
    }

    AddPoints(points: number){
        this.score += points;
        console.log(this.score)
    }

    constructor() {
        this.AddPoints = this.AddPoints.bind(this);


        this.coroutine = CoroutineUtility.StartCoroutine(this.GameLoop());

        EventManager.AddListener('OnAddPoints', this.AddPoints);
    }

    Dispose() {
        CoroutineUtility.StopCoroutine(this.coroutine);
    }
}
