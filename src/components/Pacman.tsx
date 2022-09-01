import { CSSProperties, useEffect, useState } from "react";
import Tick from "scripts/Tick";
import CoroutineUtility, { WaitForSeconds, WaitUntil } from "scripts/CoroutineUtility";
import { GetSingleDirection } from "scripts/InputManager";
import { EventManager } from "scripts/EventManager";
import { ColliderComponent } from "components/ColliderComponent";
import { Grid } from "components/Grid/Grid";
import { Vector2 } from "scripts/Types";
import pacmanGraphic from "../assets/Player.png";
import pacmanGraphicOpen from "../assets/PlayerOpen.png";


const style : CSSProperties | undefined = {
    position: 'absolute',
    height: 36, 
    width: 36, 
    transition: 'all 0.2s linear'
}


export class Pacman{
    enabled = false;
    prevInput: IVector2 = Vector2.Zero();
    lastInput: IVector2 = Vector2.Zero();
    coroutine: any;

    SetEnabled(v: boolean){
        this.enabled = !v
    }

    constructor(setState: any){

        this.SetEnabled = this.SetEnabled.bind(this);
        this.OnUpdate = this.OnUpdate.bind(this);

        Tick.OnUpdate(this.OnUpdate);
        this.coroutine = CoroutineUtility.StartCoroutine(this.Movement(setState));

        EventManager.AddListener("OnSetPause", this.SetEnabled);
    }
    
    Dispose() {
        Tick.StopUpdate(this.OnUpdate);
        CoroutineUtility.StopCoroutine(this.coroutine);
        
        EventManager.RemoveListener("OnSetPause", this.SetEnabled);
    }

    OnUpdate(){         
        let input = GetSingleDirection();

        if(input != Vector2.Zero()) 
            this.lastInput = input;  
    }
    *Movement(setState: any){
        while(true){
            yield* WaitUntil(() => this.enabled);
            yield* WaitForSeconds(0.2);              
            
            setState((current: { coords:IVector2, position: IVector2 }) => { 
                const prevInput = this.prevInput;
                const lastInput = this.lastInput;

                // We have not made a move
                if (Vector2.isZero(lastInput) && Vector2.isZero(prevInput)){
                    return current;
                }
                // if no new input, keep moving with previous action
                if(Vector2.isZero(lastInput))
                {
                    const newCoords = {x: current.coords.x + prevInput.x, y: current.coords.y + prevInput.y};
                    
                    if(Grid.ValidateCoord(newCoords)){
                        const newPos = {position: Grid.GetPositionFromCoords(newCoords), coords: newCoords};
                        return {...current, ...newPos};
                    }
                    else{
                        return current;
                    }
                }
                else{
                    // we have new input position
                    let newCoords = {x: current.coords.x + lastInput.x, y: current.coords.y + lastInput.y};
                    
                    if(Grid.ValidateCoord(newCoords)){
                        const newPos = {position: Grid.GetPositionFromCoords(newCoords), coords: newCoords};
                        this.prevInput = lastInput;
                        return {...current, ...newPos};
                    }
                    else{
                        newCoords = {x: current.coords.x + prevInput.x, y: current.coords.y + prevInput.y};
                    
                        if(Grid.ValidateCoord(newCoords)){
                            const newPos = {position: Grid.GetPositionFromCoords(newCoords), coords: newCoords};
                            return {...current, ...newPos};
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

export function PacmanComponent(params: any) {
    
    
    useEffect(() => {
        const pacman: Pacman = new Pacman(params.setState);

        const interval = setInterval(() => {
            params.setState((prevState: any) => { 
                return {...prevState, ...{graphic: prevState.graphic === pacmanGraphic ? pacmanGraphicOpen: pacmanGraphic}}
            });
        }, 200);

        return () => {
            clearInterval(interval);
            pacman.Dispose();
        }
    }, [])


    return (
        <div className="player" style={{...style, ...{top: params.state.position.y + 2, left: params.state.position.x + 2}}}>
            <img src={params.state.graphic} />
            <ColliderComponent tag='player'/>
        </div>
    );
}
