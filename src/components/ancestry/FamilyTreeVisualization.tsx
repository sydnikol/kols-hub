import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { User, Plus, Minus, Maximize2, Download } from 'lucide-react';
import { Ancestor } from '../../services/ancestryService';

interface TreeNode {
  ancestor: Ancestor;
  children: TreeNode[];
  x: number;
  y: number;
}

interface FamilyTreeVisualizationProps {
  ancestors: Ancestor[];
  onSelectAncestor: (ancestor: Ancestor) => void;
}

export default function FamilyTreeVisualization({
  ancestors,
  onSelectAncestor
}: FamilyTreeVisualizationProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // Build tree structure from ancestors
  const buildTree = (): TreeNode[] => {
    const nodesByGeneration: Map<number, Ancestor[]> = new Map();

    // Group ancestors by generation
    ancestors.forEach(ancestor => {
      const gen = ancestor.generation || 1;
      if (!nodesByGeneration.has(gen)) {
        nodesByGeneration.set(gen, []);
      }
      nodesByGeneration.get(gen)!.push(ancestor);
    });

    // Create tree nodes
    const roots: TreeNode[] = [];
    const maxGen = Math.max(...Array.from(nodesByGeneration.keys()));

    for (let gen = 1; gen <= maxGen; gen++) {
      const ancestorsInGen = nodesByGeneration.get(gen) || [];
      ancestorsInGen.forEach((ancestor, index) => {
        roots.push({
          ancestor,
          children: [],
          x: 0,
          y: 0
        });
      });
    }

    return roots;
  };

  const treeNodes = buildTree();

  // Calculate positions for tree nodes
  const calculatePositions = (nodes: TreeNode[], startX = 400, startY = 50, levelHeight = 150) => {
    const generations = new Map<number, TreeNode[]>();

    nodes.forEach(node => {
      const gen = node.ancestor.generation || 1;
      if (!generations.has(gen)) {
        generations.set(gen, []);
      }
      generations.get(gen)!.push(node);
    });

    generations.forEach((genNodes, gen) => {
      const width = 800;
      const spacing = width / (genNodes.length + 1);

      genNodes.forEach((node, index) => {
        node.x = startX + spacing * (index + 1) - width / 2;
        node.y = startY + (gen - 1) * levelHeight;
      });
    });

    return nodes;
  };

  const positionedNodes = calculatePositions(treeNodes);

  // Generate connections between generations
  const generateConnections = () => {
    const connections: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
    const generations = new Map<number, TreeNode[]>();

    positionedNodes.forEach(node => {
      const gen = node.ancestor.generation || 1;
      if (!generations.has(gen)) {
        generations.set(gen, []);
      }
      generations.get(gen)!.push(node);
    });

    // Connect each generation to the next
    const sortedGens = Array.from(generations.keys()).sort((a, b) => a - b);
    for (let i = 0; i < sortedGens.length - 1; i++) {
      const currentGen = generations.get(sortedGens[i])!;
      const nextGen = generations.get(sortedGens[i + 1])!;

      currentGen.forEach((parent, pIdx) => {
        // Connect to 2 children in next generation
        const childrenStart = pIdx * 2;
        for (let c = 0; c < 2 && childrenStart + c < nextGen.length; c++) {
          const child = nextGen[childrenStart + c];
          connections.push({
            x1: parent.x,
            y1: parent.y + 30,
            x2: child.x,
            y2: child.y - 10
          });
        }
      });
    }

    return connections;
  };

  const connections = generateConnections();

  // Handle mouse events for pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.2, 3));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative h-[800px] bg-gradient-to-br from-[#1A1520]/80 to-[#0A0A0F]/60 border border-amber-600/20 rounded-lg overflow-hidden">
      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-[#0A0A0F]/80 border border-amber-600/30 rounded-lg hover:border-amber-500/50 transition-all backdrop-blur-sm"
          title="Zoom In"
        >
          <Plus className="w-5 h-5 text-amber-400" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-[#0A0A0F]/80 border border-amber-600/30 rounded-lg hover:border-amber-500/50 transition-all backdrop-blur-sm"
          title="Zoom Out"
        >
          <Minus className="w-5 h-5 text-amber-400" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-[#0A0A0F]/80 border border-amber-600/30 rounded-lg hover:border-amber-500/50 transition-all backdrop-blur-sm"
          title="Reset View"
        >
          <Maximize2 className="w-5 h-5 text-amber-400" />
        </button>
      </div>

      {/* Tree Visualization */}
      <svg
        ref={svgRef}
        className="w-full h-full cursor-move"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(192, 192, 216, 0.05) 1px, transparent 0),
            url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='oldpaper' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cfilter id='papernoise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23papernoise)' opacity='0.02' /%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23oldpaper)' /%3E%3C/svg%3E")
          `,
          backgroundSize: '40px 40px, 100px 100px'
        }}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Render connections */}
          <g className="connections">
            {connections.map((conn, idx) => (
              <motion.path
                key={idx}
                d={`M ${conn.x1} ${conn.y1} Q ${conn.x1} ${(conn.y1 + conn.y2) / 2}, ${conn.x2} ${conn.y2}`}
                stroke="rgba(217, 119, 6, 0.3)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, delay: idx * 0.05 }}
              />
            ))}
          </g>

          {/* Render nodes */}
          <g className="nodes">
            {positionedNodes.map((node, idx) => (
              <motion.g
                key={node.ancestor.id}
                transform={`translate(${node.x}, ${node.y})`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={() => onSelectAncestor(node.ancestor)}
                className="cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                {/* Decorative frame */}
                <rect
                  x="-70"
                  y="-45"
                  width="140"
                  height="90"
                  fill="url(#card-gradient)"
                  stroke="rgba(217, 119, 6, 0.4)"
                  strokeWidth="2"
                  rx="8"
                  filter="url(#vintage-shadow)"
                />

                {/* Photo or placeholder */}
                {node.ancestor.photoUrl ? (
                  <image
                    href={node.ancestor.photoUrl}
                    x="-25"
                    y="-30"
                    width="50"
                    height="50"
                    clipPath="circle(25px at 25px 25px)"
                    style={{ filter: 'sepia(0.3)' }}
                  />
                ) : (
                  <g>
                    <circle
                      cx="0"
                      cy="-5"
                      r="25"
                      fill="rgba(217, 119, 6, 0.2)"
                      stroke="rgba(217, 119, 6, 0.4)"
                      strokeWidth="2"
                    />
                    <User
                      x="-12"
                      y="-17"
                      width="24"
                      height="24"
                      className="text-amber-400 opacity-60"
                    />
                  </g>
                )}

                {/* Name */}
                <text
                  y="30"
                  textAnchor="middle"
                  className="fill-amber-200 text-xs font-semibold"
                  style={{ fontSize: '12px' }}
                >
                  {node.ancestor.name.length > 18
                    ? node.ancestor.name.substring(0, 16) + '...'
                    : node.ancestor.name}
                </text>

                {/* Generation badge */}
                <circle cx="55" cy="-35" r="12" fill="rgba(217, 119, 6, 0.8)" />
                <text
                  x="55"
                  y="-30"
                  textAnchor="middle"
                  className="fill-white text-xs font-bold"
                  style={{ fontSize: '10px' }}
                >
                  {node.ancestor.generation}
                </text>
              </motion.g>
            ))}
          </g>
        </g>

        {/* SVG Definitions */}
        <defs>
          {/* Gradient for cards */}
          <linearGradient id="card-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(26, 21, 32, 0.9)" />
            <stop offset="100%" stopColor="rgba(10, 10, 15, 0.8)" />
          </linearGradient>

          {/* Vintage shadow */}
          <filter id="vintage-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Decorative patterns */}
          <pattern id="vintage-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill="rgba(217, 119, 6, 0.1)" />
          </pattern>
        </defs>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-[#0A0A0F]/80 border border-amber-600/30 rounded-lg p-4 backdrop-blur-sm">
        <h4 className="text-amber-200 font-semibold mb-2 text-sm">Legend</h4>
        <div className="space-y-2 text-xs text-[#C0C0D8]/80">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-600" />
            <span>Generation Level</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-0.5 bg-amber-600/30" />
            <span>Family Connection</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">Click</span>
            <span>to view details</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400">Drag</span>
            <span>to pan around</span>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {ancestors.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 text-amber-400/30 mx-auto mb-4" />
            <p className="text-[#C0C0D8]/60 mb-4">No family tree data yet</p>
            <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all">
              Add Your First Ancestor
            </button>
          </div>
        </div>
      )}

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-[#0A0A0F]/80 border border-amber-600/30 rounded-lg px-3 py-2 backdrop-blur-sm">
        <span className="text-amber-200 text-sm font-semibold">{Math.round(zoom * 100)}%</span>
      </div>
    </div>
  );
}
