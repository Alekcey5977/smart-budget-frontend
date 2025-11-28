import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useSelector, useDispatch } from 'react-redux'
import { getIsAuth, getCurrentUser} from './app/store/selectors'
import {login, logout} from './features/auth/authSlice'

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(getIsAuth);
  const user = useSelector(getCurrentUser);
  const handleLogin = () => {
    dispatch(
      login({
        user: { email: 'Alex_MM@gmail.com'},
        token: 'fake-token-123',
            })
    );
  };

const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div style={{padding: 10}}>
      <h5>Авторизция</h5>

      <p>Авторизован: {isAuth ? 'Да' : 'Нет'}</p>
      <p>Пользователь: {user ? user.email : 'Нет'}</p>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout} style={{ marginLeft: 8 }}>
        Logout
      </button>
    </div>
  );
}

export default App
