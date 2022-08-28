import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventManager } from 'scripts/EventManager';
import Gamemanager from 'scripts/Gamemanager';
import GhostComponent from './Ghost';
import { GridView } from './Grid/Grid';
import PacmanComponent from './Pacman';

export default function Gameplay() {
    
    let navigate = useNavigate();

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
        <GhostComponent startPosition={{x: 1, y: 1}}/>
        <GhostComponent startPosition={{x: 29, y: 1}}/>
        <GhostComponent startPosition={{x: 29, y: 19}}/>
        <GhostComponent startPosition={{x: 1, y: 19}}/>
        <PacmanComponent />
        </div>
    );
}


