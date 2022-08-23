import { RefObject } from "react";
import CoroutineUtility, { WaitForSeconds } from "./CoroutineUtility";

export class Physics{
    static colliders: Collider[] = [];

    *PhysicsLoop(){
        while(true){
            yield* WaitForSeconds(0.2);
            Physics.colliders.forEach(collider => {
                if(collider.isStatic) return;

                //console.log(collider.GetPosition());
            });
        }
    }

    constructor(){
        CoroutineUtility.StartCoroutine(this.PhysicsLoop());
    }
    
    static Register(collider: Collider){
        Physics.colliders.push(collider);
    }
    static Unregister(collider: Collider){
        Physics.colliders = Physics.colliders.filter(x => x !== collider);
    }
}

export class Collider{
    isStatic: boolean = false;
    tag: string;
    posRef: RefObject<HTMLDivElement>
    OnCollision: ((collider: Collider) => void) | undefined = undefined;

    constructor(posRef: RefObject<HTMLDivElement>, tag: string = 'default', isStatic: boolean = false){
        this.posRef = posRef;
        this.tag = tag;
        this.isStatic = isStatic;
    }

    GetPosition(){
        return this.posRef.current?.getBoundingClientRect();
    }

    static IsOverLap(col1: Collider, col2: Collider){

    }
}