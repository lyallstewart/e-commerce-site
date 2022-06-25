import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { ChakraProvider } from '@chakra-ui/react';
import App from './app/App';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider>
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
    </ChakraProvider>
  </React.StrictMode>
)