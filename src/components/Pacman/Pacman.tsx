import { useEffect, useState } from "react";
import Tick from "scripts/Tick";
import CoroutineUtility, { WaitForSeconds, WaitUntil } from "scripts/CoroutineUtility";
import { GetSingleDirection } from "scripts/InputManager";
import { EventManager } from "scripts/EventManager";
import { ColliderComponent } from "components/ColliderComponent";
import { Grid } from "components/Grid/Grid";
import { Vector2 } from "scripts/Types";
import { Collider } from "scripts/Physics";

const style : any = {
    position: 'absolute',
    borderRadius: '100%',
    border: 0,
    backgroundColor: 'yellow',
    height: 36, 
    width: 36, 
    transition: 'all 0.2s linear'
}

const startPosition = new Vector2(16, 15);

class Pacman{

    enabled = false;
    prevInput: IVector2 = Vector2.Zero();
    lastInput: IVector2 = Vector2.Zero();
    coroutine: any;

    SetEnabled(v: boolean){
        this.enabled = !v
    }

    constructor(setCoords: any, setTargetPosition: any){
        this.SetEnabled = this.SetEnabled.bind(this);
        this.OnUpdate = this.OnUpdate.bind(this);

        Tick.OnUpdate(this.OnUpdate);
        this.coroutine = CoroutineUtility.StartCoroutine(this.Movement(setCoords, setTargetPosition));

        EventManager.AddListner("OnSetPause", this.SetEnabled);
    }
    
    Dispose() {
        Tick.StopUpdate(this.OnUpdate);
        CoroutineUtility.StopCoroutine(this.coroutine);
        
        EventManager.RemoveListner("OnSetPause", this.SetEnabled);
    }

    OnUpdate(){         
        let input = GetSingleDirection();

        if(input != Vector2.Zero()) 
            this.lastInput = input;  
    }
    *Movement(setCoords: any, setTargetPosition: any){
        while(true){
            yield* WaitUntil(() => this.enabled);
            yield* WaitForSeconds(0.2);              
            
            setCoords((current: IVector2) => { 
                const prevInput = this.prevInput;
                const lastInput = this.lastInput;

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
                        this.prevInput = lastInput;
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
}


export default function PacmanComponent() {
    const [coords, setCoords] = useState<IVector2>(startPosition);
    const [position, setTargetPosition] = useState<IVector2>(Grid.GetPositionFromCoords(startPosition));
    
    useEffect(() => {
        let pacman: Pacman | undefined = new Pacman(setCoords, setTargetPosition);

        return () => {
            pacman!.Dispose();
            pacman = undefined;
        }
    }, [])

    return (
        <div className="player" style={{...style, ...{top: position.y + 2, left: position.x + 2}}}>
            <ColliderComponent tag='player'/>
        </div>
    );
}
