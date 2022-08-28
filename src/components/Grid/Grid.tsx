import { CSSProperties, useEffect, useMemo, useRef } from 'react';
import * as gridSettings from './gridSettings.json';
import EasyStar from 'easystarjs';
import gameboard from '../../assets/Gameboard.png';
import { Point } from 'components/Point';
import CoroutineUtility, { WaitForSeconds } from 'scripts/CoroutineUtility';
import { EventManager } from 'scripts/EventManager';

const gridStyle: CSSProperties | undefined = { 
    userSelect: 'none', 
    position:'absolute', 
    color:'white', 
    width: 20, 
    height: 20, 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center'
}

export const GridView = () => {

    function* UpgradeTimer () {
        while(true){
            yield* WaitForSeconds(15);
            
            // Get the grid item and generate a ID
            const id = GenerateRandomUpgrade();
            if(id === undefined)
                continue; 

            EventManager.Invoke("OnUpgradePoint", id);
        }
    }

    useEffect(() => {
        const coroutine = CoroutineUtility.StartCoroutine(UpgradeTimer());

        return () => {
            CoroutineUtility.StopCoroutine(coroutine);
        }
    },[]);

    return (
        <div className="grid">
            <img src={gameboard} style={{position: 'absolute', width: '100%', height: '100%' }} />
            {Grid.GetOrCreateInstance().matrix.map((y: number[], yindex: number) => y.map((val: number, xindex: number) => {
                const rect = {x: xindex, y: yindex};
                const pos = Grid.GetPositionFromCoords(rect);
                pos.x += 10;
                pos.y += 10;

                return (
                    <div key={JSON.stringify(rect)} style={{...gridStyle, ...{ top: pos.y, left: pos.x }}}>
                        { val === 1 ? <Point id={rect} /> : null }
                    </div>
                )
            }))}
        </div>
    );
};


function GenerateRandomUpgrade(): IVector2 | undefined {
    let success = false;
    let res: IVector2 | undefined;
    const grid = Grid.GetOrCreateInstance();

    while (success === false){
        const ranY = Math.floor(Math.random() * gridSettings.gridSize.y);
        const ranX = Math.floor(Math.random() * gridSettings.gridSize.x);

        if(grid.matrix[ranY][ranX] === 1){
            success = true;
            res = {x:ranX, y:ranY};
        }
    }

    return res;
}


export class Grid{
    static instance: Grid;

    positionMultiplier: IVector2;
    matrix: number[][];
    easystar: any; // a* pathfinding

    constructor(){
        this.positionMultiplier = {
            x: window.innerWidth / gridSettings.gridSize.x, 
            y: window.innerHeight  / gridSettings.gridSize.y
        }

        this.matrix = gridSettings.grid;

        this.SetupEasystar();
    }

    SetupEasystar(){
        const easystar = new EasyStar.js();
        easystar.setGrid(this.matrix);
        easystar.setAcceptableTiles([-1, 1, 2]);
        this.easystar = easystar;
    }

    static SetWeight(position: IVector2, weight: number){
        Grid.instance.matrix[position.y][position.x] = weight;
    }

    static GetOrCreateInstance(){
        return Grid.instance ?? new Grid();
    }

    
    static ValidateCoord(coords: IVector2){
        const grid = Grid.GetOrCreateInstance();
        if((coords.x < 0 || coords.x > gridSettings.gridSize.x) || (coords.y < 0 || coords.y > gridSettings.gridSize.y))
            return false;
            
        return grid.matrix[coords.y][coords.x] === 1;
    }

    static GetPositionFromCoords(coords: IVector2){
        const multiplier = Grid.GetOrCreateInstance().positionMultiplier;
        return {x: coords.x * multiplier.x, y: coords.y * multiplier.y}
    }
}
