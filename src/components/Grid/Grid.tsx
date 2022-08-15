import { useMemo } from 'react';
import * as gridSettings from './gridSettings.json';
import './Grid.scss';

export const Grid = () => {
    const grid = useMemo(() => new GridData(), []);

    function gridPositionClick(rect: Vector2){
        console.log(rect);
    }

    return (
        <div className="grid">
         {grid.grid.map((rect, index) => (
            <div className="grid-rect"  
                style={{height: grid.positionMultiplier.y, width: grid.positionMultiplier.x}} 
                onClick={() => gridPositionClick(rect)} >
                <div key={index} className="grid-rect-button" ></div>
            </div>
         ))}
        </div>
    );
};

class GridData{
    positionMultiplier: Vector2;
    grid: Vector2[] = [];

    constructor(){
        this.positionMultiplier = {
            x: window.innerWidth / gridSettings.gridSize.x, 
            y: window.innerHeight  / gridSettings.gridSize.y
        }

        for (let x = 0; x < gridSettings.gridSize.x; x++) {
            for (let y = 0; y < gridSettings.gridSize.y; y++) {
                this.grid.push({x: x, y: y});
            }          
        }    
    }
}