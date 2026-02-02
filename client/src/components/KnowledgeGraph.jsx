import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './KnowledgeGraph.css';

const KnowledgeGraph = ({ links }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!links || links.length === 0) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight || 600;

    // Create nodes from links
    const nodes = links.map((link, i) => ({
      id: link._id,
      title: link.title,
      url: link.url,
      domain: link.domain,
      group: link.group,
      x: Math.random() * width,
      y: Math.random() * height,
    }));

    // Create edges based on shared groups
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        // Connect if they have the same group
        if (nodes[i].group && nodes[j].group && nodes[i].group._id === nodes[j].group._id) {
          edges.push({
            source: nodes[i].id,
            target: nodes[j].id,
            strength: 2,
          });
        }
      }
    }

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    // Create force simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id((d) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Draw edges
    const link = svg
      .append('g')
      .selectAll('line')
      .data(edges)
      .enter()
      .append('line')
      .attr('class', 'graph-link')
      .attr('stroke-width', (d) => Math.sqrt(d.strength));

    // Draw nodes
    const node = svg
      .append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'graph-node')
      .call(
        d3
          .drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      );

    // Add circles
    node
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d) => d.group?.color || '#6366f1')
      .on('click', (event, d) => {
        window.open(d.url, '_blank');
      });

    // Add text labels
    node
      .append('text')
      .text((d) => d.title.substring(0, 20))
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .attr('class', 'node-label');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => d.source.x)
        .attr('y1', (d) => d.source.y)
        .attr('x2', (d) => d.target.x)
        .attr('y2', (d) => d.target.y);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [links]);

  if (!links || links.length === 0) {
    return (
      <div className="graph-empty">
        <div className="empty-icon">🕸️</div>
        <h3>No links to visualize</h3>
        <p>Add some links to see the knowledge graph</p>
      </div>
    );
  }

  return (
    <div className="knowledge-graph">
      <div className="graph-header">
        <h3>🕸️ Knowledge Graph</h3>
        <p>Links are connected by shared collections</p>
      </div>
      <svg ref={svgRef} className="graph-svg"></svg>
    </div>
  );
};

export default KnowledgeGraph;
