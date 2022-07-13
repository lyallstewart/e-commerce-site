import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import App from './app/App';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import './index.css';
import { apiSlice } from './api/apiSlice';


// Really don't like how heavily nested this is: TODO
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApiProvider api={apiSlice}>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="/" element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/signup" element={<SignUp/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </ApiProvider>
  </React.StrictMode>
)