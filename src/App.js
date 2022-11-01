import { useEffect, useState, useRef } from 'react'
import './App.css'
import * as d3 from "d3"

const timeFormat = seconds => {
  return `${Math.floor(seconds/60)}:${(seconds - Math.floor(seconds/60) * 60).toFixed(0).padStart(2, 0)}`
}






function App() {
  const [plotData, setPlotData] = useState([])

  const svgRef = useRef(null)

  const padding = 60
  const w = 920
  const h = 630

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
      .then(response => response.json())
      .then(data => setPlotData(data))
      .catch(error => console.log(error))
    return () => { }
  }, [])

  useEffect(() => {
    const svg = d3.select(svgRef.current)

    const xScale = d3.scaleLinear()
      .domain([d3.min(plotData, d => d.Year - 2), d3.max(plotData, d => d.Year + 2)])
      .range([padding, w - padding])

    const yScale = d3.scaleLinear()
      .domain([d3.min(plotData, d => d.Seconds), d3.max(plotData, d => d.Seconds)])
      .range([padding, h - padding])

    svg.selectAll("circle")
      .data(plotData)
      .enter()
      .append("circle")
      .attr("cy", d => yScale(d.Seconds))
      .attr("cx", d => xScale(d.Year))
      .attr("r", 5)
      .attr("fill", d => d.Doping!==""?"red":"green")
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      .append("title")
      .text(d => d.Doping)

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(x => `${x.toFixed(0)}`)
    const yAxis = d3.axisLeft(yScale)
      .tickFormat(x => timeFormat(x))

  

    svg.append("g")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis)
      .attr("id", "x-axis")

    svg.append("g")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis)
      .attr("id", "y-axis")

  
    return () => {}
  }, [plotData])
  


  return (
    <div className="App">
      <svg width={w} height={h} ref={svgRef}>
        <title id="title">Doping in Professional Bicycle Racing</title>
      </svg>
    </div>
  );
}

export default App;
