import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import App from './App/App'
import Home from './Pages/Home/Home'
import Login from './Pages/Login/Login'
import SignUp from './Pages/SignUp/SignUp';
import './index.css'

const baseUrl = "http://lyallstewart-e-commerce-site-wr99466q635xxv-3001.githubpreview.dev";
export default baseUrl;

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/" element={<App />}>
  //         <Route path="/" element={<Home/>}/>
  //         <Route path="/login" element={<Login/>}/>
  //         <Route path="/signup" element={<SignUp/>}/>
  //       </Route>
  //     </Routes>
  //   </BrowserRouter>
  // </React.StrictMode>
  <p>Hello, world!</p>
)