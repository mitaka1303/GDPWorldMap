import Chart from "./Chart.jsx";
import React, { useState, useEffect } from 'react';
import RelativeSwitch from "./Switch.jsx";
import YearSlider from "./YearSlider.jsx";
import "bulma/css/bulma.css";

export default function App() {
  const [value, setValue] = useState(2000);
  const [relative, setRelative] = useState("absolute");

  function changeYear(year){
    setValue(year);
  }
  function changeState(e){
    if(relative=="absolute") {
      setRelative("relative");
    }else if(relative == "relative"){
      setRelative("absolute");
    }

  }
    return (
      <div>
        <div className="hero has-background-white" > 
          <div className ="hero-body">
            <div className="container">
              <h1 h1 className="title has-text-black">GDP world map</h1>
            </div>
            </div>
          </div>
          <div className="container">
            <p>{value}</p>
            <RelativeSwitch changeSwitch={changeState}/>
            <Chart value = {value} relative = {relative}/>
            <YearSlider changeYear={changeYear}/>
          </div>
      </div>
    );
  }