
import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { AITool, ToolCategory } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  category: ToolCategory;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  type: string;
}

interface RelationMapProps {
  tools: AITool[];
  onToolClick?: (tool: AITool) => void;
}

const RelationMap: React.FC<RelationMapProps> = ({ tools, onToolClick }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const { nodes, links } = useMemo(() => {
    const nodes: Node[] = tools.map(t => ({
      id: t.id,
      name: t.name,
      category: t.category,
    }));

    const links: Link[] = [];
    tools.forEach(tool => {
      tool.relations?.forEach(rel => {
        // Only include links where both source and target exist in our tools list
        if (tools.find(t => t.id === rel.targetId)) {
          links.push({
            source: tool.id,
            target: rel.targetId,
            type: rel.type,
          });
        }
      });
    });

    return { nodes, links };
  }, [tools]);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height])
      .attr('width', '100%')
      .attr('height', '100%')
      .style('max-height', '600px');

    svg.selectAll('*').remove();

    const simulation = d3.forceSimulation<Node>(nodes)
      .force('link', d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));

    // Arrow marker
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#94a3b8')
      .style('stroke', 'none');

    const g = svg.append('g');

    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#334155')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('marker-end', 'url(#arrowhead)');

    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        const tool = tools.find(t => t.id === d.id);
        if (tool && onToolClick) onToolClick(tool);
      })
      .call(d3.drag<SVGGElement, Node>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    node.append('circle')
      .attr('r', d => d.category === ToolCategory.CONCEPT ? 14 : 10)
      .attr('fill', d => {
        if (d.category === ToolCategory.CONCEPT) return '#ffffff';
        if (d.category.includes('Language')) return '#0ea5e9';
        if (d.category.includes('Framework')) return '#f43f5e';
        if (d.category.includes('Database')) return '#10b981';
        return '#64748b';
      })
      .attr('stroke', '#000000')
      .attr('stroke-width', 2)
      .style('filter', d => d.category === ToolCategory.CONCEPT ? 'drop-shadow(0 0 4px rgba(255,255,255,0.4))' : 'none');

    node.append('text')
      .attr('x', 16)
      .attr('y', 4)
      .text(d => d.name)
      .attr('fill', d => d.category === ToolCategory.CONCEPT ? '#ffffff' : '#94a3b8')
      .style('font-family', '"JetBrains Mono", monospace')
      .style('font-size', d => d.category === ToolCategory.CONCEPT ? '12px' : '10px')
      .style('font-weight', 'bold')
      .style('text-transform', 'uppercase')
      .style('letter-spacing', '0.05em')
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as any).x)
        .attr('y1', d => (d.source as any).y)
        .attr('x2', d => (d.target as any).x)
        .attr('y2', d => (d.target as any).y);

      node
        .attr('transform', d => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Zoom behavior
    svg.call(d3.zoom<SVGSVGElement, unknown>()
      .extent([[0, 0], [width, height]])
      .scaleExtent([0.5, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      }));

  }, [nodes, links, tools, onToolClick]);

  return (
    <div className="w-full bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-slate-900/80 p-2 rounded border border-slate-700 text-xs text-slate-400 pointer-events-none">
        Drag to move nodes • Scroll to zoom
      </div>
      <svg ref={svgRef} className="w-full h-full cursor-move" />
    </div>
  );
};

export default RelationMap;
