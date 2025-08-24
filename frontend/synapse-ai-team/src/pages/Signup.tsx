import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, Mail, Lock, User, UserPlus } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export default function Signup() {
  const [role, setRole] = useState<"user" | "admin">("user");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return alert("Passwords don't match!");
    if (!agreedToTerms) return alert("Please agree to terms");

    try {
      const res = await axios.post("http://localhost:8000/auth/signup", { ...formData, role }, { withCredentials: true });
      console.log("Signup success:", res.data);
      alert("Account created successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.detail || "Signup failed");
    }
  };

  const handleGoogleSignup = () => window.location.href = `http://localhost:8000/auth/google?role=${role}`;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              <Brain className="h-12 w-12 text-primary" />
            </motion.div>
            <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
              Join Synapse AI
            </h1>
            <p className="text-muted-foreground mt-2">
              Create your account and start collaborating
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Account Type</Label>
              <RadioGroup
                value={role}
                onValueChange={(value) => setRole(value as "user" | "admin")}
                className="flex space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="user" id="signup-user" />
                  <Label htmlFor="signup-user" className="text-sm">User</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="signup-admin" />
                  <Label htmlFor="signup-admin" className="text-sm">Admin</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Google Signup Button */}
            <Button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full bg-white text-gray-900 hover:bg-gray-100 border border-gray-300"
            >
              <FaGoogle className="h-5 w-5 mr-3" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-node-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-surface px-2 text-muted-foreground">
                  Or create account with email
                </span>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-foreground">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="pl-10 bg-input border-node-border focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-foreground">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="pl-10 bg-input border-node-border focus:border-primary"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="pl-10 bg-input border-node-border focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 bg-input border-node-border focus:border-primary"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 bg-input border-node-border focus:border-primary"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:text-primary/80">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:text-primary/80">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            {/* Signup Button */}
            <Button
              type="submit"
              className="w-full glow-primary"
              disabled={!agreedToTerms}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
            </Button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}