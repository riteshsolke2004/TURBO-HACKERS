import React from "react";
import { motion } from "framer-motion";
import { Brain, Github, Twitter, Mail, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface/90 backdrop-blur-lg border-t border-node-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-3 mb-4"
            >
              <div className="p-2 rounded-xl bg-gradient-to-r from-primary to-accent">
                <Brain className="h-8 w-8 text-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-bl bg-clip-text text-balance">
                  Synapse AI
                </h3>
                <p className="text-sm text-muted-foreground">
                  Multi-Agent Collaboration Platform
                </p>
              </div>
            </motion.div>
            <p className="text-muted-foreground max-w-md leading-relaxed">
              Empowering businesses with intelligent agent coordination and workflow automation. 
              Transform your operations with AI-driven collaboration.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Mail, href: "#", label: "Email" },
                { icon: Globe, href: "#", label: "Website" }
              ].map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-input border border-node-border hover:border-primary transition-colors glow-primary hover:glow-accent"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {[
                { name: "Features", href: "/features" },
                { name: "Agents", href: "/agents" },
                { name: "Workflows", href: "/workflows" },
                { name: "Integrations", href: "/integrations" }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {[
                { name: "Documentation", href: "/docs" },
                { name: "API Reference", href: "/api" },
                { name: "Help Center", href: "/help" },
                { name: "Contact Us", href: "/contact" }
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors hover:underline"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-node-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Multi-Agent AI. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Version/Status indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-muted-foreground">
              v1.0.0 • All systems operational
            </span>
          </div>
        </div>
      </div>

      {/* Gradient overlay for aesthetic effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface/20 to-transparent pointer-events-none" />
    </footer>
  );
};

export default Footer;
