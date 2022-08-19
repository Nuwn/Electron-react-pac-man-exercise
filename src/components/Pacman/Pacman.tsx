import { Grid } from "components/Grid/Grid";
import { useEffect, useState } from "react";
import CoroutineUtility, { WaitForSeconds } from "scripts/CoroutineUtility";
import { GetHorizontal, GetVertical } from "scripts/InputManager";
import Tick from "scripts/Tick";

const style : any = {
    position: 'absolute',
    borderRadius: '100%',
    border: 0,
    backgroundColor: 'yellow',
    height: 36, 
    width: 36, 
    transition: 'all 0.37s linear'
}

export default function Pacman() {
    const enabled = true;
    const startPos = {x: 25, y: 16};

    const [coords, setCoords] = useState<Vector2>(startPos);
    const [position, setTargetPosition] = useState<Vector2>(startPos);


    useEffect(() => {

        const lastInput: Vector2 = {x: 0, y: 0};

        Tick.OnUpdate(() => {
            let input = {x: GetHorizontal(), y: GetVertical()};

            if(input == {x: 0, y: 0}) 
                return;
                
        })

        function* Movement(){
            while(() => enabled === true){
                yield* WaitForSeconds(0.2);              
                // validate grid
                // update target pos
                // setCoords((current) => { 

                //     setTargetPosition(Grid.GetPositionFromCoords(nextGrid));

                //     return nextGrid;
                // });
            }
        }

        CoroutineUtility.StartCoroutine(Movement());
    }, []);

    return (
        <div className="player" style={{...style, ...{top: position.y + 7, left: position.x + 7}}}></div>
    );
}
