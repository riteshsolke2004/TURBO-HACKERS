import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  addEdge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AgentNode } from "./AgentNode";
import { motion } from "framer-motion";

const nodeTypes = {
  agent: AgentNode,
};

interface AgentFlowProps {
  currentGoal: string;
}

export const AgentFlow: React.FC<AgentFlowProps> = ({ currentGoal }) => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const initialNodes: Node[] = [
    {
      id: "coordinator",
      type: "agent",
      position: { x: 400, y: 50 },
      data: { 
        label: "Coordinator Agent", 
        status: "pending", 
        description: ["• Receives input params", "• Orchestrates Workflow"],
        logs: [],
        onSelect: setSelectedAgent
      },
    },
    {
      id: "demand",
      type: "agent", 
      position: { x: 100, y: 200 },
      data: { 
        label: "Demand Forecast agent", 
        status: "pending",
        description: ["• Analyzes market trends", "• Predicts future demand"],
        logs: [],
        onSelect: setSelectedAgent
      },
    },
    {
      id: "inventory",
      type: "agent",
      position: { x: 400, y: 200 },
      data: { 
        label: "Inventory Monitoring agent", 
        status: "pending",
        description: ["• Track Live stock Levels", "• Flags low stock & discrepancies"],
        logs: [],
        onSelect: setSelectedAgent
      },
    },
    {
      id: "pricing",
      type: "agent",
      position: { x: 700, y: 200 },
      data: { 
        label: "Pricing Optimization agent", 
        status: "pending",
        description: ["• Optimizes pricing strategy", "• Market competitive analysis"],
        logs: [],
        onSelect: setSelectedAgent
      },
    },
    {
      id: "final",
      type: "agent",
      position: { x: 250, y: 400 },
      data: { 
        label: "Final Results Agent", 
        status: "pending",
        description: ["• Compiles final analysis", "• Generates comprehensive report"],
        logs: [],
        onSelect: setSelectedAgent
      },
    },
    {
      id: "downstream",
      type: "agent",
      position: { x: 550, y: 400 },
      data: { 
        label: "Downstream Systems agent", 
        status: "pending",
        description: ["• Integrates with external systems", "• Publishes results"],
        logs: [],
        onSelect: setSelectedAgent
      },
    },
  ];

  const initialEdges: Edge[] = [
    // Coordinator to all three middle agents
    { id: "e1", source: "coordinator", target: "demand", animated: false },
    { id: "e2", source: "coordinator", target: "inventory", animated: false },
    { id: "e3", source: "coordinator", target: "pricing", animated: false },
    
    // All three middle agents to both final agents
    { id: "e4", source: "demand", target: "final", animated: false },
    { id: "e5", source: "inventory", target: "final", animated: false },
    { id: "e6", source: "pricing", target: "final", animated: false },
    
    { id: "e7", source: "demand", target: "downstream", animated: false },
    { id: "e8", source: "inventory", target: "downstream", animated: false },
    { id: "e9", source: "pricing", target: "downstream", animated: false },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Simulate agent activity when goal is set
  useEffect(() => {
    if (currentGoal) {
      // Updated sequence to match the new flow
      const sequence = ["coordinator", "demand", "inventory", "pricing", "final", "downstream"];
      
      sequence.forEach((agentId, index) => {
        setTimeout(() => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === agentId
                ? { 
                    ...node, 
                    data: { 
                      ...node.data, 
                      status: "running" 
                    } 
                  }
                : node
            )
          );

          // Set edges as active
          setEdges((eds) =>
            eds.map((edge) =>
              edge.source === agentId || edge.target === agentId
                ? { ...edge, animated: true, style: { stroke: "hsl(var(--edge-active))" } }
                : edge
            )
          );

          // Complete after some time
          setTimeout(() => {
            setNodes((nds) =>
              nds.map((node) =>
                node.id === agentId
                  ? { 
                      ...node, 
                      data: { 
                        ...node.data, 
                        status: "success" 
                      } 
                    }
                  : node
              )
            );
          }, 2000);
        }, index * 3000);
      });
    }
  }, [currentGoal, setNodes, setEdges]);

  return (
    <div className="h-full w-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        style={{ background: "transparent" }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
      >
        <Controls className="bg-card border border-node-border" />
        <Background color="hsl(var(--muted-foreground))" gap={20} />
      </ReactFlow>

      {/* Agent Details Sidebar */}
      {selectedAgent && (
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          className="absolute right-0 top-0 bottom-0 w-80 bg-card border-l border-node-border p-4 overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-primary">{selectedAgent}</h3>
            <button
              onClick={() => setSelectedAgent(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Agent details and logs would appear here...
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
