import { useState } from "react";
import { EventManager } from "scripts/EventManager";
import { Collider } from "scripts/Physics";
import { ColliderComponent } from "./ColliderComponent"

export const Point = () => {

    const [active, setActive] = useState(true);

    const OnCollision = (collider: Collider) => {
        if(collider.tag !== 'player') return;
        setActive(false);
        EventManager.Invoke('OnAddPoints', 1);
    }

    if(active){
        return(
            <div style={{position: 'absolute', width: '100%', height: '100%'}}>
                <p style={{position: 'absolute', margin: 0, width: '100%', height: '100%', textAlign: 'center'}}>●</p>
                <ColliderComponent tag="point" OnCollision={OnCollision} IsStatic={true} />
            </div>
        )
    }
    else{
        return null;
    }
}