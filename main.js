import * as d3 from 'd3';

let projectNumber = '';
let ec = '';
let oc = '';
let eui = '';
let lpd = '';
let sDA = '';
let aSE = '';
let sDG = '';
let iwui = '';

function getProjectNumber() {
    const input = document.getElementById('projectNumber');
    const button = document.getElementById('projectNumberButton');
    button.addEventListener('click', function() {
        projectNumber = input.value;
        console.log(projectNumber);
    });
};
getProjectNumber();

function getEC() {
    const input = document.getElementById('ec');
    const button = document.getElementById('ecButton');
    button.addEventListener('click', function() {
        ec = input.value;
        console.log(ec);
    });
};
getEC();

function getOC() {
    const input = document.getElementById('oc');
    const button = document.getElementById('ocButton');
    button.addEventListener('click', function() {
        oc = input.value;
        console.log(oc);
    });
};
getOC();

function getEUI() {
    const input = document.getElementById('eui');
    const button = document.getElementById('euiButton');
    button.addEventListener('click', function() {
        eui = input.value;
        console.log(eui);
    });
};
getEUI();

function getLPD() {
    const input = document.getElementById('lpd');
    const button = document.getElementById('lpdButton');
    button.addEventListener('click', function() {
        lpd = input.value;
        console.log(lpd);
    });
};
getLPD();

function getSDA() {
    const input = document.getElementById('sDA');
    const button = document.getElementById('sDAButton');
    button.addEventListener('click', function() {
        sDA = input.value;
        console.log(sDA);
    });
};
getSDA();

function getASE() {
    const input = document.getElementById('aSE');
    const button = document.getElementById('aSEButton');
    button.addEventListener('click', function() {
        aSE = input.value;
        console.log(aSE);
    });
};
getASE();

function getSDG() {
    const input = document.getElementById('sDG');
    const button = document.getElementById('sDGButton');
    button.addEventListener('click', function() {
        sDG = input.value;
        console.log(sDG);
    });
};
getSDG();

function getIWUI() {
    const input = document.getElementById('iwui');
    const button = document.getElementById('iwuiButton');
    button.addEventListener('click', function() {
        iwui = input.value;
        console.log(iwui);
    });
};
getIWUI();

let features = ["EC", "OC", "EUI", "LPD", "sDA", "aSE", "sDG", "IWUI"];
function radarChart (features, div) {
    let data = [];
    
    for (var i = 0; i<1; i++){
        var point = {}
        features.forEach(f => point[f] = 1 + Math.random() * 8);
        data.push(point);
    }
    console.log(data);
    
    let width = 350;
    let height = 350;
    let svg = d3.select(div).append("svg")
        .attr("width", width)
        .attr("height", height);
    
    let radialScale = d3.scaleLinear()
        .domain([0,10])
        .range([0,150]);
    let ticks = [2,4,6,8,10];
    
    svg.selectAll("circle")
        .data(ticks)
        .join(
            enter => enter.append("circle")
                .attr("cx", width/2)
                .attr("cy", height/2)
                .attr("fill", "none")
                .attr("stroke", "gray")
                .attr("r", d => radialScale(d))
        );
    
    svg.selectAll(".ticklabel")
        .data(ticks)
        .join(
            enter => enter.append("text")
                .attr("class", "ticklabel")
                .attr("x", width / 2 + 2)
                .attr("y", d => height / 2 - radialScale(d))
                .text(d => d.toString())
        );

    function angleToCoordinate(angle, value){
        let x = Math.cos(angle) * radialScale(value);
        let y = Math.sin(angle) * radialScale(value);
        return {"x": width / 2 + x, "y": height / 2 - y};
    };

    let featureData = features.map((f,i) => {
        let angle = (Math.PI/2) + (2 * Math.PI * i / features.length);
        return {
            "name": f,
            "angle": angle,
            "line_coord": angleToCoordinate(angle, 10),
            "label_coord": angleToCoordinate(angle, 10.5)
        };
    });
    
    svg.selectAll("line")
        .data(featureData)
        .join(
            enter => enter.append("line")
                .attr("x1", width/2)
                .attr("y1", height/2)
                .attr("x2", d => d.line_coord.x)
                .attr("y2", d => d.line_coord.y)
                .attr("stroke", "black")
        );
    svg.selectAll(".axislabel")
        .data(featureData)
        .join(
            enter => enter.append("text")
                .attr("x", d => d.label_coord.x)
                .attr("y", d => d.label_coord.y)
                .text(d => d.name)
        );
    
    let line = d3.line()
        .x(d => d.x)
        .y(d => d.y);

    let colors = ["red", "gray", "navy"];

    function getPathCoordinates(data_point){
        let coordinates = [];
        for (var i=0; i < features.length; i++){
            let ft_name = features[i];
            let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
            coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
        };
        return coordinates;
    };
    
    svg.selectAll("path")
        .data(data)
        .join(
            enter => enter.append("path")
                .datum(d => getPathCoordinates(d))
                .attr("d", line)
                .attr("stroke-width", 3)
                .attr("stroke", (_, i) => colors[i])
                .attr("fill", (_,i) => colors[i])
                .attr("stroke-opacity", 1)
                .attr("opacity", 0.5)
        );

};
radarChart(features, "#chart-one");
radarChart(features, "#chart-two");
radarChart(features, "#chart-three");
radarChart(features, "#chart-four");

function lineGraph() {
    let data = [0,2,3,5,1,7,3,4];
    let date = [0,1,2,3,4,5,6,7];

    const x = d3.scaleUtc()
        .domain([0,10])
        .range([0,10]);
    const y = d3.scaleLinear()
        .domain([0,10])
        .range([0,10])

    let width = 350;
    let height = 350;
    let svg = d3.select("#line-graph").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0,0,width,height])
        .attr("style", "max-width: 100%; height: auto; overflow: visible; font: 10px sans-serif;");


};
/*lineGraph();*/