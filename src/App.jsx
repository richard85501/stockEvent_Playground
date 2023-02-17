import './style/main.scss';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './store';
import PlatForm from './PlatForm';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter basename='/'>
        <PlatForm />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
