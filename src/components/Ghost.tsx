import { Component } from "react";
import { Grid } from "components/Grid/Grid";
import { EventManager } from "scripts/EventManager";
import { Collider} from "scripts/Physics";
import { ColliderComponent } from "components/ColliderComponent";
import ghostblank from '../assets/ghost-blank.png';
import ghosteyes from '../assets/ghost-eyes.png';
import CoroutineUtility, { WaitForSeconds, WaitUntil } from "scripts/CoroutineUtility";
import * as gridSettings from './Grid/gridSettings.json';


enum GhostState{ IDLE, HUNT, WANDER, SCARED, DEAD }

const style : any = {
    position: 'absolute',
    width: 32,
    height: 32,
    transition: 'all 0.2s linear'
}

export default class GhostComponent extends Component<{startPosition: IVector2, pacmanCoords:IVector2}> { 
    
    grid: Grid;
    state: {
        coords: IVector2, 
        position: IVector2, 
        ghost: GhostState,
        playerPos: IVector2
    }
    movementCoroutine: any;
    pathQueue;

    constructor(props: {startPosition: IVector2, pacmanCoords:IVector2}){
        super(props);
        this.grid = Grid.GetOrCreateInstance();

        this.state = {
            coords: props.startPosition,
            position: Grid.GetPositionFromCoords(props.startPosition),
            ghost: GhostState.HUNT,
            playerPos: props.pacmanCoords
        }

        this.OnPowerUp = this.OnPowerUp.bind(this);
        this.SetEnabled = this.SetEnabled.bind(this);
        this.OnCollision = this.OnCollision.bind(this);

        EventManager.AddListener("OnPowerUp", this.OnPowerUp);
        EventManager.AddListener("OnSetPause", this.SetEnabled);

        this.movementCoroutine = CoroutineUtility.StartCoroutine(this.MovementLoop());

        this.pathQueue = new PathQueue(() => {
            let targetPosition: IVector2;
    
            switch (this.state.ghost){
                case GhostState.IDLE:
                    return undefined;
                case GhostState.WANDER:
                    targetPosition = Grid.GetRandomCoords()!;
                    break;
                case GhostState.HUNT:
                    targetPosition = this.state.playerPos;
                    break;
                case GhostState.SCARED:
                    targetPosition = gridSettings.ghostSpawn;
                    break;
                case GhostState.DEAD:
                    targetPosition = gridSettings.ghostSpawn;
                    break;
                default:
                    return undefined;
            }
      
            return [this.state.coords, targetPosition];
        });

    }

    static getDerivedStateFromProps(props: any, state:any) {
        if(props.pacmanCoords !== state.playerPos){
            return{...state, ...{playerPos: props.pacmanCoords}}
        }
        return null;
    }
    componentWillUnmount(){
        EventManager.RemoveListener("OnPowerUp", this.OnPowerUp)
        EventManager.RemoveListener("OnSetPause", this.SetEnabled);
    }
    

    *MovementLoop(){
        while(true){
            yield* WaitUntil(() => this.state.ghost !== GhostState.IDLE);
            yield* WaitForSeconds(0.2);

            const next = this.pathQueue.GetNext();
            if(next === undefined) continue;
            const position = Grid.GetPositionFromCoords(next);

            this.setState({coords: next, position: position});
        }
    }

    SetEnabled(v: boolean){
        this.setState({enabled: !v});
    }

    OnPowerUp(){
        this.setState({ghost: GhostState.SCARED});
    }

    OnCollision(collider: Collider) {

    }

    render(){
        return (
            <div style={{...style, ...{top: this.state.position.y, left: this.state.position.x + 4}}}>
                <img src={ghostblank} style={{position: 'absolute', width: '100%'}}/>
                <img src={ghosteyes} style={{position: 'absolute'}}/>
                <ColliderComponent tag="ghost" OnCollision={this.OnCollision}/>
            </div>
        );
    }
}

class PathQueue{
    grid;
    queue: any[] = [];
    callback;

    /**
     * @param RetargetCallback Callback logic that should provide current position and target position [Current, Target]
     */ 
    constructor(RetargetCallback: () => [IVector2, IVector2] | undefined) {
        this.grid = Grid.GetOrCreateInstance();
        this.callback = RetargetCallback;
    }

    GetNext(): IVector2 | undefined {
        if(this.queue.length === 0){
            this.Retarget();
            return;
        }

        return this.queue.shift();
    }

    Retarget(): void {
        const [current, nextTarget] = this.callback() || [];
        if(current === undefined ||nextTarget === undefined) return;

        this.grid.easystar.findPath(current.x, current.y, nextTarget.x, nextTarget.y, (path: IVector2[]) => {
                this.queue = path || [];          
        });
        this.grid.easystar.calculate();
    }
}