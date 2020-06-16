var data = [
    {
        name: "Total Supply",
        values: [
            {date: "2010", price: "31456"},
            {date: "2011", price: "33108"},
            {date: "2012", price: "33632"},
            {date: "2013", price: "43120"},
            {date: "2014", price: "40389"},
            {date: "2015", price: "35256"},
            {date: "2016", price: "37820"},
            {date: "2017", price: "37761"},
            {date: "2018", price: "39415"},
            {date: "2019", price: "38890"}
        ]
    },
    {
        name: "Production",
        values: [
            {date: "2010", price: "23300"},
            {date: "2011", price: "25288"},
            {date: "2012", price: "27246"},
            {date: "2013", price: "37589"},
            {date: "2014", price: "29442"},
            {date: "2015", price: "27647"},
            {date: "2016", price: "32140"},
            {date: "2017", price: "30377"},
            {date: "2018", price: "32201"},
            {date: "2019", price: "32350"}
        ]
    },
    {
        name: "Total Export",
        values: [
            {date: "2010", price: "16575"},
            {date: "2011", price: "17352"},
            {date: "2012", price: "18953"},
            {date: "2013", price: "23268"},
            {date: "2014", price: "24170"},
            {date: "2015", price: "22091"},
            {date: "2016", price: "20218"},
            {date: "2017", price: "22000"},
            {date: "2018", price: "24404"},
            {date: "2019", price: "23000"}
        ]
    }
];

var width = 550;
var height = 260;
var margin = 50;
var duration = 250;

var lineOpacity = "0.7";
var lineOpacityHover = "1";
var otherLinesOpacityHover = "0.1";
var lineStroke = "4px";
var lineStrokeHover = "2.5px";

var circleOpacity = '0.85';
var circleOpacityOnLineHover = "0.25"
var circleRadius = 3.5;
var circleRadiusHover = 7;


/* Format Data */
var parseDate = d3.timeParse("%Y");
data.forEach(function(d) {
    d.values.forEach(function(d) {
        d.date = parseDate(d.date);
        d.price = +d.price;
    });
});


/* Scale */
var xScale = d3.scaleTime()
    .domain(d3.extent(data[0].values, d => d.date))
    .range([0, width-margin]);

var yScale = d3.scaleLinear()
    .domain([0, d3.max(data[0].values, d => d.price)])
    .range([height-margin, 0]);

var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#117733', '#173F5F', '#ED553B'])


/* Add SVG */
var svg = d3.select("#my_dataviz_line").append("svg")
    .attr("viewBox", `0 0 600 280`)
    .append("g")
    .attr("transform",
        "translate(" + margin + "," + margin + ")");


/* Add line into SVG */
var line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.price));

let lines = svg.append('g')
    .attr('class', 'lines');

lines.selectAll('.line-group')
    .data(data).enter()
    .append('g')
    .attr('class', 'line-group')
    .on("mouseover", function(d, i) {
        svg.append("text")
            .attr("class", "title-text")
            .text(d.name)
            .style("cursor", "pointer")
            .attr("text-anchor", "middle")
            .attr("x", (width-120)/2)
            .attr("y", -5);
    })
    .on("mouseout", function(d) {
        svg.select(".title-text").remove();
    })
    .append('path')
    .attr('class', 'line')
    .attr('d', d => line(d.values))
    .style('stroke', (d, i) => color(i))
    .style('opacity', lineOpacity)
    .on("mouseover", function(d) {
        d3.selectAll('.line')
            .style('opacity', otherLinesOpacityHover);
        d3.selectAll('.circle')
            .style('opacity', circleOpacityOnLineHover);
        d3.select(this)
            .style('opacity', lineOpacityHover)
            .style("stroke-width", lineStrokeHover)
            .style("cursor", "pointer");
    })
    .on("mouseout", function(d) {
        d3.selectAll(".line")
            .style('opacity', lineOpacity);
        d3.selectAll('.circle')
            .style('opacity', circleOpacity);
        d3.select(this)
            .style("stroke-width", lineStroke)
            .style("cursor", "none");
    });


/* Add circles in the line */
lines.selectAll("circle-group")
    .data(data).enter()
    .append("g")
    .style("fill", (d, i) => color(i))
    .selectAll("circle")
    .data(d => d.values).enter()
    .append("g")
    .attr("class", "circle")
    .on("mouseover", function(d) {
        d3.select(this)
            .style("cursor", "pointer")
            .append("text")
            .attr("class", "text")
            .text(`${d.price}`)
            .attr("x", d => xScale(d.date) + 5)
            .attr("y", d => yScale(d.price) - 10);
    })
    .on("mouseout", function(d) {
        d3.select(this)
            .style("cursor", "none")
            .transition()
            .duration(duration)
            .selectAll(".text").remove();
    })
    .append("circle")
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yScale(d.price))
    .attr("r", circleRadius)
    .style('opacity', circleOpacity)
    .on("mouseover", function(d) {
        d3.select(this)
            .transition()
            .duration(duration)
            .attr("r", circleRadiusHover);
    })
    .on("mouseout", function(d) {
        d3.select(this)
            .transition()
            .duration(duration)
            .attr("r", circleRadius);
    });


/* Add Axis into SVG */
var xAxis = d3.axisBottom(xScale).ticks(10);
var yAxis = d3.axisLeft(yScale).ticks(10);

svg.append("g")
    .style("font-size", "12px")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height-margin})`)
    .call(xAxis);

svg.append("g")
    .style("font-size", "12px")
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
