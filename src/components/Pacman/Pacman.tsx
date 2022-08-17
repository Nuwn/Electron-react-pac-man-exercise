import { useEffect, useMemo, useState } from "react";
import CoroutineUtility, { WaitForSeconds } from "scripts/CoroutineUtility";
import { GetHorizontal, GetVertical } from "scripts/InputManager";

const style = {
    position: 'absolute',
    borderRadius: '100%',
    border: 0,
    backgroundColor: 'yellow',
    height: 30, 
    width: 30, 
    transition: 'all 0.2s linear'
}

export default function Pacman() {
    const enabled = true;
    const startPos = {x: 0, y: 0};

    const [targetPosition, setTargetPosition] = useState<Vector2>(startPos);

    useEffect(() => {
        console.log(targetPosition);
    }, [targetPosition]);

    const OnUpdate = useMemo(() => {
        function* Movement(){
            while(() => enabled === true){
                yield* WaitForSeconds(0.2);
                
                // validate grid
                // update target pos
                setTargetPosition((current) => { 
                    let input = {x: GetHorizontal(), y: GetVertical()};
                    let nextGrid = { x: current.x + input.x, y: current.y + input.y };
                    

                    return nextGrid;
                });
            }
        }

        CoroutineUtility.StartCoroutine(Movement());
    }, []);

    return (
        <div className="player" style={{...style, ...{top: targetPosition.y, left: targetPosition.x}}}></div>
    );
}
