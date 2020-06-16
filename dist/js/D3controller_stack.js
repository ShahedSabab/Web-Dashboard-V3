var data = [
    {
        "group": '[2010]',
        "TY Imports": 404,
        "TY Imp. from US": 330
    },
    {
        "group": '[2011]',
        "TY Imports": 467,
        "TY Imp. from US": 397
    },
    {
        "group": '[2012]',
        "TY Imports": 455,
        "TY Imp. from US": 382
    },
    {
        "group": '[2013]',
        "TY Imports": 415,
        "TY Imp. from US": 320
    },
    {
        "group": '[2014]',
        "TY Imports": 544,
        "TY Imp. from US": 352
    },
    {
        "group": "[2015]",
        "TY Imports": 510,
        "TY Imp. from US": 345
    },
    {
        "group": "[2016]",
        "TY Imports": 506,
        "TY Imp. from US": 334
    },
    {
        "group": "[2017]",
        "TY Imports": 451,
        "TY Imp. from US": 264
    },
    {
        "group": "[2018]",
        "TY Imports": 478,
        "TY Imp. from US": 290
    },
    {
        "group": "[2019]",
        "TY Imports": 500,
        "TY Imp. from US": 0
    }
]


// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 750 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg_stack = d3.select("#my_dataviz_stack")
    .append("svg")
    .attr("viewBox", `0 0 750 320`)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


var subgroups = ["group", "TY Imports", "TY Imp. from US"]

var groups = d3.map(data, function (d) {
    return (d.group)
}).keys()

// Add X axis
var x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.3])
svg_stack.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .style("font-size", "14px");

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 1000])
    .range([height, 0]);
svg_stack.append("g")
    .call(d3.axisLeft(y))
    .style("font-size", "14px");
;

// color palette = one color per subgroup
var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#343a40', '#173F5F', '#ED553B'])
//stack the data? --> stack per subgroup
var stackedData = d3.stack()
    .keys(subgroups)
    (data)


// ----------------
// Create a tooltip
// ----------------
var tooltip_stack = d3.select("#my_dataviz_stack")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "black")
    .style("color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function (d) {
    var subgroupName = d3.select(this.parentNode).datum().key;
    var subgroupValue = d.data[subgroupName];
    tooltip_stack
        .html("subgroup: " + subgroupName + "<br>" + "Value: " + subgroupValue)
        .style("opacity", 0.8)
        .style("cursor","hand")
}
var mousemove = function (d) {
    tooltip_stack
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 20) + "px")
}
var mouseleave = function (d) {
    tooltip_stack
        .style("opacity", 0)
}



// Show the bars
svg_stack.append("g")
    .selectAll("g")
    // Enter in the stack data = loop key per key = group per group
    .data(stackedData)
    .enter().append("g")
    .attr("fill", function (d) {
        return color(d.key);
    })
    .selectAll("rect")
    // enter a second time = loop subgroup per subgroup to add all rectangles
    .data(function (d) {
        return d;
    })
    .enter().append("rect")
    .attr("x", function (d) {
        return x(d.data.group);
    })
    .attr("y", function (d) {
        if(isNaN(d[1])) {
            return 0;
        }
        else{
            return y(d[1]);
        }
    })
    .attr("height", function (d) {
        if(isNaN(d[1]))
        {
            return 0;
        }
        else{
            return y(d[0]) - y(d[1]);
        }
    })

    .attr("width", x.bandwidth())
    .attr("stroke", "grey")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)


