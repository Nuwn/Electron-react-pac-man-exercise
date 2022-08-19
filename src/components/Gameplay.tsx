import { useMemo, useRef, useState } from 'react';
import Gamemanager from 'scripts/Gamemanager';
import Ghost from './Ghost/Ghost';
import { GridView } from './Grid/Grid';
import Pacman from './Pacman/Pacman';

export default function Gameplay() {
    const gamemanager = useMemo(() => new Gamemanager(), []);

    return (
        <div>
        <GridView />
        <Ghost />
        <Ghost />
        <Ghost />
        <Ghost />
        <Pacman />
        </div>
    );
}
