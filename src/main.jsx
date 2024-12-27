import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';

import Mainpage from './Mainpage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
       <Mainpage />
    </BrowserRouter>
   
  </StrictMode>
);