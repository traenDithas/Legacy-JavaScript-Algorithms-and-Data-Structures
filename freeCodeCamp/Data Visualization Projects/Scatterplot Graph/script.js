const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

fetch(url)
  .then(response => response.json())
  .then(data => {
    const dataset = data;
    const width = 960;
    const height = 500;
    const padding = 60;

    const svg = d3.select("#chart");

    const minYear = d3.min(dataset, d => d.Year);
    const maxYear = d3.max(dataset, d => d.Year);

    const xScale = d3.scaleLinear()
    .domain([minYear - 1, maxYear + 1])
    .range([padding, width - padding]);

    const yScale = d3.scaleTime()
    .domain([d3.min(dataset, d => new Date(d.Seconds * 1000)), d3.max(dataset, d => new Date(d.Seconds * 1000))])
    .range([height - padding, padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    svg.append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`)
      .call(yAxis);

    svg.selectAll(".dot")
      .data(dataset)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 5)
      .attr("cx", d => xScale(d.Year))
      .attr("cy", d => yScale(new Date(d.Seconds * 1000)))
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => new Date(d.Seconds * 1000))
      .on("mouseover", (event, d) => {

        let tooltip = d3.select("#tooltip");

        tooltip.transition()
          .duration(200)
          .style("opacity", 0.9);

        tooltip.html(`${d.Name}: ${d.Nationality}<br>Time: ${d.Time}<br>Year: ${d.Year}<br>${d.Doping ? d.Doping : ""}`)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 30) + "px")
          .attr("data-year", d.Year);
      })

      .on("mouseout", () => {
        d3.select("#tooltip")
          .transition()
          .duration(500)
          .style("opacity", 0);
      });
  });