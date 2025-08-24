import React from "react";
import { Handle, Position } from "@xyflow/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AgentNodeProps {
  data: {
    label: string;
    status: "pending" | "running" | "success" | "error";
    description: string | string[]; // Updated to accept both string and array
    logs: string[];
    onSelect: (agentId: string) => void;
  };
  id: string;
}

export const AgentNode: React.FC<AgentNodeProps> = ({ data, id }) => {
  const getStatusColor = () => {
    switch (data.status) {
      case "pending":
        return "bg-agent-pending";
      case "running":
        return "bg-agent-running animate-pulse-glow";
      case "success":
        return "bg-agent-success";
      case "error":
        return "bg-agent-error";
      default:
        return "bg-agent-pending";
    }
  };

  const getStatusBorder = () => {
    switch (data.status) {
      case "running":
        return "border-agent-running glow-accent animate-neon-pulse";
      case "success":
        return "border-agent-success glow-success";
      case "error":
        return "border-agent-error glow-primary";
      default:
        return "border-node-border";
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => data.onSelect(id)}
      className={cn(
        "relative px-4 py-3 rounded-xl border-2 bg-card cursor-pointer",
        "transition-all duration-300 min-w-[120px]",
        getStatusBorder()
      )}
    >
      {/* Status indicator */}
      <div className={cn("absolute -top-2 -right-2 w-4 h-4 rounded-full", getStatusColor())} />
      
      {/* Agent icon/avatar */}
      <div className="flex items-center justify-center mb-2">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
          "gradient-neon text-foreground glow-primary"
        )}>
          {data.label.charAt(0)}
        </div>
      </div>

      {/* Agent name */}
      <div className="text-center">
        <h3 className="font-semibold text-sm text-foreground">{data.label}</h3>
        
        {/* Updated description rendering */}
        <div className="text-xs text-muted-foreground mt-1">
          {Array.isArray(data.description) ? (
            data.description.map((point, index) => (
              <div key={index} className="line-clamp-1">
                {point}
              </div>
            ))
          ) : (
            <p className="line-clamp-2">{data.description}</p>
          )}
        </div>
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-node-border border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-node-border border-2 border-background"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-node-border border-2 border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-node-border border-2 border-background"
      />
    </motion.div>
  );
};
