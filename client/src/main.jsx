import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Authentication } from '../context/Authentication.jsx' 
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <Authentication>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Authentication>
)
