import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login'
import Signup from './components/Signup';
import Game from './components/Game';
import History from './components/History';
import Statistic from './components/Statistic';
import Ranking from './components/Ranking';
import Admin from './components/Admin';

const PrivateRoute = ({ element }) => {
  let conditional = true
  let user = JSON.parse(localStorage.getItem('user'))
  if (user && user.id) {
    conditional = true
  } else {
    conditional = false
  }
  return conditional === true ? element : <Navigate to="/login" replace />
}

const PreLoginRoute = ({ element }) => {
  let conditional = true
  let user = JSON.parse(localStorage.getItem('user'))
  if (user && user.id) {
    conditional = false
  } else {
    conditional = true
  }
  return conditional === true ? element : <Navigate to="/" replace />
}


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<PreLoginRoute element={<Login />} />} />
          <Route path='/signup' element={<PreLoginRoute element={<Signup />} />} />
          <Route path='/' element={<Game />}/>
          <Route path='/history' element={<PrivateRoute element={<History />} />} />
          <Route path='/statistic' element={<PrivateRoute element={<Statistic />} />} />
          <Route path='/ranking' element={<PrivateRoute element={<Ranking />} />} />
          <Route path='/admin' element={<PrivateRoute element={<Admin />} />} />
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
