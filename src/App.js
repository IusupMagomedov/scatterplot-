import { useEffect, useState, useRef } from 'react'
import './App.css'
import * as d3 from "d3"

const timeFormat = seconds => {
  return `${Math.floor(seconds/60)}:${(seconds - Math.floor(seconds/60) * 60).toFixed(0).padStart(2, 0)}`
}

const toDateTime = secs =>  {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(secs);
  return t;
}




function App() {
  const [plotData, setPlotData] = useState([])
  const [toolTipConteiner, setToolTipConteiner] = useState("")
  const [toolTip, setToolTip] = useState("")
  

  const handleMouseOver = (d, i) => {
    
    // console.log("Handle Mouse Over: ", i)
    setToolTipConteiner(i)
  }

  const handleMouseOut = () => {
    setToolTipConteiner("")
  }

  const svgRef = useRef(null)

  const padding = 60
  const w = 920
  const h = 630
  const circleRadius = 5
  const legendRectEdge = 20
  const legendXPos = 600
  const legendYPos = 150

  useEffect(() => {
    fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
      .then(response => response.json())
      .then(data => setPlotData(data))
      .catch(error => console.log(error))
    return () => { }
  }, [])

  useEffect(() => {

    // console.log("useEffect toolTipConteiner: ", toolTipConteiner)
    if(toolTipConteiner === "") {
      setToolTip({transparency: false})
    } else {
      setToolTip({
        ...toolTipConteiner,
        transparency: true,
      })
    }
  
    return () => {}
  }, [toolTipConteiner])


  useEffect(() => {
    const svg = d3.select(svgRef.current)

    const legend = svg.append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${legendXPos}, ${legendYPos})`)

    legend.append("rect")
      .attr("fill", "red")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", legendRectEdge)
      .attr("height", legendRectEdge)
      .attr("stroke-width", 1)
      .attr("stroke", "black")    
      .attr("transform", `translate(0, 0)`)

    legend.append("rect")
      .attr("fill", "green")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", legendRectEdge)
      .attr("height", legendRectEdge)
      .attr("stroke-width", 1)
      .attr("stroke", "black")    
      .attr("transform", `translate(0, 30)`)

    legend.append("text")
      .text("Riders with doping allegations")
      .attr("transform", `translate(${legendRectEdge + 2}, ${legendRectEdge * 3 / 4})`)
      
    legend.append("text")
      .text("No doping allegations")
      .attr("transform", `translate(${legendRectEdge + 2}, ${legendRectEdge * 3 / 4 + 30})`)



    const xScale = d3.scaleLinear()
      .domain([d3.min(plotData, d => d.Year ), d3.max(plotData, d => d.Year)])
      .range([padding, w - padding])

    const yScale = d3.scaleLinear()
      .domain([d3.min(plotData, d => d.Seconds), d3.max(plotData, d => d.Seconds)])
      .range([padding, h - padding])

    svg.selectAll("circle")
      .data(plotData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => toDateTime(d.Seconds))
      .attr("cy", d => yScale(d.Seconds))
      .attr("cx", d => xScale(d.Year))
      .attr("r", circleRadius)
      .attr("fill", d => d.Doping!==""?"red":"green")
      .attr("stroke", "black")
      .attr("stroke-width", "1")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)

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
      {/* {console.log("App, toolTip: ",toolTip)} */}
      <svg width={w} height={h} ref={svgRef}>
        <text id="title" x={padding} y={padding - 20}>Doping in Professional Bicycle Racing</text>
        <text 
          className="tooltip" 
          id="tooltip" 
          style={{"opacity": 0 + toolTip.transparency?0.9:0}}
          x={padding}
          y={h - 20}
          data-year={toolTip.Year}
          >
          "{toolTip.Name}: {toolTip.Nationality}"
          <br/>
          "Year: {toolTip.Year}, Time: {toolTip.Time}"
          <br/>
          <br/>
          {toolTip.Doping}
        </text>
      </svg>
    </div>
  );
}

export default App;
