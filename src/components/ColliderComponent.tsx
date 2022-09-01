import { useEffect, useRef } from "react"
import { Collider, Physics } from "scripts/Physics";

export const ColliderComponent = (params: any) => {
    
    const posRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const collider = new Collider(posRef, params.tag, params.IsStatic);

        collider.OnCollision = (collider: Collider) => {
            if(params.OnCollision != null)
                params.OnCollision(collider);
        }

        Physics.Register(collider);

        return () => {
            Physics.Unregister(collider);
        }
    }, []);


    return (
        <div style={{position: 'absolute', height: '100%', width: '100%', top: 0, left: 0}} ref={posRef}></div>
    )
}