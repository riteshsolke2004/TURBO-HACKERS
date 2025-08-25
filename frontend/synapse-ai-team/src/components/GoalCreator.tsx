import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target, Sparkles, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface GoalCreatorProps {
  onGoalSubmit: (goal: string, analysisResult?: any) => void;
}

interface AnalysisResult {
  status: string;
  product_id: number;
  demand_forecast: string;
  optimized_price: number;
  inventory: {
    avg_daily_demand: number;
    safety_stock: number;
    reorder_point: number;
    current_stock: number;
    action: string;
    suggested_reorder_qty: number;
  };
  message: string;
}

export const GoalCreator: React.FC<GoalCreatorProps> = ({ onGoalSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [productId, setProductId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in both title and description");
      return;
    }

    if (!productId.trim() || isNaN(Number(productId))) {
      toast.error("Please enter a valid product ID");
      return;
    }

    setIsSubmitting(true);

    try {
      // Make API call to backend
      const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_id: parseInt(productId)
        }),
      });

      const result: AnalysisResult = await response.json();

      if (result.status === "success") {
        const goalText = `${title}: ${description} (Product ID: ${productId})`;
        setCurrentGoal(goalText);
        setAnalysisResult(result);
        onGoalSubmit(goalText, result);
        toast.success("Analysis completed successfully!");
      } else {
        toast.error(`Analysis failed: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to connect to analysis service. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewGoal = () => {
    setCurrentGoal(null);
    setAnalysisResult(null);
    setTitle("");
    setDescription("");
    setProductId("");
    onGoalSubmit("");
  };

  const exampleGoals = [
    "Analyze market trends for Q4 strategy",
    "Create comprehensive user research report",
    "Develop product roadmap for next quarter"
  ];

  if (currentGoal && analysisResult) {
    return (
      <Card className="p-6 border-node-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-agent-success/20">
                <CheckCircle className="h-5 w-5 text-agent-success" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">Analysis Complete</h3>
                <p className="text-sm text-muted-foreground">{currentGoal}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleNewGoal}>
              New Analysis
            </Button>
          </div>

          {/* Analysis Results Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-white/50 rounded-lg border">
              <h4 className="font-medium text-sm text-gray-600 mb-2">Product Analysis</h4>
              <div className="space-y-1">
                <p className="text-sm"><span className="font-medium">Product ID:</span> {analysisResult.product_id}</p>
                <p className="text-sm"><span className="font-medium">Demand Forecast:</span> 
                  <Badge variant={analysisResult.demand_forecast === "increasing" ? "default" : "secondary"} className="ml-2">
                    {analysisResult.demand_forecast}
                  </Badge>
                </p>
                <p className="text-sm"><span className="font-medium">Optimized Price:</span> ${analysisResult.optimized_price}</p>
              </div>
            </div>

            <div className="p-4 bg-white/50 rounded-lg border">
              <h4 className="font-medium text-sm text-gray-600 mb-2">Inventory Status</h4>
              <div className="space-y-1">
                <p className="text-sm"><span className="font-medium">Current Stock:</span> {analysisResult.inventory.current_stock}</p>
                <p className="text-sm"><span className="font-medium">Action Required:</span> 
                  <Badge variant={analysisResult.inventory.action === "Reorder" ? "destructive" : "outline"} className="ml-2">
                    {analysisResult.inventory.action}
                  </Badge>
                </p>
                {analysisResult.inventory.action === "Reorder" && (
                  <p className="text-sm"><span className="font-medium">Reorder Qty:</span> {analysisResult.inventory.suggested_reorder_qty} units</p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">{analysisResult.message}</p>
          </div>
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
          <h2 className="text-xl font-semibold text-primary">Product Analysis</h2>
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

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Product ID
            </label>
            <Input
              type="number"
              placeholder="Enter product ID (e.g., 1985)"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="border-node-border"
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
                Analyzing Product...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Start Analysis
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
