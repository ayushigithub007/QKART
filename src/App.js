import { Route, Switch } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";   
import ipConfig from "./ipConfig.json";

export const config = {
  endpoint: `https://ayushisharmafzd1-me-qkart-frontend-v2.onrender.com/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/thanks" component={Thanks} />   
        <Route exact path="/" component={Products} />
      </Switch>
    </div>
  );
}

export default App;
