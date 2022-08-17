class InputManagerBase {
    static instance: InputManagerBase;

    pressedKeys: { [key: string]: boolean; } = {};

    constructor(){
        window.onkeydown = (e: KeyboardEvent) => this.pressedKeys[e.key] = true;        
        window.onkeyup = (e: KeyboardEvent) => this.pressedKeys[e.key] = false;
        window.onmousedown = (e: MouseEvent) => this.pressedKeys['Mouse'+e.button] = true;  
        window.onmouseup = (e: MouseEvent) => this.pressedKeys['Mouse'+e.button] = false;  
    }
    static GetOrCreateInstance() {
        if(this.instance == null) {
            this.instance = new InputManagerBase();
        }
        return this.instance;
    }
    static GetKeyDown(key: string){
        const instance = this.GetOrCreateInstance();
        return instance.pressedKeys[key] ?? (instance.pressedKeys[key] = false);
    }
}
export const InputGetOrCreateInstance = (): InputManagerBase => InputManagerBase.GetOrCreateInstance();

export const GetKeyDown = (key: string): boolean => InputManagerBase.GetKeyDown(key);

export const GetHorizontal = () : number => {
    return 0 + (GetKeyDown('a') || GetKeyDown('ArrowLeft') ? -1: 0) + (GetKeyDown('d') || GetKeyDown('ArrowRight') ? 1: 0);
}
export const GetVertical = () : number => {
    return 0 + (GetKeyDown('s') || GetKeyDown('ArrowDown') ? 1: 0) + (GetKeyDown('w') || GetKeyDown('ArrowUp') ? -1: 0);
}

