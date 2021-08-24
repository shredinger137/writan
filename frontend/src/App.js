
import './App.css';
import NavBar from './components/NavBar';
import { Route, Switch, BrowserRouter } from "react-router-dom";
import './assets/css/main.css'

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Catalog from './pages/Catalog';
import Profile from './pages/Profile';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <NavBar />
          <div style={{ height: "80px" }}></div>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/signup" component={Signup} />
            <Route path="/catalog" component={Catalog} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </div>
      </BrowserRouter>


    </div>
  );
}

export default App;



