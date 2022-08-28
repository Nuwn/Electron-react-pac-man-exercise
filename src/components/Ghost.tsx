import { Component } from "react";
import { Grid } from "components/Grid/Grid";
import { EventManager } from "scripts/EventManager";
import { Collider} from "scripts/Physics";
import { ColliderComponent } from "components/ColliderComponent";
import ghostblank from '../assets/ghost-blank.png';
import ghosteyes from '../assets/ghost-eyes.png';

enum GhostState{ IDLE, HUNT, WANDER, SCARED, DEAD }

const style : any = {
    position: 'absolute',
    width: 32,
    height: 32
}

export default class GhostComponent extends Component<{startPosition: IVector2}> { 
    
    state: {
        enabled: boolean,
        coords: IVector2, 
        position: IVector2, 
        ghost: GhostState
    }

    constructor(props: {startPosition: IVector2}){
        super(props);

        this.state = {
            enabled: false,
            coords: props.startPosition,
            position: Grid.GetPositionFromCoords(props.startPosition),
            ghost: GhostState.IDLE
        }

        this.ghostLoop = this.ghostLoop.bind(this);
        this.OnPowerUp = this.OnPowerUp.bind(this);
        this.SetEnabled = this.SetEnabled.bind(this);
        this.OnCollision = this.OnCollision.bind(this);

        EventManager.AddListener("OnPowerUp", this.OnPowerUp);
        EventManager.AddListener("OnSetPause", this.SetEnabled);

    }

    componentWillUnmount(){
        EventManager.RemoveListener("OnPowerUp", this.OnPowerUp)
        EventManager.RemoveListener("OnSetPause", this.SetEnabled);
    }

    *ghostLoop(){

    }
   
    SetEnabled(v: boolean){
        this.setState({enabled: !v});
    }

    OnPowerUp(){
        this.setState({ghost: GhostState.SCARED});
    }

    OnCollision(collider: Collider) {
        this.setState({position: {x: 3, y : 4}});
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