import { useEffect, useState } from "react";
import { EventManager } from "scripts/EventManager";
import { Collider } from "scripts/Physics";
import { ColliderComponent } from "./ColliderComponent"

export const Point = (params: {id: IVector2}) => {

    const [active, setActive] = useState(true);
    const [upgraded, setUpgraded] = useState(false);

    const _id = JSON.stringify(params.id); // cached for comparison later

    function Upgrade(id: IVector2){
        if(JSON.stringify(id) !== _id) return; // is it this instance to upgrade?
        if (!active) setActive(true); // reenable
        setUpgraded(true);
    }

    useEffect(() => {
        EventManager.AddListener("OnUpgradePoint", Upgrade);
        return () => {
            EventManager.RemoveListener("OnUpgradePoint", Upgrade);
        }
    },[]);


    const OnCollision = (collider: Collider) => {
        if(collider.tag !== 'player') return;
        setActive(false);
        if(upgraded)
            EventManager.Invoke('OnAddPoints', 10);
        else
            EventManager.Invoke('OnPowerUp');
    }

    const fontSize =  upgraded ? '40px' : '18px';

    if(active){
        return(
            <div style={{position: 'absolute', width: '100%', height: '100%', display: 'contents'}}>
                <p style={{position: 'absolute',display: 'contents', margin: 0, width: 'auto', height: 'auto', fontSize:fontSize, }}>●</p>
                <ColliderComponent tag="point" OnCollision={OnCollision} IsStatic={true} />
            </div>
        )
    }
    else{
        return null;
    }
}

