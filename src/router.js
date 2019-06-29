import React, {Suspense} from 'react';
import {Router, Route, Switch, Redirect} from 'dva/router';
import App from './routes/app.js';

const routers = [
  {
    name:'登陆',
    path:'/app',
    component:App
  }
];


function RouterConfig({history}) {
  return (
    <Router history={history}>
        <Suspense fallback={<div>loading...</div>}>
        <Switch>
          {
            routers.map((route, index) => {
              return (
                <Route key={index} path={route.path} render={(props)=> <route.component {...props}/>}/>
              );
            })
          }
          <Redirect to='/app'/>
        </Switch>
        </Suspense>


    </Router>
  );
}

export default RouterConfig;
