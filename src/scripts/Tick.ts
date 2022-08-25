export default class Tick {
    static instance: Tick;
    static deltaTime: number = Date.now();

    static updateTargets: (() => void)[] = []; 

    previousTimeStamp: number | undefined = undefined;

    constructor() {
        Tick.instance = this;

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

    static OnUpdate(action: () => void): void
    {
        Tick.updateTargets.push(action);
    }

    static StopUpdate(action: () => void): void { 
        Tick.updateTargets = Tick.updateTargets.filter(x => x !== action);
    }
    
    Update(): void {
        if (Tick.updateTargets.length <= 0) return;

        Tick.updateTargets.forEach((target) => {   
            target();
        });
    }
}


