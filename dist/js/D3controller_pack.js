var margin = {top: 10, right: 30, bottom: 20, left: 50},
  width = 800 - margin.left - margin.right,
  height = 420 - margin.top - margin.bottom;

var svg_pack = d3.select("#my_dataviz_pack")
  .append("svg")
  .attr("viewBox", `0 0 800 450`)
  .append("g")
  .attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");

var multiplier = 7
var graphData = {
  nodes:[
    {name: "European Union", radius: 15.4*multiplier, color:"#CC6677"},
    {name: "China", radius: 13.3*multiplier, color:"#785EF0"},
    {name: "India", radius: 10.3*multiplier, color:"#0C7BDC"},
    {name: "Russia", radius: 7.36*multiplier, color: "#88CCEE"},
    {name: "USA", radius: 5.23*multiplier, color: "#DDCC77"},
    {name: "Canada", radius: 3.24*multiplier, color: "#FE6100"},
    {name: "Ukraine", radius: 2.91*multiplier, color: "#117733"}
  ],

  links:[
    { source: "European Union", target: "Canada"},
    { source: "China", target: "Europe"},
    { source: "India", target: "Russia"},
    { source: "Russia", target: "China"},
    { source: "Russia", target: "European Union"},
    { source: "USA", target: "Canada"},
    { source: "Canada", target: "Ukraine"},
  ]
};

var simulation = d3
  .forceSimulation(graphData.nodes)
  .force("change", d3.forceManyBody().strength(500))
  .force("center", d3.forceCenter(width/2, height/2))
  .force("collide", d3.forceCollide(function (d) {
    return d.radius;
  }))
  .on("tick", ticked);

var links = svg_pack
  .append("g")
  .selectAll("line")
  .data(graphData.links)
  .enter()
  .append("line")
  .attr("stroke-width", 3)
  .style("stroke", "orange");

var drag = d3
  .drag()
  .on("start", dragstarted)
  .on("drag", dragged)
  .on("end", dragended);

var textsAndNodes = svg_pack
  .append("g")
  .selectAll("g")
  .data(graphData.nodes)
  .enter()
  .append("g")
  .call(drag);

var circles = textsAndNodes
  .append("circle")
  .attr("r", function (d) {
    return d.radius;
  })
  .attr("fill", function (d) {
    return d.color;
  })

var texts = textsAndNodes.append("text").text(function (d) {
  return d.name;
})


function ticked() {
  textsAndNodes.attr("transform", function(d){
    return "translate("+ d.x +", "+ d.y +")";
  });

  links
    .attr("x1", function(d){
      return d.source.x;
    })
    .attr("y1", function(d){
      return d.source.y;
    })
    .attr("x2", function(d){
      return d.source.x;
    })
    .attr("y2", function(d){
      return d.source.y;
    })
  // console.log(simulation.alpha());
}


function dragstarted(d){
  simulation.alphaTarget(0.3).restart();
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragged(d){
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d){
  simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

