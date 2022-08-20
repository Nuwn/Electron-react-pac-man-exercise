import * as gridSettings from './gridSettings.json';
import EasyStar from 'easystarjs';
import { useMemo } from 'react';
import gameboard from '../../assets/Gameboard.png';

export const GridView = () => {
    const grid = useMemo(() => Grid.GetOrCreateInstance(), []);

    return (
        <div className="grid">
            <img src={gameboard} style={{position: 'absolute', width: '100%', height: '100%' }} />
            {grid.matrix.map((y: number[], yindex: number) => y.map((val: number, xindex: number) => {
                const rect = {x: xindex, y: yindex};
                const pos = Grid.GetPositionFromCoords(rect);
                const size = 20;
                pos.x += 10;
                pos.y += 10;

                //update this with points
                return (
                    <div key={yindex + 1 * xindex} style={{ position:'absolute', color:'white', top: pos.y, left: pos.x, width: size, height: size, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {val === 1 ? '●' : ''}
                    </div>
                )
            }))}
        </div>
    );
};

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
        easystar.setAcceptableTiles([1]);
        this.easystar = easystar;
    }

    static SetWeight(position: IVector2, weight: number){
        Grid.instance.matrix[position.y][position.x] = weight;
        console.log(Grid.instance.matrix);
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