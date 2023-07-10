const margin = { top:30, right:30, bottom:30, left:40 };
const width = 600 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svgL = d3.selectAll(".contentL")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

const svgR = d3.selectAll(".contentR")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

const year = "2021";

d3.csv("./data/India_China_data.csv")
    .then(data => {

        // data as needed
        data.forEach(d => {
            d.Location = d.Location,
            d.AgeGrp = d.AgeGrp,
            d.Time = d.Time,
            d.ASFR = +d.ASFR
        });

        let IndiaData = data.filter(d => d.Location === "India" && d.Time === year);
        let ChinaData = data.filter(d => d.Location === "China" && d.Time === year);

        //tooltip methods
        let tooltip = d3.select(".contentL")
                        .append("div")
                        .style("opacity", 0)
                        .attr("class", "barLValue")

        let mouseover = (e, d) => {
            tooltip.style("opacity", 1);
        };

        let mousemove = (e, d) => {
            tooltip.transition()
            .duration(200)
            .style("opacity", .9);
            tooltip.html(`Age Group: ${d.AgeGrp} <br> ASFR: ${d.ASFR}`)
            .style("left", (e.pageX) + "px")
            .style("top", (e.pageY) + "px");
        };

        let mouseleave = (e, d) => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        };

        //common y axis
        yMinIndia = d3.min(IndiaData, d => d.ASFR);
        yMinChina = d3.min(ChinaData, d => d.ASFR);
        yMaxIndia = d3.max(IndiaData, d => d.ASFR);
        yMaxChina = d3.max(ChinaData, d => d.ASFR);

        //y axis scale
        let yScale = d3.scaleLinear()
                        .domain([Math.min(yMinIndia, yMinChina), Math.max(yMaxIndia, yMaxChina)])
                        .range([height-margin.bottom, margin.top])

        //set axis on the left
        let yAxis = d3.axisLeft(yScale);


        //INDIA

        // add y-axis to svg
        svgL.append("g")
            .attr("class", "yAxis")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll("line").remove());

        let xLVal = []
        IndiaData.forEach(d => {
            xLVal.push(d.AgeGrp);
        });

        //x axis scale
        let xScaleL = d3.scaleBand()
                        .domain(xLVal)
                        .range([margin.left, width-margin.right]);

        // set axis on the bottom 
        let xAxisL = d3.axisBottom(xScaleL);

        // add x-axis to svg
        svgL.append("g")
            .attr("class", "xAxisL")
            .attr("transform", `translate(${margin.left}, ${height-margin.bottom})`)
            .call(xAxisL)
            .call(g => g.select(".domain").remove())

        //rectangle svg for bar plot
        svgL.selectAll(".barL")
            .data(IndiaData)
            .enter().append("rect")
            .attr("class", "barL")
            .attr("x", d => xScaleL(d.AgeGrp))
            .attr("y", d => yScale(d.ASFR)-margin.bottom)
            .attr("width", xScaleL.bandwidth()-2)
            .attr("height", d => height-yScale(d.ASFR)-margin.bottom)
            .attr("transform", `translate(${margin.left}, 0)`)
            .on("mouseover", mouseover) // add tooltip on mouse move
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)

        //labels
        svgL.selectAll(".labelIndia")
            .data(IndiaData)
            .enter().append("text")
            .attr("class", "labelIndia")
            .attr("x", xScaleL("30-34"))
            .attr("y", `${height-margin.bottom}`)
            .attr("dy", 40)
            .text("India")
            .attr("transform", `translate(${margin.left}, 0)`)


        //CHINA

        // add y-axis to svg (conditionally -- css rule)
        svgR.append("g")
            .attr("class", "yAxisR")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis)
            .call(g => g.select(".domain").remove())
            .call(g => g.selectAll("line").remove());

        let xRVal = [];
        ChinaData.forEach(d => {
            xRVal.push(d.AgeGrp);
        });

        //x-axis scale
        let xScaleR = d3.scaleBand()
                        .domain(xRVal)
                        .range([margin.left, width-margin.right]);

        // set axis on the bottom
        let xAxisR = d3.axisBottom(xScaleR);

        //add x-axis to svg
        svgR.append("g")
            .attr("class", "xAxisR")
            .attr("transform", `translate(${margin.left}, ${height-margin.bottom})`)
            .call(xAxisR)
            .call(g =>g.select(".domain").remove());

        svgR.selectAll(".barR")
            .data(ChinaData)
            .enter().append("rect")
            .attr("class", "barR")
            .attr("x", d => xScaleR(d.AgeGrp))
            .attr("y", d => yScale(d.ASFR)-margin.bottom)
            .attr("width", xScaleR.bandwidth()-2)
            .attr("height", d => height-yScale(d.ASFR)-margin.bottom)
            .attr("transform", `translate(${margin.left}, 0)`)
            .on("mouseover", mouseover) // add tooltip on mouse move
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
        
        //label
        svgR.selectAll(".labelChina")
            .data(ChinaData)
            .enter().append("text")
            .attr("class", "labelChina")
            .attr("x", xScaleR("30-34"))
            .attr("y", `${height-margin.bottom}`)
            .attr("dy", 40)
            .text("China")
            .attr("transform", `translate(${margin.left}, 0)`)


    });
