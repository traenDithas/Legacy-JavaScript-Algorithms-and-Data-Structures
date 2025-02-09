const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

  fetch(url)
    .then(response => response.json())
    .then(data => {
      const gdpData = data.data;

      const margin = { top: 50, right: 20, bottom: 70, left: 70 };
      const width = 900 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const svg = d3.select("#chart")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const x = d3.scaleTime()
        .domain([new Date(gdpData[0][0]), new Date(gdpData[gdpData.length - 1][0])])
        .range([0, width]);

      const y = d3.scaleLinear()
        .domain([0, d3.max(gdpData, d => d[1])])
        .range([height, 0]);

      svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x));

      svg.append("g")
        .attr("id", "y-axis")
        .call(d3.axisLeft(y));

      const tooltip = d3.select("body").append("div")
        .attr("id", "tooltip");

      svg.selectAll(".bar")
        .data(gdpData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("data-date", d => d[0])
        .attr("data-gdp", d => d[1])
        .attr("x", d => x(new Date(d[0])))
        .attr("width", width / gdpData.length)
        .attr("y", d => y(d[1]))
        .attr("height", d => height - y(d[1]))
        .on("mouseover", (event, d) => {
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html(`${d[0]}<br>GDP: $${d[1].toLocaleString()}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 30) + "px")
            .attr("data-date", d[0]);
        })
        
        .on("mouseout", () => {
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        });

    });