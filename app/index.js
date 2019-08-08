// import './styles/index.css';
// import 'babel-polyfill'
// import 'typeface-muli';
// import './react-table-defaults';
// import './react-chartjs-2-defaults';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const render = () => {
    ReactDOM.render(
        <App />,
        document.getElementById('root')
    );
};

window.onload = () => {
    render();
};
