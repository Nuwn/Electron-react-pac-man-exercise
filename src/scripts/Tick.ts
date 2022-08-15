export default class Tick {
    static instance: Tick;
    static deltaTime: number = Date.now();

    static updateTargets: (() => void)[] = []; 

    tickRate : number;
    previousTimeStamp: number | undefined = undefined;

    constructor(tickRate: number) {
        Tick.instance = this;
        this.tickRate = tickRate;

        requestAnimationFrame(this.Tick.bind(this));
    }

    Tick(timestamp: any): void {
        if(this.previousTimeStamp === undefined) {
            this.previousTimeStamp = timestamp;
        }

        Tick.deltaTime = timestamp - this.previousTimeStamp!;

        this.Update();

        this.previousTimeStamp = timestamp;
        requestAnimationFrame(this.Tick.bind(this));
    }

    static OnUpdate(action: () => void): void{
        Tick.updateTargets.push(action);
    }
    
    Update(): void {
        if (Tick.updateTargets.length <= 0) return;

        Tick.updateTargets.forEach((target, index, source) => {   
            if(target == null){
                source.splice(index, 1);
                return;
            }

            target();
        });
    }
}


