import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import LibraryApp from "./LibraryApp";
import '@fortawesome/fontawesome-free/css/all.css'
import {HashRouter, Switch, Route} from 'react-router-dom'
import LibraryContext, {useLibrary} from "./contexts/LibraryContext";
import Admin from "./components/Admin";
import StartScreen from "./components/StartScreen";

const AppRouter = () => {

  const library = useLibrary()

  return <LibraryContext.Provider value={library}>
    <HashRouter>
      <Switch>
        <Route path={'/admin'} component={Admin}/>
        <Route path={'/user/:id'} component={LibraryApp}/>
        <Route exact path={'/'} component={StartScreen}/>
      </Switch>
    </HashRouter>
  </LibraryContext.Provider>
}

ReactDOM.render(
  <React.StrictMode>
    <AppRouter/>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
