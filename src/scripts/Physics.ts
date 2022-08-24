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

        this.colliders.forEach(collider => {
            if(collider === playerCollider) return;

            if(Collider.IsOverLap(playerCollider, collider))
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
    
    constructor(posRef: RefObject<HTMLDivElement>, tag: string = 'default', isStatic: boolean = false){
        this.posRef = posRef;
        this.tag = tag;
        this.isStatic = isStatic;
    }
    
    OnCollision: ((collider: Collider) => void) | undefined = undefined;
    
    DoCollision(playerCollider: Collider) {
        if(this.OnCollision == null) return;

        this.OnCollision(playerCollider);
    }

    GetPosition(){
        return this.posRef.current?.getBoundingClientRect();
    }

    static IsOverLap(col1: Collider, col2: Collider){
        let col1pos = col1.GetPosition();
        let col2pos = col2.GetPosition();

        if(col1pos == null || col2pos == null) return false;

        return !(
            (col1pos.top + col1pos.height < col2pos.top) ||
            (col1pos.top > col2pos.top + col2pos.height) ||
            (col1pos.left + col1pos.width < col2pos.left) ||
            (col1pos.left > col2pos.left + col2pos.width)
        );
    }
}

