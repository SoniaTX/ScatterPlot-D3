var url = 
"https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
 
d3.json(url, function (data) {
  
 var width = 900;
 var height = 470;

  var margin = { top: 20, right: 30, bottom: 20, left: 40 };  
   
  var svg = d3.select("body").append("svg")
     .attr("height", height + margin.top + margin.bottom)
     .attr("width", width + margin.left + margin.right);
   
 svg.append("rect")
     .attr("width", width + margin.left + margin.right)
     .attr("height", height + margin.top + margin.bottom)
        .attr("x", 0)
        .attr("y", 0)
        .attr("fill", "black")
        .attr("fill-opacity", 0.8); 

   svg = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  var parse = d3.timeParse('%M:%S');
  var format = d3.timeFormat('%M:%S')

  var timeMin = d3.min(data, (d) => parse(d.Time));
  var timeMax = d3.max(data, (d) => parse(d.Time));
 
  var firstYear = d3.min(data, function(d) { return d.Year }),
     lastYear = d3.max(data, function(d) { return d.Year });
  
var xScale = d3.scaleTime()
    .domain([firstYear, lastYear])
    .range([margin.left, width - margin.right])
   
var yScale = d3.scaleTime()
    .domain([timeMin, timeMax])
    .range([height - margin.bottom, margin.top])


var xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.format("d"))
  
var yAxis = d3.axisLeft(yScale)
    .tickFormat(format)

  svg.append('g')
    .attr('id', 'x-axis')
    .attr("class", "axis")
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis)
     .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("YEARS");

  svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .attr('id', 'y-axis')
    .attr("class", "axis")
    .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("TIME (in Minutes)");

        svg.append("rect") 
            .attr("x", 900)
            .attr("y", height - 250)
            .attr("height", 10)
            .attr("width", 10)
            .attr("fill", "darkred") 
        svg.append("text")
            .text("Corrupt Bicyclists ")
            .attr("x", 790)
            .attr("y", height - 240)
            .attr("id", "legend")
      
         svg.append("rect") 
            .attr("x", 900)
            .attr("y", height - 230)
            .attr("height", 10)
            .attr("width", 10)
            .attr("fill", "limegreen") 
        svg.append("text")
            .text("Clean")
            .attr("x", 860)
            .attr("y", height - 220)
            .attr("id", "legend")
   
        
var tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("opacity", 0);
  
  svg.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
		 .attr("class","dot")
		 .attr("data-xvalue", (data) => data.Year )
		 .attr("data-yvalue", (data) => parse(data.Time) )
     .attr("cx", (data) => xScale(data.Year))
     .attr("cy", (data) => yScale(parse(data.Time)) )
		 .attr("r",6)
     .attr("fill", (data) => data.Doping!="" ? "darkred" : "limegreen")
 
   svg.selectAll("circle")
        .data(data)
        .on("mouseover", function(d) {  
        d3.select(this);
          tooltip.transition()
               .duration(200)
               .style("opacity", .9);
          tooltip.html("<span><b>" + d.Name + ": " + d.Nationality + "<br/>" + 
            "Place: " + d.Place + " | Time: " + d.Time + "<br/>" + 
            "Year: " + d.Year + "<br/><br/>" + 
             d.Doping + "<br/>" + "<span style='color:red'>" + "Click on Dot for More Info" + "</span>" + "</b></span>")
                     .attr('data-year', d.Year)
                    .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");      
      })
        .on('click', function(d) {
        if (d.Doping !== "") {
          window.open(d.URL, '_blank');
        }
      })
      .on("mouseout", function(d) {
            tooltip.transition()
               .duration(500)
               .style("opacity", 0);  
      });
  


});