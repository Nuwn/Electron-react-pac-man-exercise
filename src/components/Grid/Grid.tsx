import { useMemo, useState } from 'react';
import * as gridSettings from './gridSettings.json';
import { GetKeyDown } from 'scripts/InputManager';
import EasyStar from 'easystarjs';

import './Grid.scss';

export const Grid = () => {
    const grid = useMemo(() => GridData.GetOrCreateInstance(), []);
    const [selected, setSelected]= useState<Vector2[]>([]);

    function GridPositionClick(rect: Vector2){
        const index = selected.indexOf(rect);
        if (index > -1) {
            const filtered = selected.filter(item => item != rect);
            setSelected(filtered);
            return;
        }
        setSelected(current => [...current, rect]);
    }

    function OnMouseEnter(event: any, rect: Vector2){
        event.preventDefault();
        event.stopPropagation();
        
        if(GetKeyDown('Mouse0')){
            GridPositionClick(rect);
        }
    }

    return (
        <div className="grid">
            <DebugGrid grid={grid} Click={GridPositionClick} MouseEnter={OnMouseEnter} SelectedRef={selected}/>
        </div>
    );
};


const DebugGrid: (props: any) => JSX.Element = (props: any) => {
    if(process.env.NODE_ENV !== 'development') return(<></>);

    return(
    <div>
        {props.grid.grid.map((rect: Vector2, index:number) => (
            <div key={index} className="grid-rect" onClick={() => props.Click(rect)} onMouseEnter={(e) => props.MouseEnter(e, rect)}
                style={{
                    height: props.grid.positionMultiplier.y, 
                    width: props.grid.positionMultiplier.x,
                    top: rect.y * props.grid.positionMultiplier.y,
                    left: rect.x * props.grid.positionMultiplier.x
                }}>
                <div draggable={false} className="grid-rect-button" style={{backgroundColor: props.SelectedRef.includes(rect) ? 'red': 'green'}}></div>
            </div>
        ))} 
     </div>
     );
}



export class GridData{
    static instance: GridData;

    positionMultiplier: Vector2;
    grid: Vector2[] = [];
    walls: Vector2[] = [];

    matrix: number[][];

    easystar: any; // a* pathfinding

    constructor(){
        this.positionMultiplier = {
            x: window.innerWidth / gridSettings.gridSize.x, 
            y: window.innerHeight  / gridSettings.gridSize.y
        }

        this.matrix = Array(gridSettings.gridSize.y).fill(1).map(()=>Array(gridSettings.gridSize.x).fill(1))

        // for (let x = 0; x < gridSettings.gridSize.x; x++) {
        //     for (let y = 0; y < gridSettings.gridSize.y; y++) {
        //         this.grid.push({x: x, y: y});
        //     }          
        // }   
        
        this.SetupEasystar();
    }

    SetupEasystar(){
        this.easystar = new EasyStar.js();
    }

    static GetOrCreateInstance(){
        return GridData.instance ?? new GridData();
    }
}