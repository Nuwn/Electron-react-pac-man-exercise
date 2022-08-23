import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import Tick from 'scripts/Tick';
import CoroutineUtility from 'scripts/CoroutineUtility';
import { InputGetOrCreateInstance } from 'scripts/InputManager';
import { Physics } from 'scripts/Physics';
import Gameplay from 'components/Gameplay';
import './App.scss';

new Tick();
new CoroutineUtility();
new Physics();
InputGetOrCreateInstance();

const Menu = () => {

    return(
        <>
            <Link to='/gameplay'>aaa</Link>
        </>
    );
}

export default function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/gameplay" element={<Gameplay />} />
      </Routes>
    </MemoryRouter>
  );
}
