import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AgentFlow } from "@/components/AgentFlow";
import { LogsPanel } from "@/components/LogsPanel";
import { ArtifactsPanel } from "@/components/ArtifactsPanel";
import { GoalCreator } from "@/components/GoalCreator";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const [currentGoal, setCurrentGoal] = useState<string>("");
  const [logs, setLogs] = useState<any[]>([]);
  const [artifacts, setArtifacts] = useState<any[]>([]);

  // Mock real-time logs
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentGoal) {
        const mockLog = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          agent: ["Planner", "Data", "Analysis", "Report", "Critic", "Arbiter"][Math.floor(Math.random() * 6)],
          message: `Processing task: ${currentGoal.slice(0, 30)}...`,
          level: Math.random() > 0.8 ? "error" : Math.random() > 0.6 ? "warning" : "info"
        };
        setLogs(prev => [mockLog, ...prev.slice(0, 49)]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentGoal]);

  return (
    <div className="min-h-screen bg-background pt-20">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-6 space-y-6"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold text-rainbow animate-rainbow">
            AI Agent Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor multi-agent collaboration in real-time
          </p>
        </motion.div>

        {/* Goal Creator */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <GoalCreator onGoalSubmit={setCurrentGoal} />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Agent Flow Visualization */}
          <div className="lg:col-span-2">
            <Card className="p-6 h-[600px] border-node-border">
              <h2 className="text-xl font-semibold mb-4 text-neon">Agent Network</h2>
              <AgentFlow currentGoal={currentGoal} />
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <Tabs defaultValue="logs" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="logs">Live Logs</TabsTrigger>
                <TabsTrigger value="artifacts">Artifacts</TabsTrigger>
              </TabsList>
              
              <TabsContent value="logs" className="mt-4">
                <LogsPanel logs={logs} />
              </TabsContent>
              
              <TabsContent value="artifacts" className="mt-4">
                <ArtifactsPanel artifacts={artifacts} />
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;