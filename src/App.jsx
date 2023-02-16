import { Provider } from 'react-redux';
import store from './store';
import Main from './component/Main';
import './style/main.scss';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

export default App;
