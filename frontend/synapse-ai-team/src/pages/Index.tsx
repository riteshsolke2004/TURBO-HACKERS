import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Network, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-hidden pt-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-screen flex items-center justify-center"
      >
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-7xl font-bold">
              <span className="text-rainbow animate-rainbow">
                Multi-Agent AI
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Multi-Agent Collaboration for Complex Tasks
            </h2>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch intelligent AI agents work together like a human team, 
              solving complex problems through coordinated collaboration
            </p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link to="/dashboard">
                <Button size="lg" className="animate-neon-pulse group gradient-neon border-0">
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              {
                icon: Brain,
                title: "6 Specialized Agents",
                description: "Planner, Data, Analysis, Report, Critic, Arbiter"
              },
              {
                icon: Network,
                title: "Real-time Visualization",
                description: "Watch agents collaborate in an interactive graph"
              },
              {
                icon: Zap,
                title: "Live Monitoring",
                description: "Stream logs and artifacts as they're generated"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 * index + 0.8 }}
                className="p-6 rounded-xl border border-node-border bg-card/50 backdrop-blur-sm"
              >
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: 0
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              className="absolute w-2 h-2 bg-primary rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
