import 'https://unpkg.com/d3@7.8.5';

let projectNumber = '';
let ec = 0;
let oc = 0;
let eui = 0;
let lpd = 0;
let sDA = 0;
let aSE = 0;
let sDG = 0;
let iwui = 0;

let featurePoints = [ec, oc, eui, lpd, sDA, aSE, sDG, iwui];

function compiler() {
    const button = document.getElementById('compilerButton');
    
    const getProjectNum = document.getElementById('projectNumber');
    const getEC = document.getElementById('ec');
    const getOC = document.getElementById('oc');
    const getEUI = document.getElementById('eui');
    const getLPD = document.getElementById('lpd');
    const getSDA = document.getElementById('sDA');
    const getASE = document.getElementById('aSE');
    const getSDG = document.getElementById('sDG');
    const getIWUI = document.getElementById('iwui');
    
    button.addEventListener('click', function() {
        projectNumber = getProjectNum.value;
        ec = parseInt(getEC.value);
        oc = parseInt(getOC.value);
        eui = parseInt(getEUI.value);
        lpd = parseInt(getLPD.value);
        sDA = parseInt(getSDA.value);
        aSE = parseInt(getASE.value);
        sDG = parseInt(getSDG.value);
        iwui = parseInt(getIWUI.value);
        
        featurePoints = [ec, oc, eui, lpd, sDA, aSE, sDG, iwui];
        console.log(featurePoints);

        updateRadarChart(featurePoints);
    });

};
compiler();


let features = ["EC", "OC", "EUI", "LPD", "sDA", "aSE", "sDG", "IWUI"];

function radarChart (features, div, featurePoints) {
    console.log(featurePoints);
    
    let data = [];
    for (var i = 0; i<1; i++){
        var point = {}
        features.forEach((f, index) => {
            point[f] = featurePoints[index];
        });
        data.push(point);
    };
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
radarChart(features, "#chart-one", featurePoints);

function updateRadarChart(featurePoints) {
    d3.select("#chart-one svg").remove();
    radarChart(features, '#chart-one', featurePoints);
};


function donutChart(div) {
    let data = [
        { label: "Cat 1", value: 30 },
        { label: "Cat 2", value: 40 },
        { label: "Cat 3", value: 20 },
        { label: "Cat 4", value: 30 },
        { label: "Cat 5", value: 40 },
        { label: "Cat 6", value: 20 },
        { label: "Cat 7", value: 10 }
    ];

    let width = 350;
    let height = 350;
    let radius = Math.min(width, height) / 2;

    let svg = d3.select(div)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`)
        .attr("style", "max-width: 100%; height: auto");

    let arc = d3.arc()
        .innerRadius(radius * 0.67)
        .outerRadius(radius - 1);

    let pie = d3.pie()
        .padAngle(1 / radius)
        .sort(null)
        .value(d => d.value);

    let color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t), data.length));

    svg.append("g")
    .selectAll()
    .data(pie(data))
    .join("path")
        .attr("fill", d => color(d.data.label))
        .attr("d", arc)
    .append("title")
        .text(d => `${d.data.label}: ${d.data.value.toLocaleString()}`);

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
    .selectAll()
    .data(pie(data))
    .join("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.label))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value.toLocaleString("en-US")));

    return svg.node();
};
donutChart("#chart-two");

function divergeBarChart() {

    let barHeight = 25;
    let marginTop = 30;
    let marginRight = 60;
    let marginBottom = 10;
    let marginLeft = 60;
    let height = Math.ceil((data.length + 0.1) * barHeight) + marginTop + marginBottom;

    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.value))
        .rangeRound([marginLeft, width - marginRight]);

    const y = d3.scaleBand()
        .domain(data.map(d => d.state))
        .rangeRound([marginTop, height - marginBottom])
        .padding(0.1);

    const format = d3.format(metric === "absolute" ? "+,d" : "+.1%");
    const tickFormat = metric === "absolute" ? d3.formatPrefix("+.1", 1e6) : d3.format("+0%");

    const svg = d3.create("svg")
        .attr("viewBox", [0,0,width,height])
        .attr("style", ",axo-width: 100%; height: auto; font: 10px sans-serif");

};

class project {
    constructor(projectNumber, projectType) {
        this.projectNumber = projectNumber;
        this.projectType = projectType;
    }
};

let projectA = new project('184153.509', 'Lab');

console.log(projectA.projectNumber, projectA.projectType);

let projectB = new project('153512.554', 'Office');

console.log(projectB.projectNumber, projectB.projectType);