
export function Clamp(value: number)
{
    return (value < 0) ? 0 : (value > 1) ? 1 : value;
}

export function Lerp(a:number, b:number, t:number) :number
{
    return a + (b - a) * Clamp(t);
}

export function Vector2Lerp(a: Vector2, b: Vector2, t: number): Vector2 {
    t = Clamp(t);
    return {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t
    };
} 