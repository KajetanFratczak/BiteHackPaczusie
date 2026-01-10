import './App.css';
import { runTest } from './services/testService';

function App() {
  runTest().then(data => {
          console.log(data);
        });
  return (
    <div className="App">
      <h1>Welcome to Paczusie Frontend!</h1>
     
    </div>
  );
}

export default App;
