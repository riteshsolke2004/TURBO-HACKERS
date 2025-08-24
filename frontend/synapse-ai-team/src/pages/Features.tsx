import React from "react";
import { motion } from "framer-motion";
import { 
  Brain, 
  Zap, 
  Shield, 
  Network, 
  BarChart3, 
  Clock, 
  Workflow, 
  Users,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Globe
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Features: React.FC = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: "Intelligent Agent Coordination",
      description: "AI-powered agents work seamlessly together to solve complex business problems with unprecedented efficiency.",
      features: ["Auto task delegation", "Smart decision making", "Learning algorithms"],
      color: "from-primary to-accent"
    },
    {
      icon: Workflow,
      title: "Visual Workflow Designer",
      description: "Design and monitor multi-agent workflows with our intuitive drag-and-drop interface.",
      features: ["Real-time visualization", "Custom node creation", "Flow debugging"],
      color: "from-accent to-primary"
    },
    {
      icon: Network,
      title: "Scalable Architecture",
      description: "Built to scale from small teams to enterprise-level deployments with robust infrastructure.",
      features: ["Cloud-native design", "Auto-scaling", "Load balancing"],
      color: "from-primary to-secondary"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Get deep insights into agent performance, workflow efficiency, and business outcomes.",
      features: ["Performance metrics", "Cost optimization", "Predictive analytics"],
      color: "from-secondary to-accent"
    }
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade security with end-to-end encryption and compliance standards."
    },
    {
      icon: Clock,
      title: "Real-time Monitoring",
      description: "Monitor agent activities and system performance in real-time."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Enable seamless collaboration between human teams and AI agents."
    },
    {
      icon: Globe,
      title: "Multi-Platform Support",
      description: "Deploy across cloud, on-premise, or hybrid environments."
    },
    {
      icon: TrendingUp,
      title: "Performance Optimization",
      description: "AI-driven optimization for maximum efficiency and cost reduction."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process thousands of tasks simultaneously with minimal latency."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-background to-surface/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-bl bg-clip-text text- mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your business operations with cutting-edge AI agent collaboration technology. 
            Built for the future of work.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20"
        >
          {mainFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-8 bg-card/50 backdrop-blur-lg border-node-border hover:border-primary/50 transition-all duration-500 group neon-glow h-full">
                  <div className="flex items-start space-x-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} glow-primary`}>
                      <IconComponent className="h-8 w-8 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <ul className="space-y-2">
                        {feature.features.map((item, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="mt-4 inline-flex items-center text-primary hover:text-accent transition-colors cursor-pointer"
                      >
                        <span className="text-sm font-medium">Learn More</span>
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {additionalFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-6 bg-card/30 backdrop-blur-sm border-node-border hover:border-primary/30 transition-all duration-300 group h-full">
                  <div className="text-center">
                    <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition-all">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Card className="p-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 backdrop-blur-lg">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Workflow?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of companies already using Synapse AI to revolutionize their operations 
              with intelligent agent collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="glow-primary px-8 py-3">
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button variant="outline" className="border-node-border hover:border-primary px-8 py-3">
                Schedule Demo
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
