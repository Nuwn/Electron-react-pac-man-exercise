import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventManager } from 'scripts/EventManager';
import Gamemanager from 'scripts/Gamemanager';
import { Vector2 } from 'scripts/Types';
import GhostComponent from './Ghost';
import { Grid, GridView } from './Grid/Grid';
import { PacmanComponent } from './Pacman';
import pacmanGraphic from "../assets/Player.png";

const startPosition = new Vector2(15, 15);

export default function Gameplay() {
    
    let navigate = useNavigate();

    const [pacmanState, setPacmanState] = useState({
        coords: startPosition,
        position: Grid.GetPositionFromCoords(startPosition),
        graphic: pacmanGraphic
    });

    function LoadMainMenu(){
        navigate('/');
    }

    useEffect(() => {
        const gamemanager = new Gamemanager();
        EventManager.AddListener("OnReturnToMainMenu", LoadMainMenu);

        return() => {
            gamemanager.Dispose();
            EventManager.RemoveListener("OnReturnToMainMenu", LoadMainMenu);
        }
    }, []);
    

    return (
        <div>
        <GridView />
        <GhostComponent startPosition={{x: 1, y: 1}} pacmanCoords={pacmanState.coords}/>
        <GhostComponent startPosition={{x: 29, y: 1}} pacmanCoords={pacmanState.coords}/>
        <GhostComponent startPosition={{x: 29, y: 19}} pacmanCoords={pacmanState.coords}/>
        <GhostComponent startPosition={{x: 1, y: 19}} pacmanCoords={pacmanState.coords}/>
        <PacmanComponent state={pacmanState} setState={setPacmanState}/>
        </div>
    );
}


