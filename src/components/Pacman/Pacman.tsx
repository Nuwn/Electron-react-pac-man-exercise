import { Grid } from "components/Grid/Grid";
import { useEffect, useMemo, useState } from "react";
import CoroutineUtility, { WaitForSeconds } from "scripts/CoroutineUtility";
import { GetSingleDirection } from "scripts/InputManager";
import Tick from "scripts/Tick";
import { Vector2 } from "scripts/Types";

const style : any = {
    position: 'absolute',
    borderRadius: '100%',
    border: 0,
    backgroundColor: 'yellow',
    height: 36, 
    width: 36, 
    transition: 'all 0.2s linear'
}

export default function Pacman() {
    const enabled = true;
    const startPos = new Vector2(25, 16);

    const [coords, setCoords] = useState<IVector2>(startPos);
    const [position, setTargetPosition] = useState<IVector2>(Grid.GetPositionFromCoords(startPos));

    useMemo(() => {

        let prevInput: IVector2 = Vector2.Zero();
        let lastInput: IVector2 = Vector2.Zero();

        Tick.OnUpdate(() => {          
            let input = GetSingleDirection();

            if(input != Vector2.Zero()) 
                lastInput = input;  
        });

        function* Movement(){
            while(() => enabled === true){
                yield* WaitForSeconds(0.2);              
                
                setCoords((current) => { 

                    // We have not made a move
                    if (Vector2.isZero(lastInput) && Vector2.isZero(prevInput)){
                        return current;
                    }
                    // if no new input, keep moving with previous action
                    if(Vector2.isZero(lastInput))
                    {
                        const newDir = {x: current.x + prevInput.x, y: current.y + prevInput.y};
                        
                        if(Grid.ValidateCoord(newDir)){
                            setTargetPosition( Grid.GetPositionFromCoords(newDir));
                            return newDir;
                        }
                        else{
                            return current;
                        }
                    }
                    else{
                        // we have new input position
                        let newDir = {x: current.x + lastInput.x, y: current.y + lastInput.y};
                        
                        if(Grid.ValidateCoord(newDir)){
                            setTargetPosition( Grid.GetPositionFromCoords(newDir));
                            prevInput = lastInput;
                            return newDir;
                        }
                        else{
                            newDir = {x: current.x + prevInput.x, y: current.y + prevInput.y};
                        
                            if(Grid.ValidateCoord(newDir)){
                                setTargetPosition( Grid.GetPositionFromCoords(newDir));
                                return newDir;
                            }
                            else{
                                return current;
                            }
                        }
                    }
                });
            }
        }

        CoroutineUtility.StartCoroutine(Movement());
    }, []);

    return (
        <div className="player" style={{...style, ...{top: position.y + 2, left: position.x + 2}}}></div>
    );
}
