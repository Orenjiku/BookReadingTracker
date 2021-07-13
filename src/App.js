"use strict";
exports.__esModule = true;
var react_1 = require("react");
require("./App.css");
var App = function () {
    // Create the count state.
    var _a = react_1.useState(0), count = _a[0], setCount = _a[1];
    // Update the count (+1 every second).
    react_1.useEffect(function () {
        var timer = setTimeout(function () { return setCount(count + 1); }, 1000);
        return function () { return clearTimeout(timer); };
    }, [count, setCount]);
    // Return the App component.
    return (<div className="App">
      <header className="App-header">
        <p>
          Page has been open for <code>{count}</code> seconds.
        </p>
      </header>
    </div>);
};
exports["default"] = App;
