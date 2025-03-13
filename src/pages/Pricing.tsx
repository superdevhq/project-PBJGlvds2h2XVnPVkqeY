
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PricingTier = ({
  name,
  price,
  description,
  features,
  highlighted = false,
  buttonText = 'Get Started',
  badge,
}: {
  name: string;
  price: string;
  description: string;
  features: { included: boolean; text: string }[];
  highlighted?: boolean;
  buttonText?: string;
  badge?: string;
}) => {
  return (
    <Card className={`p-6 flex flex-col h-full ${highlighted ? 'border-primary shadow-lg' : 'border-border'}`}>
      {badge && (
        <Badge className="w-fit mb-4" variant="secondary">
          {badge}
        </Badge>
      )}
      <h3 className="text-xl font-bold">{name}</h3>
      <div className="mt-2 mb-4">
        <span className="text-3xl font-bold">{price}</span>
        {price !== 'Free' && <span className="text-muted-foreground ml-1">/month</span>}
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            {feature.included ? (
              <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
            ) : (
              <X className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0 mt-0.5" />
            )}
            <span className={feature.included ? '' : 'text-muted-foreground'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      <Button
        variant={highlighted ? 'default' : 'outline'}
        className="w-full"
        asChild
      >
        <Link to="/">{buttonText}</Link>
      </Button>
    </Card>
  );
};

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl font-semibold text-gray-900">
              AI Mermaid Diagram Generator
            </Link>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-600 hover:text-gray-900">
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the plan that's right for you and start creating beautiful diagrams with AI assistance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <PricingTier
            name="Free"
            price="Free"
            description="Perfect for occasional diagram creation and exploration."
            features={[
              { included: true, text: "5 AI-generated diagrams per day" },
              { included: true, text: "Basic diagram types" },
              { included: true, text: "Manual code editing" },
              { included: false, text: "Advanced diagram customization" },
              { included: false, text: "Export to multiple formats" },
              { included: false, text: "Priority support" },
            ]}
            buttonText="Get Started Free"
          />

          <PricingTier
            name="Pro"
            price="$12"
            description="For professionals who need more power and flexibility."
            features={[
              { included: true, text: "Unlimited AI-generated diagrams" },
              { included: true, text: "All diagram types" },
              { included: true, text: "Advanced customization options" },
              { included: true, text: "Export to PNG, SVG, PDF" },
              { included: true, text: "Email support" },
              { included: false, text: "Team collaboration" },
            ]}
            highlighted={true}
            badge="Most Popular"
          />

          <PricingTier
            name="Team"
            price="$29"
            description="For teams that need to collaborate on diagrams."
            features={[
              { included: true, text: "Everything in Pro" },
              { included: true, text: "Team collaboration" },
              { included: true, text: "Shared diagram library" },
              { included: true, text: "Version history" },
              { included: true, text: "Priority support" },
              { included: true, text: "Custom branding options" },
            ]}
            buttonText="Start Team Trial"
          />
        </div>

        <div className="mt-16 bg-white p-8 rounded-lg border max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Do I need my own OpenAI API key?</h3>
              <p className="text-gray-600">
                Yes, all plans require you to use your own OpenAI API key. This gives you full control over your API usage and costs.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Can I upgrade or downgrade my plan?</h3>
              <p className="text-gray-600">
                Yes, you can change your plan at any time. If you upgrade, you'll be charged the prorated amount for the remainder of your billing cycle.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Is there a free trial for paid plans?</h3>
              <p className="text-gray-600">
                Yes, both Pro and Team plans come with a 14-day free trial, no credit card required.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and some regional payment methods.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 bg-gray-100 border-t py-12">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p className="mb-4">© 2023 AI Mermaid Diagram Generator. All rights reserved.</p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
