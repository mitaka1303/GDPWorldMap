import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import {geoEqualEarth, geoPath} from 'd3-geo';
import { fetchCSV, fetchWorldMap } from './api';
import {feature} from "topojson-client"

const projection = geoEqualEarth().scale(160).translate([ 1000/2 , 500/2])

function convertToArray(data){
    var response = [];
    var lines = data.split("\n");
    for(var i = 5;i<lines.length;i++){
        var line = [];
        var array = lines[i].split(",");
        for(var k = 0; k < array.length; k++){
            var item1 = array[k];
            var item2 = String(item1).replace("\"","");
            var item3 = item2.replace("\"","");
            line.push(item3);
        }

        if(line.length > 67){
            line.splice(1,1);
        }

        response.push(line);
    }
    return response;
}



const Chart = (props) =>{
    const width = 1000;
    const height = 500;
    const [worldMap, setworldMap] = useState();
    const [worldCSV, setCSV] = useState();
    const [max, setMax]  = useState();
    const [min, setMin]  = useState();
    const year = props.value;
    const relative = props.relative;

    var color = d3.scaleLinear().domain([100534663,991935593410]).range(["gray", "blue"]);
    var barScale = d3.scaleLinear().domain([100534663,991935593410]).range([0,25]).nice();
    if(relative == "relative"){
        if(max!=null && min!= null){
            const yearNum = year - 1960; 
            color = d3.scaleLinear().domain([min[yearNum],max[yearNum]]).range(["gray", "blue"]);
        }
        
    }

    useEffect( ()=> {
        fetchWorldMap().then( (response)=>{
            setworldMap(feature(response, response.objects.countries).features);
            console.log(response.objects.countries);

        } )
    },[]);

    function getColor(countryCode){
        for(var i = 0; i < worldCSV.length; i++){
            const start  = 1960;
            if(worldCSV[i][1] == countryCode){
                const value_GDP = worldCSV[i][year - start + 4];
                return value_GDP;
            }
        }
        if(min != null){
            return min[year-1960];
        }
        return 100534663;
    }

    function setMaxMin(data){
        var maxArray = [];
        var minArray = [];
        for(var i = 0; i < 62 ; i++){
            var max = data[0][4];
            var min = 99999999999999;
            for(var k = 0; k < data.length; k++){
                var value = Number(data[k][4+i]);
                if(value != "" && value != null && value != 0){
                    if(value > max ) {
                        max = value;
                    }
                    if(value < min) {
                         min = value;
                    }
                }
            }
            maxArray.push(max);
            minArray.push(min);
        }
        setMax(maxArray);
        setMin(minArray);
    }

    useEffect( ()=> {
        fetchCSV().then( (response)=>{
            const array = convertToArray(response);
            setCSV(array);
            setMaxMin(array);
            
        } )
    },[]);

    var BarArray = [];
    if(worldCSV != null){
        BarArray = worldCSV.sort(function(a, b){return( b[year-1960+4] - a[year-1960+4])});
    }

    if(worldMap ==null){
        return <p>loading</p>
    }

    return (
        <div  style={{ display: "flex"}} key="chart">
        <svg id = "mapSVG" width = {width} height={height} viewBox= "100,20,800,500 "key="map">
            {
                worldMap.map( (obj, index)=>{
                    var GDP_value = 0;
                    
                    
                    if(worldCSV!= null){
                        GDP_value = getColor(obj.properties.ADM0_A3_AR);
                        return (
                            <path 
                            key ={`path-${index}`}
                            d = {geoPath().projection(projection)(obj)} 
                            fill={color(GDP_value)}/>
                        )
                    }

                    
                } )
            }
        </svg>
        <svg id = "BarChart" width = {width} height={height} viewBox = "0, 0, 500, 500" key="barChart">
            {
                BarArray.map( (obj, index) =>{
                    if(obj !=null){
                        var GDP_value = getColor(obj[1]);
                        return (
                                <rect style = {{transition: '1s' }}  x ={100} y= {0+ 30*index} width ={barScale(GDP_value)} height ={20} fill={"blue"} key = {obj[1]}></rect>
                    );
                    }
                    
                })
            }
            {
                BarArray.map( (obj, index) =>{
                    if(obj != null){
                        return (
                            <text x ={0} y= {-10+ 30*index} fill={"black"} key = {obj[1]+obj[0]}>{obj[0]}</text>
                );
                    }
                    
                })
            }
        </svg>
        </div>
    );
}

export default Chart;