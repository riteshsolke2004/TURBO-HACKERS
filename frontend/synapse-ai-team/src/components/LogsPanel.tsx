import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface LogEntry {
  id: number;
  timestamp: string;
  agent: string;
  message: string;
  level: "info" | "warning" | "error" | "success";
}

interface LogsPanelProps {
  logs: LogEntry[];
}

export const LogsPanel: React.FC<LogsPanelProps> = ({ logs }) => {
  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-agent-success" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getLogBadgeVariant = (level: string) => {
    switch (level) {
      case "error":
        return "destructive";
      case "warning":
        return "secondary";
      case "success":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <Card className="h-[500px] border-node-border">
      <div className="p-4 border-b border-node-border">
        <h3 className="text-lg font-semibold text-primary">Live Logs</h3>
        <p className="text-sm text-muted-foreground">Real-time agent activity</p>
      </div>
      
      <ScrollArea className="h-[calc(500px-80px)]">
        <div className="p-4 space-y-3">
          <AnimatePresence>
            {logs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground py-8"
              >
                <Info className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No logs yet. Create a goal to start monitoring agent activity.</p>
              </motion.div>
            ) : (
              logs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-lg border border-node-border bg-card/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getLogIcon(log.level)}
                      <Badge variant={getLogBadgeVariant(log.level) as any}>
                        {log.agent}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{log.message}</p>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </Card>
  );
};