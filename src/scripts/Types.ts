export { }

declare global {
    interface IVector2{
        x: number;
        y: number;
    }

    interface IInput{
        active: boolean;
        lastInput: number;
    }
}

export class Vector2 implements IVector2{
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static Zero(): IVector2{
        return new Vector2(0, 0);
    }
    static isZero(value: IVector2){
        return value.x === 0 && value.y === 0;
    } 
        

}