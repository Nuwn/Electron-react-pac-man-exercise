import { RefObject } from "react";
import CoroutineUtility, { WaitForSeconds } from "./CoroutineUtility";

export class Physics{
    static instance: Physics;

    colliders: Collider[] = [];

    *PhysicsLoop(){
        while(true){
            yield* WaitForSeconds(0.2);

            this.HandleCollisionCheck();
        }
    }

    constructor(){
        Physics.instance = this;
        CoroutineUtility.StartCoroutine(this.PhysicsLoop());
    }

    /* 
    we only need to verify if the player collides with an object, 
    if it does we trigger collision on the enemy object, so it can handle its action
    */
    HandleCollisionCheck() {
        const playerCollider = this.colliders.find(x => x.tag === "player");
        if(playerCollider == null) return;

        let playerRect = playerCollider.GetPosition();
        
        this.colliders.forEach(collider => {
            if(collider === playerCollider) return;

            if(Collider.IsOverLap(playerRect, collider.staticRect || collider.GetPosition()))
                collider.DoCollision(playerCollider);
        });
    }
    
    static Register(collider: Collider){
        Physics.instance.colliders.push(collider);
    }
    static Unregister(collider: Collider){
        Physics.instance.colliders = Physics.instance.colliders.filter(x => x !== collider);
    }
}

export class Collider{
    
    isStatic: boolean = false;
    tag: string;
    posRef: RefObject<HTMLDivElement>
    staticRect: DOMRect | undefined;
    
    constructor(posRef: RefObject<HTMLDivElement>, tag: string = 'default', isStatic: boolean = false){
        this.posRef = posRef;
        this.tag = tag;
        this.isStatic = isStatic;

        if(isStatic) // if it's static we can cache the position for better performance
            this.staticRect = this.GetPosition();
    }
    
    OnCollision: ((collider: Collider) => void) | undefined = undefined;
    
    DoCollision(playerCollider: Collider) {
        if(this.OnCollision == null) return;

        this.OnCollision(playerCollider);
    }

    GetPosition(){
        return this.posRef.current?.getBoundingClientRect();
    }

    static IsOverLap(col1rect: DOMRect | undefined, col2rect: DOMRect | undefined){
        if(col1rect == null || col2rect == null) return false;

        return !(
            (col1rect.top + col1rect.height < col2rect.top) ||
            (col1rect.top > col2rect.top + col2rect.height) ||
            (col1rect.left + col1rect.width < col2rect.left) ||
            (col1rect.left > col2rect.left + col2rect.width)
        );
    }
}

