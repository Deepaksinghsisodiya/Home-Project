import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import LoginPage from './Components/Login/LoginPage';
import RegisterPage from './Components/Register/RegisterPage';
import ProductList from './Components/Product/ProductList/ProductList';
import { Provider } from 'react-redux';
import { store } from './Store/store';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<LoginPage />} />
        <Route path="/" element={<RegisterPage />} />
        <Route path='/productList' element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

reportWebVitals();
