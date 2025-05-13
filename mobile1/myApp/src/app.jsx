import { Provider } from 'react-redux';
import { store } from './redux/store';
import Index from './pages/index/index';

function App() {
  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
}

export default App;