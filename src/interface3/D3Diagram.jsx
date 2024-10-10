import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import PV from '../assets/PV.png';
import MS from '../assets/MS.png';
import RS from '../assets/RS.png';
import './styles.css';
const D3Diagram = ({ series }) => {
  const ref = useRef();

  useEffect(() => {
    const svg = d3.select(ref.current)
      .attr('viewBox', '70 -30 450 370')
      .attr('preserveAspectRatio', 'xMidYMid meet');
  
    svg.selectAll('*').remove(); // Clear SVG content before re-rendering
  
    const data = {
      nodes: [
        { id: '1', x: 300, y: 50, label: 'PV', kw: `${series[0]} kW`, color: '#FFD700', image: PV },
        { id: '2', x: 150, y: 250, label: 'Load', kw: `${series[1]} kW`, color: '#00BFFF', image: MS },
        { id: '3', x: 450, y: 250, label: 'Grid', kw: `${series[2]} kW`, color: '#BA55D3', image: RS },
      ],
      links: [],
    };
  

    if (series[0] > 0 && series[2] > 0) {
      data.links = [
        { source: '1', target: '2', color: '#00BFFF' },
        { source: '3', target: '2', color: '#BA55D3' },
      ];
    } else if (series[0] == 0 && series[2] > 0) {
      data.links = [
        { source: '3', target: '2', color: '#BA55D3' },

      ];
    }
    else if (series[0] > 0 && series[2] < 0) {
      data.links = [
        { source: '1', target: '2', color: '#00BFFF' },
        { source: '1', target: '3', color: '#00BFFF' },

      ];
    }
    const defs = svg.append('defs');
  
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 13)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 13)
      .attr('markerHeight', 13)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', 'black')
      .style('stroke', 'none');
  
    // Define the tooltip
    const tip = d3Tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
 
  
    svg.call(tip);
  
    const link = svg.selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('x1', d => calculateEdgePosition(d.source, d.target).x1)
      .attr('y1', d => calculateEdgePosition(d.source, d.target).y1)
      .attr('x2', d => calculateEdgePosition(d.source, d.target).x2)
      .attr('y2', d => calculateEdgePosition(d.source, d.target).y2)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2);
  
    const node = svg.selectAll('.node')
      .data(data.nodes)
      .enter().append('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);
  
    node.append('circle')
      .attr('r', 60)
      .attr('fill', 'white')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 1);
  
    node.append('circle')
      .attr('r', 50)
      .attr('fill', 'white')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 3);
  
    node.append('image')
      .attr('xlink:href', d => d.image)
      .attr('x', -20)
      .attr('y', -30)
      .attr('width', 40)
      .attr('height', 40);
  
    node.append('text')
      .attr('dy', 80)
      .attr('text-anchor', 'middle')
      .text(d => d.label);
  
    node.append('text')
      .attr('dy', 30)
      .attr('text-anchor', 'middle')
      .text(d => d.kw);
  
    // Create sliding arrows
    data.links.forEach(link => {
      const path = svg.append('path')
        .attr('class', 'arrow-path')
        .attr('d', () => {
          const { x1, y1, x2, y2 } = calculateEdgePosition(link.source, link.target);
          return `M${x1},${y1} L${x2},${y2}`;
        })
        .attr('stroke', 'none')
        .attr('fill', 'none');
  
      const arrow = svg.append('circle')
        .attr('r', 5)
        .attr('fill', link.color);
  
      function repeat() {
        const { x1, y1 } = calculateEdgePosition(link.source, link.target);
        arrow.attr('transform', `translate(${x1}, ${y1})`)
          .transition()
          .duration(2500)
          .ease(d3.easeLinear)
          .attrTween('transform', translateAlong(path.node()))
          .on('end', repeat);
      }
  
      repeat();
    });
  
    function calculateEdgePosition(sourceId, targetId) {
      const sourceNode = data.nodes.find(n => n.id === sourceId);
      const targetNode = data.nodes.find(n => n.id === targetId);
      const radius = 50; // Adjust this according to your circle's radius
  
      const angle = Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x);
  
      const x1 = sourceNode.x + radius * Math.cos(angle);
      const y1 = sourceNode.y + radius * Math.sin(angle);
      const x2 = targetNode.x - radius * Math.cos(angle);
      const y2 = targetNode.y - radius * Math.sin(angle);
  
      return { x1, y1, x2, y2 };
    }
  
    function translateAlong(path) {
      const length = path.getTotalLength();
      return function (d, i, a) {
        return function (t) {
          const point = path.getPointAtLength(t * length);
          return `translate(${point.x},${point.y})`;
        };
      };
    }
  }, [series]); // Dependency array to run effect when `series` changes
  
  return (
    <svg ref={ref}></svg>
  );
};

export default D3Diagram;
