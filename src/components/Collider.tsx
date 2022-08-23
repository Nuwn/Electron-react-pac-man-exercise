import { useEffect, useRef } from "react"
import { Collider, Physics } from "scripts/Physics";

export const ColliderComponent = (params: any) => {
    
    const posRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const collider = new Collider(posRef, params.tag, false);

        collider.OnCollision = (collider: Collider) => {

        }

        Physics.Register(collider);

        return () => {
            Physics.Unregister(collider);
        }
    }, []);


    return (
        <div style={{height: '100%', width: '100%'}} ref={posRef}></div>
    )
}