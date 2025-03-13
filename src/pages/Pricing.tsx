
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Check, X, Zap, Users, Sparkles, ChevronRight, 
  Shield, Download, Clock, Star, Infinity, BarChart
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FAQAccordion, { FAQItem } from '@/components/FAQAccordion';
import { motion } from 'framer-motion';

interface PricingFeature {
  included: boolean;
  text: string;
  highlight?: boolean;
  tooltip?: string;
}

interface PricingTierProps {
  name: string;
  price: string | { monthly: string; yearly: string };
  description: string;
  features: PricingFeature[];
  highlighted?: boolean;
  buttonText?: string;
  badge?: string;
  icon?: React.ReactNode;
  billingPeriod: 'monthly' | 'yearly';
  popularFeature?: string;
}

const PricingTier: React.FC<PricingTierProps> = ({
  name,
  price,
  description,
  features,
  highlighted = false,
  buttonText = 'Get Started',
  badge,
  icon,
  billingPeriod,
  popularFeature,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const displayPrice = typeof price === 'string' 
    ? price 
    : billingPeriod === 'monthly' ? price.monthly : price.yearly;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card 
        className={`p-6 flex flex-col h-full transition-all duration-300 ${
          highlighted 
            ? 'border-primary shadow-lg relative overflow-hidden bg-gradient-to-b from-white to-primary/5' 
            : 'border-border hover:border-primary/30'
        } ${isHovered ? 'shadow-xl transform -translate-y-1' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {highlighted && (
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        )}
        
        {badge && (
          <Badge className="w-fit mb-4" variant={highlighted ? "default" : "secondary"}>
            {badge}
          </Badge>
        )}
        
        <div className="flex items-center gap-2 mb-2">
          {icon && <div className={`${highlighted ? 'text-primary' : 'text-muted-foreground'}`}>{icon}</div>}
          <h3 className="text-xl font-bold">{name}</h3>
        </div>
        
        <div className="mt-2 mb-4">
          <span className="text-3xl font-bold">{displayPrice}</span>
          {displayPrice !== 'Free' && (
            <span className="text-muted-foreground ml-1">
              /{billingPeriod === 'yearly' ? 'year' : 'month'}
            </span>
          )}
          {billingPeriod === 'yearly' && displayPrice !== 'Free' && (
            <div className="text-sm text-green-600 font-medium mt-1">Save 20% with annual billing</div>
          )}
        </div>
        
        <p className="text-muted-foreground mb-6">{description}</p>
        
        {popularFeature && (
          <div className="bg-muted rounded-md p-2 mb-4 flex items-center">
            <Star className="h-4 w-4 text-amber-500 mr-2" />
            <span className="text-sm font-medium">{popularFeature}</span>
          </div>
        )}
        
        <ul className="space-y-3 mb-8 flex-grow">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              {feature.included ? (
                <Check className={`h-5 w-5 ${feature.highlight ? 'text-primary' : 'text-green-500'} mr-2 flex-shrink-0 mt-0.5`} />
              ) : (
                <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
              )}
              <span className={`${feature.included ? (feature.highlight ? 'font-medium' : '') : 'text-muted-foreground'}`}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
        
        <Button
          variant={highlighted ? 'default' : 'outline'}
          className={`w-full group ${highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}
          asChild
        >
          <Link to="/" className="flex items-center justify-center">
            {buttonText}
            <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </Card>
    </motion.div>
  );
};

const ComparisonFeature = ({ name, tiers }: { name: string; tiers: (string | boolean | React.ReactNode)[] }) => {
  return (
    <div className="grid grid-cols-4 py-4 border-b">
      <div className="font-medium">{name}</div>
      {tiers.map((value, i) => (
        <div key={i} className="text-center">
          {typeof value === 'boolean' ? (
            value ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />
          ) : (
            value
          )}
        </div>
      ))}
    </div>
  );
};

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [showComparison, setShowComparison] = useState(false);

  const faqItems: FAQItem[] = [
    {
      question: "Do I need my own OpenAI API key?",
      answer: "Yes, all plans require you to use your own OpenAI API key. This gives you full control over your API usage and costs. We recommend using GPT-4o-mini for the best balance of performance and cost.",
      category: "Getting Started"
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time. If you upgrade, you'll be charged the prorated amount for the remainder of your billing cycle. If you downgrade, the changes will take effect at the start of your next billing cycle.",
      category: "Billing"
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Yes, both Pro and Team plans come with a 14-day free trial, no credit card required. You'll get full access to all features during the trial period.",
      category: "Getting Started"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and some regional payment methods. For Team plans, we also offer invoice payment options.",
      category: "Billing"
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your paid features until the end of your current billing period.",
      category: "Billing"
    },
    {
      question: "Do you offer educational or non-profit discounts?",
      answer: "Yes, we offer special pricing for educational institutions, non-profit organizations, and open source projects. Please contact our sales team for more information.",
      category: "Billing"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-semibold text-gray-900 flex items-center">
              <Sparkles className="h-5 w-5 text-primary mr-2" />
              AI Mermaid Diagram Generator
            </Link>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link to="/pricing" className="text-primary font-medium">
                Pricing
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <motion.div 
          className="text-center mb-12"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for you and start creating beautiful diagrams with AI assistance.
          </p>
          
          <div className="mt-8 inline-flex bg-gray-100 p-1 rounded-lg">
            <Tabs 
              defaultValue="monthly" 
              value={billingPeriod}
              onValueChange={(value) => setBillingPeriod(value as 'monthly' | 'yearly')}
              className="w-full max-w-md mx-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="yearly">
                  Yearly <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">Save 20%</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingTier
            name="Free"
            price="Free"
            description="Perfect for occasional diagram creation and exploration."
            icon={<Zap size={20} />}
            features={[
              { included: true, text: "5 AI-generated diagrams per day" },
              { included: true, text: "Basic diagram types" },
              { included: true, text: "Manual code editing" },
              { included: true, text: "Community support" },
              { included: false, text: "Advanced diagram customization" },
              { included: false, text: "Export to multiple formats" },
              { included: false, text: "Priority support" },
            ]}
            buttonText="Get Started Free"
            billingPeriod={billingPeriod}
            popularFeature="Perfect for beginners and occasional users"
          />

          <PricingTier
            name="Pro"
            price={{ 
              monthly: '$12', 
              yearly: '$115'
            }}
            description="For professionals who need more power and flexibility."
            icon={<Sparkles size={20} />}
            features={[
              { included: true, text: "Unlimited AI-generated diagrams", highlight: true },
              { included: true, text: "All diagram types" },
              { included: true, text: "Advanced customization options" },
              { included: true, text: "Export to PNG, SVG, PDF" },
              { included: true, text: "Email support" },
              { included: true, text: "Custom themes" },
              { included: false, text: "Team collaboration" },
            ]}
            highlighted={true}
            badge="Most Popular"
            billingPeriod={billingPeriod}
            popularFeature="Unlimited diagrams with advanced customization"
          />

          <PricingTier
            name="Team"
            price={{ 
              monthly: '$29', 
              yearly: '$278'
            }}
            description="For teams that need to collaborate on diagrams."
            icon={<Users size={20} />}
            features={[
              { included: true, text: "Everything in Pro" },
              { included: true, text: "Team collaboration", highlight: true },
              { included: true, text: "Shared diagram library" },
              { included: true, text: "Version history" },
              { included: true, text: "Priority support" },
              { included: true, text: "Custom branding options" },
              { included: true, text: "Admin dashboard" },
            ]}
            buttonText="Start Team Trial"
            billingPeriod={billingPeriod}
            popularFeature="Ideal for teams of 3+ members"
          />
        </div>

        <div className="text-center mt-8">
          <Button 
            variant="ghost" 
            onClick={() => setShowComparison(!showComparison)}
            className="text-primary"
          >
            {showComparison ? "Hide detailed comparison" : "Show detailed comparison"}
            <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${showComparison ? 'rotate-90' : ''}`} />
          </Button>
        </div>

        {showComparison && (
          <motion.div 
            className="mt-8 overflow-x-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="min-w-[800px] bg-white rounded-lg border shadow-sm p-6">
              <h2 className="text-xl font-bold mb-6">Feature Comparison</h2>
              
              <div className="grid grid-cols-4 pb-4 border-b">
                <div className="font-bold">Features</div>
                <div className="text-center font-bold">Free</div>
                <div className="text-center font-bold">Pro</div>
                <div className="text-center font-bold">Team</div>
              </div>
              
              <ComparisonFeature 
                name="AI-generated diagrams" 
                tiers={["5/day", <Infinity className="h-5 w-5 text-primary mx-auto" />, <Infinity className="h-5 w-5 text-primary mx-auto" />]} 
              />
              <ComparisonFeature name="Basic diagram types" tiers={[true, true, true]} />
              <ComparisonFeature name="Advanced diagram types" tiers={[false, true, true]} />
              <ComparisonFeature name="Manual code editing" tiers={[true, true, true]} />
              <ComparisonFeature name="Advanced customization" tiers={[false, true, true]} />
              <ComparisonFeature name="Export options" tiers={["PNG only", "PNG, SVG, PDF", "PNG, SVG, PDF, DOCX"]} />
              <ComparisonFeature name="Team collaboration" tiers={[false, false, true]} />
              <ComparisonFeature name="Shared diagram library" tiers={[false, false, true]} />
              <ComparisonFeature name="Version history" tiers={[false, false, true]} />
              <ComparisonFeature name="Custom themes" tiers={[false, true, true]} />
              <ComparisonFeature name="Custom branding" tiers={[false, false, true]} />
              <ComparisonFeature name="Support level" tiers={["Community", "Email", "Priority"]} />
              <ComparisonFeature name="Admin dashboard" tiers={[false, false, true]} />
            </div>
          </motion.div>
        )}

        <div className="mt-16 max-w-3xl mx-auto">
          <FAQAccordion 
            items={faqItems} 
            allowMultiple={true}
            iconType="plusMinus"
          />
        </div>

        <motion.div 
          className="mt-16 max-w-4xl mx-auto bg-primary text-white rounded-xl p-10 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of professionals who create beautiful diagrams with AI assistance.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="group">
              <Link to="/" className="flex items-center">
                Try for Free
                <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10 group" asChild>
              <Link to="/" className="flex items-center">
                Contact Sales
                <ChevronRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </main>

      <footer className="mt-16 bg-gray-100 border-t py-12">
        <div className="container mx-auto px-4 md:flex justify-between items-center">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="mb-2 flex items-center justify-center md:justify-start">
              <Sparkles className="h-4 w-4 text-primary mr-2" />
              <span className="font-medium">AI Mermaid Diagram Generator</span>
            </p>
            <p className="text-sm text-gray-500">© 2023 All rights reserved.</p>
          </div>
          
          <div className="flex justify-center md:justify-end space-x-8">
            <div>
              <h4 className="font-medium mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
