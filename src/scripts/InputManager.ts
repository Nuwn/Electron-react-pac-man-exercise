class InputManagerBase {
    static instance: InputManagerBase;

    pressedKeys: { [key: string]: boolean; } = {};

    constructor(){
        console.log("test input");
        window.onkeydown = (e: KeyboardEvent) => this.pressedKeys[e.key] = true;        
        window.onkeyup = (e: KeyboardEvent) => this.pressedKeys[e.key] = false;
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

export const GetKeyDown = (key: string): boolean => InputManagerBase.GetKeyDown(key);


