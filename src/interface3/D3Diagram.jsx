import './D3Diagram.css';
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import d3Tip from 'd3-tip';
import PV from '../assets/PV.png';
import MS from '../assets/MS.png';
import RS from '../assets/RS.png';

const D3Diagram = ({ series }) => {
  const ref = useRef();

  useEffect(() => {

    const svg = d3.select(ref.current)
      .attr('viewBox', '0 -30 550 400')
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.selectAll('*').remove(); // Clear SVG content before re-rendering

    const data = {
      nodes: [
        { id: '1', x: 300, y: 50, label: 'PV', kw: `${series[0]} kW`, color: '#FFD700', image: PV },
        { id: '2', x: 150, y: 250, label: 'Load', kw: `${series[1]} kW`, color: '#00BFFF', image: MS },
        { id: '3', x: 450, y: 250, label: 'Grid', kw: `${series[2]} kW`, color: '#BA55D3', image: RS },
      ],
      links: [
        { source: '1', target: '2', color: '#00BFFF', info: 'Power flow to Load' },
        { source: '1', target: '3', color: '#BA55D3', info: 'Power flow to Grid' },
        { source: '2', target: '3', color: '#00BFFF', info: 'Power flow from Load to Grid' },
      ],
    };

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
      .html((event, d) => `<strong>Info:</strong> <span style='color:red'>${d.info}</span>`);

    svg.call(tip);

    const link = svg.selectAll('.link')
      .data(data.links)
      .enter().append('line')
      .attr('class', 'link')
      .attr('x1', d => data.nodes.find(n => n.id === d.source).x)
      .attr('y1', d => data.nodes.find(n => n.id === d.source).y)
      .attr('x2', d => data.nodes.find(n => n.id === d.target).x)
      .attr('y2', d => data.nodes.find(n => n.id === d.target).y)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

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
          const sourceNode = data.nodes.find(n => n.id === link.source);
          const targetNode = data.nodes.find(n => n.id === link.target);
          return `M${sourceNode.x},${sourceNode.y} L${targetNode.x},${targetNode.y}`;
        })
        .attr('stroke', 'none')
        .attr('fill', 'none');

      const arrow = svg.append('circle')
        .attr('r', 5)
        .attr('fill', link.color);

      function repeat() {
        arrow.attr('transform', `translate(${data.nodes.find(n => n.id === link.source).x}, ${data.nodes.find(n => n.id === link.source).y})`)
          .transition()
          .duration(2000)
          .ease(d3.easeLinear)
          .attrTween('transform', translateAlong(path.node()))
          .on('end', repeat);
      }

      repeat();
    });

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
