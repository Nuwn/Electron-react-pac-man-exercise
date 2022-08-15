import Tick from "./Tick";

/**
*Init(){
    yield* WaitUntil(() => this.x == 1);
    console.log("init")
}

constructor() {
    CoroutineUtility.StartCoroutine(this.Init());
    setTimeout(() => this.x = 1, 5000);
}
*/
export default class CoroutineUtility {
    static instance: CoroutineUtility;
    static enumerators: Coroutine[] = [];

    
    constructor() {
        CoroutineUtility.instance = this;

        Tick.OnUpdate(() => {
            this.Invoke();
        })
    }

    Invoke() {
        if (CoroutineUtility.enumerators.length <= 0) 
            return;

        CoroutineUtility.enumerators.forEach((item, index, source) => {       
            item.next();
        });
    }

    static StartCoroutine(action: Generator){
        const coroutine = Coroutine.Generate(action, () => {
            CoroutineUtility.Remove(coroutine);
        });
        CoroutineUtility.enumerators.push(coroutine);
    }

    static Remove(coroutine: Coroutine) {
        const index = this.enumerators.indexOf(coroutine);
        if (index > -1) {
            this.enumerators.splice(index, 1);
        }
    }
}

class Coroutine implements Enumerator{
    isDone: boolean | undefined = false;
    action: Generator;
    onComplete: () => void;

    constructor(action: Generator, onComplete: () => void){
        this.action = action;
        this.onComplete = () => {
            onComplete();
        }
    }

    next(){
        if(this.isDone)
            this.onComplete();
          
        this.isDone = this.action.next().done;
    }

    static Generate(_action: Generator, _onComplete: () => void){
        return new Coroutine(_action, _onComplete);
    }
}

export const WaitUntil = function* (rule: () => boolean){
    while (rule() === false) {
        yield false; 
    }
    yield true;
} 
export const WaitForSeconds = function* (seconds: number){
    console.time();
    const time = seconds * 1000; // JS likes miliseconds
    const start = Date.now();

    while(Date.now() - start <= (time - Tick.deltaTime)){
        yield false;
    }
    yield true;
    console.timeEnd();
}

export interface Enumerator {
    next() : void;
}