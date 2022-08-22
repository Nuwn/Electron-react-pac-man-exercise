import { Grid } from "components/Grid/Grid";
import { useEffect, useMemo, useState } from "react";
import { Collider, Physics } from "scripts/Physics";
import ghostblank from '../../assets/ghost-blank.png';
import ghosteyes from '../../assets/ghost-eyes.png';



const style : any = {
    position: 'absolute',
    width: 32,
    height: 32
}

class Ghost{
 
    collider: Collider = new Collider();

    constructor(){
        Physics.Register(this.collider);
    }

    Dispose(){
        Physics.Unregister(this.collider);
    }
}

export default function GhostComponent(params: any) { 

    const startPosition = params.startPosition;

    const [coords, setCoords] = useState<IVector2>(startPosition);
    const [position, setTargetPosition] = useState<IVector2>(Grid.GetPositionFromCoords(startPosition));

    const ghost = useMemo(() => new Ghost(), []);

    useEffect(() => {
        return () => ghost.Dispose();
    }, [])

    return (
        <div style={{...style, ...{top: position.y, left: position.x + 4}}}>
            <img src={ghostblank} style={{position: 'absolute', width: '100%'}}/>
            <img src={ghosteyes} style={{position: 'absolute'}}/>
        </div>
    );
}
