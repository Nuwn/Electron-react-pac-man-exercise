import { useMemo, useRef, useState } from 'react';
import Gamemanager from 'scripts/Gamemanager';
import Ghost from './Ghost/Ghost';
import { Grid } from './Grid/Grid';
import Pacman from './Pacman/Pacman';

export default function Gameplay() {
    const gamemanager = useMemo(() => new Gamemanager(), []);

    return (
        <div>
        <Grid />
        <Ghost />
        <Ghost />
        <Ghost />
        <Ghost />
        <Pacman />
        </div>
    );
}
