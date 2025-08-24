import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Link } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Replace with your backend forgot-password API endpoint
    try {
      // Example API call using fetch or axios:
      // await axios.post('http://localhost:8000/auth/forgot-password', { email });

      // Simulate async success response
      setSubmitted(true);
    } catch (error) {
      alert("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 rainbow-gradient">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-surface/90 backdrop-blur-lg border-node-border neon-glow">
          <div className="text-center mb-8">
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="flex justify-center mb-4"
            >
              <Mail className="h-12 w-12 text-primary" />
            </motion.div>
          <Link
  to="/forgetpass"
  className="text-sm text-primary hover:text-primary/80 transition-colors"
>
  Forgot your password?
</Link>
            <p className="text-muted-foreground mt-2">
              Enter your email to receive password reset instructions
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-input border-node-border focus:border-primary"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full glow-primary">
                Send Reset Email
              </Button>
            </form>
          ) : (
            <p className="text-center text-green-500 font-semibold">
              Instructions sent! Please check your email.
            </p>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
