import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target, Sparkles, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface GoalCreatorProps {
  onGoalSubmit: (goal: string) => void;
}

export const GoalCreator: React.FC<GoalCreatorProps> = ({ onGoalSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in both title and description");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const goalText = `${title}: ${description}`;
    setCurrentGoal(goalText);
    onGoalSubmit(goalText);
    
    toast.success("Goal submitted! Agents are now collaborating...");
    setIsSubmitting(false);
  };

  const handleNewGoal = () => {
    setCurrentGoal(null);
    setTitle("");
    setDescription("");
    onGoalSubmit("");
  };

  const exampleGoals = [
    "Analyze market trends for Q4 strategy",
    "Create comprehensive user research report", 
    "Develop product roadmap for next quarter"
  ];

  if (currentGoal) {
    return (
      <Card className="p-6 border-node-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-agent-success/20">
              <CheckCircle className="h-5 w-5 text-agent-success" />
            </div>
            <div>
              <h3 className="font-semibold text-primary">Active Goal</h3>
              <p className="text-sm text-muted-foreground">{currentGoal}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleNewGoal}>
            New Goal
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border-node-border">
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="space-y-6"
      >
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold text-primary">Create New Goal</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Goal Title
            </label>
            <Input
              placeholder="Enter a concise goal title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border-node-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Description
            </label>
            <Textarea
              placeholder="Describe what you want the AI agents to accomplish..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-node-border min-h-[100px]"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full glow-primary"
          >
            {isSubmitting ? (
              <>
                <Clock className="h-4 w-4 mr-2 animate-spin" />
                Initializing Agents...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Start Collaboration
              </>
            )}
          </Button>
        </form>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Quick Examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleGoals.map((example, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setTitle(example);
                  setDescription(`Complete ${example.toLowerCase()} with comprehensive analysis and actionable insights.`);
                }}
              >
                {example}
              </Badge>
            ))}
          </div>
        </div>
      </motion.div>
    </Card>
  );
};