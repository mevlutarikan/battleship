import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { NewGame } from './components/NewGame';
import { SetupFleet } from './components/SetupFleet';

function App() {
  return (
    <div className="App d-flex justify-content-center">
      <Router>
        <Switch>
          <Route exact path="/" component={NewGame} />
          <Route path="/setup/:gameID" component={SetupFleet} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
