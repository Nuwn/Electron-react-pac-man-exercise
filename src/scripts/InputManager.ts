class InputManagerBase {
    static instance: InputManagerBase;

    pressedKeys: { [key: string]: IInput; } = {};

    constructor(){
        window.onkeydown = (e: KeyboardEvent) => {
            if (e.repeat) return;
            this.SetValue(e.key, { active: true, lastInput: Date.now()});
        };        
        window.onkeyup = (e: KeyboardEvent) => {
            if (e.repeat) return;
            this.SetValue(e.key, {active: false});
        };

        window.onmousedown = (e: MouseEvent) => this.SetValue('Mouse'+e.button, { active: true, lastInput: Date.now() });  
        window.onmouseup = (e: MouseEvent) => this.SetValue('Mouse'+e.button, {active: false});
    }

    SetValue(key: string, params: {}){
        var old = this.pressedKeys[key] ?? { active: false, lastInput: 0 };
        this.pressedKeys[key] = {...old, ...params};
    }

    static GetOrCreateInstance() {
        if(this.instance == null) {
            this.instance = new InputManagerBase();
        }
        return this.instance;
    }
    
    static GetKey(key: string){
        const instance = this.GetOrCreateInstance();
        return instance.pressedKeys[key] ?? (instance.pressedKeys[key] = { active: false, lastInput: 0 });
    }
}
export const InputGetOrCreateInstance = (): InputManagerBase => InputManagerBase.GetOrCreateInstance();

export const GetKey = (key: string): boolean => InputManagerBase.GetKey(key).active;

export const GetInput = (key: string): IInput => InputManagerBase.GetKey(key);

export const GetHorizontal = () : number => {
    return 0 + (GetKey('a') || GetKey('ArrowLeft') ? -1: 0) + (GetKey('d') || GetKey('ArrowRight') ? 1: 0);
}
export const GetVertical = () : number => {
    return 0 + (GetKey('s') || GetKey('ArrowDown') ? 1: 0) + (GetKey('w') || GetKey('ArrowUp') ? -1: 0);
}

export const GetSingleDirection: () => IVector2 = () => {
    const pressedKeys = InputManagerBase.instance.pressedKeys;
    const keys = ['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];
    let newest: [string, IInput];

    Object.entries(pressedKeys).forEach((value) => {
        if(!keys.includes(value[0])){
            return;
        }
        if(newest == null){
            newest = value;
            return;
        }

        if(newest[1].active){
            if(!value[1].active)
            return;

            if(value[1].lastInput > newest[1].lastInput)
                newest = value;
            
            return;
        }
        else{
            if(value[1].active){
                newest = value;
                return;
            }
            
            if(value[1].lastInput > newest[1].lastInput)
                newest = value;
        }  
    });

    
    if(newest! == null)
        return {x: 0, y: 0};

    switch(newest[0]){
        case 'w' || 'ArrowUp':
            return {x: 0, y: -1};
        case 'a' || 'ArrowLeft':
            return {x: -1, y: 0};
        case 's' || 'ArrowDown':
            return {x: 0, y: 1};
        case 'd' || 'ArrowRight':
            return {x: 1, y: 0};
        default:
            return {x: 0, y: 0};
    }
}

