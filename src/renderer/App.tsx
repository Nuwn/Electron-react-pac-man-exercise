import Gameplay from 'components/Gameplay';
import CoroutineUtility from 'scripts/CoroutineUtility';
import { Link, MemoryRouter, Route, Router, Routes } from 'react-router-dom';
import Tick from 'scripts/Tick';
import './App.scss';

new CoroutineUtility();
new Tick(60);

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
