import { useEffect, useState } from "react";
import { EventManager } from "scripts/EventManager";
import { Collider } from "scripts/Physics";
import { ColliderComponent } from "./ColliderComponent"

export const Point = (params: {id: IVector2}) => {

    const [state, setState] = useState({
        active: true, upgraded: false
    });

    const _id = JSON.stringify(params.id); // saved for comparison later

    function Upgrade(id: IVector2){
        if(JSON.stringify(id) !== _id) return; // is it this instance to upgrade?
        
        // reenable and set upgraded
        setState((current) => {
            console.log({...current, ...{active: true, upgraded: true}})
            return {...current, ...{active: true, upgraded: true}};
        });
    }

    useEffect(() => {
        EventManager.AddListener("OnUpgradePoint", Upgrade);
        return () => {
            EventManager.RemoveListener("OnUpgradePoint", Upgrade);
        }
    },[]);

    //annoyingly need to do this because setState in functional doesnt accept callback.
    useEffect(() => {
        if(state.active) return;
        if(!state.upgraded)
            EventManager.Invoke('OnAddPoints', 10);
        else
            EventManager.Invoke('OnPowerUp');
    },[state.active])

    const OnCollision = (collider: Collider) => {
        if(collider.tag !== 'player') return;
        setState((current) => {
            return {...current, ...{active: false}};
        });   
    }

    const fontSize =  state.upgraded ? '40px' : '18px';

    if(state.active){
        return(
            <div style={{position: 'absolute', width: '100%', height: '100%', display: 'contents'}}>
                <p style={{position: 'absolute',display: 'contents', margin: 0, width: 'auto', height: 'auto', fontSize:fontSize, }}>●</p>
                <ColliderComponent tag="point" OnCollision={OnCollision} IsStatic={true} />
            </div>
        )
    }
    else{
        return <></>;
    }
}

