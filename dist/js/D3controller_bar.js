var data = [
    {
        "group": '[2010/11]',
        "Stock": 7743,
    },
    {
        "group": '[2011/12]',
        "Stock": 7360
    },
    {
        "group": '[2012/13]',
        "Stock": 5932,
    },
    {
        "group": '[2013/14]',
        "Stock": 5112,
    },
    {
        "group": '[2014/15]',
        "Stock": 10398,
    },
    {
        "group": "[2015/16]",
        "Stock": 7101,
    },
    {
        "group": "[2016/17]",
        "Stock": 5178,
    },
    {
        "group": "[2017/18]",
        "Stock": 6931,
    },
    {
        "group": "[2018/19]",
        "Stock": 6732,
    },
    {
        "group": "[2019/20]",
        "Stock": 6040,
    }
]


// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 20, left: 50},
    width = 750 - margin.left - margin.right,
    height = 320 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg_bar = d3.select("#my_dataviz_bar")
    .append("svg")
    .attr("viewBox", `0 0 750 320`)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");


var subgroups = ["group", "Stock"]

var groups = d3.map(data, function (d) {
    return (d.group)
}).keys()

// Add X axis
var x = d3.scaleBand()
    .domain(groups)
    .range([0, width])
    .padding([0.3])
svg_bar.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .style("font-size", "14px");

// Add Y axis
var y = d3.scaleLinear()
    .domain([0, 10500])
    .range([height, 0]);
svg_bar.append("g")
    .call(d3.axisLeft(y))
    .style("font-size", "14px");
;

// color palette = one color per subgroup
var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['#343a40', '#343a40', '#ED553B'])

//stack the data? --> stack per subgroup
var stackedData = d3.stack()
    .keys(subgroups)
    (data)


// ----------------
// Create a tooltip
// ----------------
var tooltip_bar = d3.select("#my_dataviz_bar")
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
    tooltip_bar
        .html(subgroupName + "<br>" + "Value: " + subgroupValue)
        .style("opacity", 0.8)
}
var mousemove = function (d) {
    tooltip_bar
        .style("left", (d3.mouse(this)[0] + 30) + "px")
        .style("top", (d3.mouse(this)[1] + 20) + "px")
}
var mouseleave = function (d) {
    tooltip_bar
        .style("opacity", 0)
}

// Show the bars
svg_bar.append("g")
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


