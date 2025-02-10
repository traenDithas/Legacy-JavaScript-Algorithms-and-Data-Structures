const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

fetch(url)
  .then(response => response.json())
  .then(data => {
    const monthlyVariance = data.monthlyVariance;
    const baseTemperature = data.baseTemperature;

    const width = 900;
    const height = 500;
    const padding = 60;

    const svg = d3.select("#heatmap")
      .attr("width", width)
      .attr("height", height);

    const legendSvg = d3.select("#legend")
      .attr("width", 300)
      .attr("height", 100);

    const minYear = d3.min(monthlyVariance, d => d.year);
    const maxYear = d3.max(monthlyVariance, d => d.year);

    const xScale = d3.scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, width - padding]);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const yScale = d3.scaleBand()
      .domain(months)
      .range([padding, height - padding])
      .paddingInner(0);

    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("transform", `translate(${padding}, 0)`)
      .attr("id", "y-axis")
      .call(yAxis);

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format("d"));

    svg.append("g")
      .attr("transform", `translate(0, ${height - padding})`)
      .attr("id", "x-axis")
      .call(xAxis);

    const tempExtent = d3.extent(monthlyVariance, d => d.variance + baseTemperature);
    const colorScale = d3.scaleLinear()
      .domain(tempExtent)
      .range(["#1f77b4", "#d6604d"]);

    const cells = svg.selectAll(".cell")
      .data(monthlyVariance)
      .enter().append("rect")
      .attr("class", "cell")
      .attr("data-month", d => d.month - 1)
      .attr("data-year", d => d.year)
      .attr("data-temp", d => d.variance + baseTemperature)
      .attr("x", d => xScale(d.year))
      .attr("y", d => yScale(months[d.month - 1]))
      .attr("width", (width - 2 * padding) / (maxYear - minYear + 1))
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d.variance + baseTemperature))
      .on("mouseover", (event, d) => {
        const tooltip = d3.select("#tooltip");
        tooltip.transition().duration(200).style("opacity", .9);
        tooltip.html(`${months[d.month - 1]} ${d.year}<br>${(d.variance + baseTemperature).toFixed(2)} ℃`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 30) + "px")
          .attr("data-year", d.year);
      })
      .on("mouseout", () => {
        d3.select("#tooltip").transition().duration(500).style("opacity", 0);
      });

    const legendDomain = colorScale.ticks(5);
    const legendWidth = 200;
    const legendHeight = 20;

    legendSvg.selectAll("rect")
        .data(legendDomain)
        .enter().append("rect")
        .attr("x", (d, i) => i * (legendWidth / legendDomain.length))
        .attr("y", 20)
        .attr("width", legendWidth / legendDomain.length)
        .attr("height", legendHeight)
        .attr("fill", colorScale);

        legendSvg.selectAll("text")
        .data(legendDomain)
        .enter().append("text")
        .attr("x", (d, i) => i * (legendWidth / legendDomain.length) + (legendWidth / legendDomain.length)/2)
        .attr("y", 50)
        .style("text-anchor", "middle")
        .text(d => d.toFixed(1));

    legendSvg.append("text")
        .attr("x", legendWidth/2)
        .attr("y", 10)
        .style("text-anchor", "middle")
        .text("Temperature");

  })
  .catch(error => console.error("Error fetching data:", error));