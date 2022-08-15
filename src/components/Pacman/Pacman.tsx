import { useMemo, useState } from "react";
import { GetKeyDown } from "scripts/InputManager";
import Tick from "scripts/Tick";

export default function Pacman() {
    const OnUpdate = useMemo(() => 
     Tick.OnUpdate(() => {
        console.log("tick pacman");
    }), []);

    const [count, setCount] = useState(0);

    return (
        <>
        </>
    );
}
