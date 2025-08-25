import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Network, Zap, Target, Users, Code } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "Intelligent Agents",
      description: "Six specialized AI agents working in perfect harmony"
    },
    {
      icon: Network,
      title: "Graph Visualization",
      description: "Real-time visual representation of agent collaboration"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live logs and status updates via WebSocket connections"
    },
    {
      icon: Target,
      title: "Goal-Oriented",
      description: "Agents collaborate to achieve complex user-defined goals"
    }
  ];

  const techStack = [
    "React", "TypeScript", "React Flow", "Framer Motion", 
    "Tailwind CSS", "WebSocket", "Vite", "Lucide Icons"
  ];

  const agents = [
    { name: "Coordinator Agent", role: "Strategic planning and task breakdown", color: "bg-primary" },
    { name: "Demand Forcast Agent", role: "Analyze market trendz", color: "bg-accent" },
    { name: "Price Optimization Agent ", role: "Optimize Pricing strategy or Market competitive analysis", color: "bg-agent-success" },
    { name: "Inventory Monitoring Agent", role: "Track Live stock Levels", color: "bg-agent-running" },
    { name: "Final Result Agent", role: "Generate comprehensive report", color: "bg-agent-error" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-6 space-y-8"
      >
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-bl bg-clip-text text-balance">
            About Multi-Agent AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Multi-Agent Collaboration for Complex Tasks - A revolutionary approach to AI problem-solving
          </p>
        </motion.div>

        {/* Project Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 border-node-border">
            <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
              <Users className="h-6 w-6" />
              Project Overview
            </h2>
            <p className="text-muted-foreground leading-relaxed">
            Multi-Agent AI demonstrates how multiple specialized AI agents can collaborate to solve complex tasks,
              much like a human team. Each agent has a specific role and expertise, and they work together through a 
              sophisticated communication network to achieve user-defined goals. This hackathon project showcases the 
              future of AI collaboration and distributed problem-solving.
            </p>
          </Card>
        </motion.div>

        {/* Agent Roles */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8 border-node-border">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Agent Roles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent, index) => (
                <motion.div
                  key={agent.name}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-4 rounded-lg border border-node-border bg-card"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${agent.color}`} />
                    <h3 className="font-semibold">{agent.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{agent.role}</p>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-8 border-node-border">
            <h2 className="text-2xl font-semibold mb-6 text-primary">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start gap-4"
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Tech Stack */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-8 border-node-border">
            <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center gap-2">
              <Code className="h-6 w-6" />
              Technology Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Badge variant="secondary" className="text-sm">
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;