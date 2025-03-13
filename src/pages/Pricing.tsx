
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Check, X, Zap, Users, Building2, CreditCard, 
  Calendar, ArrowRight, ChevronDown, ChevronUp, 
  BarChart, Shield, Clock, Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const PricingTier = ({
  name,
  price,
  monthlyPrice,
  yearlyPrice,
  description,
  features,
  highlighted = false,
  buttonText = 'Get Started',
  badge,
  icon,
}: {
  name: string;
  price: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  description: string;
  features: { included: boolean; text: string }[];
  highlighted?: boolean;
  buttonText?: string;
  badge?: string;
  icon?: React.ReactNode;
}) => {
  return (
    <Card className={`p-6 flex flex-col h-full ${highlighted ? 'border-primary shadow-lg' : 'border-border'}`}>
      {badge && (
        <Badge className="w-fit mb-4" variant="secondary">
          {badge}
        </Badge>
      )}
      <div className="flex items-center gap-2 mb-2">
        {icon && <div className="text-primary">{icon}</div>}
        <h3 className="text-xl font-bold">{name}</h3>
      </div>
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

const ComparisonFeature = ({ name, tiers }: { name: string; tiers: { free: boolean; pro: boolean; team: boolean } }) => {
  return (
    <div className="grid grid-cols-4 py-4 border-b">
      <div className="font-medium">{name}</div>
      <div className="text-center">
        {tiers.free ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />}
      </div>
      <div className="text-center">
        {tiers.pro ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />}
      </div>
      <div className="text-center">
        {tiers.team ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-300 mx-auto" />}
      </div>
    </div>
  );
};

const FAQ = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b pb-4">
      <button 
        className="flex justify-between items-center w-full text-left py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium text-lg">{question}</h3>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isOpen && (
        <p className="text-gray-600 mt-2 pr-6">
          {answer}
        </p>
      )}
    </div>
  );
};

const Testimonial = ({ quote, author, role, company, avatar }: { 
  quote: string; 
  author: string; 
  role: string; 
  company: string;
  avatar: string;
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
          <img src={avatar} alt={author} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{role}, {company}</p>
        </div>
      </div>
      <p className="italic text-gray-700">"{quote}"</p>
    </Card>
  );
};

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

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
        </div>

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
          />

          <PricingTier
            name="Pro"
            price={billingPeriod === 'monthly' ? '$12' : '$115'}
            description="For professionals who need more power and flexibility."
            icon={<Sparkles size={20} />}
            features={[
              { included: true, text: "Unlimited AI-generated diagrams" },
              { included: true, text: "All diagram types" },
              { included: true, text: "Advanced customization options" },
              { included: true, text: "Export to PNG, SVG, PDF" },
              { included: true, text: "Email support" },
              { included: true, text: "Custom themes" },
              { included: false, text: "Team collaboration" },
            ]}
            highlighted={true}
            badge="Most Popular"
          />

          <PricingTier
            name="Team"
            price={billingPeriod === 'monthly' ? '$29' : '$278'}
            description="For teams that need to collaborate on diagrams."
            icon={<Users size={20} />}
            features={[
              { included: true, text: "Everything in Pro" },
              { included: true, text: "Team collaboration" },
              { included: true, text: "Shared diagram library" },
              { included: true, text: "Version history" },
              { included: true, text: "Priority support" },
              { included: true, text: "Custom branding options" },
              { included: true, text: "Admin dashboard" },
            ]}
            buttonText="Start Team Trial"
          />
        </div>

        <div className="mt-24 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Compare All Features</h2>
          
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="grid grid-cols-4 bg-gray-50 py-3 border-b">
              <div className="font-semibold px-4">Feature</div>
              <div className="text-center font-semibold">Free</div>
              <div className="text-center font-semibold">Pro</div>
              <div className="text-center font-semibold">Team</div>
            </div>
            
            <div className="px-4">
              <div className="py-3 border-b">
                <p className="font-semibold text-gray-700">Diagram Creation</p>
              </div>
              
              <ComparisonFeature 
                name="AI-generated diagrams" 
                tiers={{ free: true, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="Manual code editing" 
                tiers={{ free: true, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="Flowchart diagrams" 
                tiers={{ free: true, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="Sequence diagrams" 
                tiers={{ free: true, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="Class diagrams" 
                tiers={{ free: false, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="State diagrams" 
                tiers={{ free: false, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="Gantt charts" 
                tiers={{ free: false, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="Entity Relationship diagrams" 
                tiers={{ free: false, pro: true, team: true }} 
              />
              
              <div className="py-3 border-b mt-4">
                <p className="font-semibold text-gray-700">Export & Sharing</p>
              </div>
              
              <ComparisonFeature 
                name="PNG export" 
                tiers={{ free: true, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="SVG export" 
                tiers={{ free: false, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="PDF export" 
                tiers={{ free: false, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="Diagram sharing" 
                tiers={{ free: false, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="Embed in websites" 
                tiers={{ free: false, pro: true, team: true }} 
              />
              
              <div className="py-3 border-b mt-4">
                <p className="font-semibold text-gray-700">Collaboration</p>
              </div>
              
              <ComparisonFeature 
                name="Team members" 
                tiers={{ free: false, pro: false, team: true }} 
              />
              <ComparisonFeature 
                name="Shared diagram library" 
                tiers={{ free: false, pro: false, team: true }} 
              />
              <ComparisonFeature 
                name="Version history" 
                tiers={{ free: false, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="Comments & feedback" 
                tiers={{ free: false, pro: false, team: true }} 
              />
              <ComparisonFeature 
                name="Role-based permissions" 
                tiers={{ free: false, pro: false, team: true }} 
              />
              
              <div className="py-3 border-b mt-4">
                <p className="font-semibold text-gray-700">Support</p>
              </div>
              
              <ComparisonFeature 
                name="Community support" 
                tiers={{ free: true, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="Email support" 
                tiers={{ free: false, pro: true, team: true }} 
              />
              <ComparisonFeature 
                name="Priority support" 
                tiers={{ free: false, pro: false, team: true }} 
              />
              <ComparisonFeature 
                name="Dedicated account manager" 
                tiers={{ free: false, pro: false, team: true }} 
              />
            </div>
          </div>
        </div>

        <div className="mt-24 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Testimonial 
              quote="This tool has completely transformed how I create and share diagrams with my team. The AI generation is incredibly accurate."
              author="Sarah Johnson"
              role="Product Manager"
              company="Acme Inc."
              avatar="https://randomuser.me/api/portraits/women/44.jpg"
            />
            <Testimonial 
              quote="I've tried many diagram tools, but this one stands out for its ease of use and powerful AI capabilities. Worth every penny!"
              author="Michael Chen"
              role="Software Engineer"
              company="TechCorp"
              avatar="https://randomuser.me/api/portraits/men/32.jpg"
            />
            <Testimonial 
              quote="The Team plan has been a game-changer for our documentation process. We can collaborate seamlessly and create diagrams in minutes."
              author="Emily Rodriguez"
              role="Technical Writer"
              company="DataSystems"
              avatar="https://randomuser.me/api/portraits/women/68.jpg"
            />
          </div>
        </div>

        <div className="mt-24 bg-white p-8 rounded-lg border max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <FAQ 
              question="Do I need my own OpenAI API key?"
              answer="Yes, all plans require you to use your own OpenAI API key. This gives you full control over your API usage and costs. We recommend using GPT-4o-mini for the best balance of performance and cost."
            />
            <FAQ 
              question="Can I upgrade or downgrade my plan?"
              answer="Yes, you can change your plan at any time. If you upgrade, you'll be charged the prorated amount for the remainder of your billing cycle. If you downgrade, the changes will take effect at the start of your next billing cycle."
            />
            <FAQ 
              question="Is there a free trial for paid plans?"
              answer="Yes, both Pro and Team plans come with a 14-day free trial, no credit card required. You'll get full access to all features during the trial period."
            />
            <FAQ 
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and some regional payment methods. For Team plans, we also offer invoice payment options."
            />
            <FAQ 
              question="Can I get a refund if I'm not satisfied?"
              answer="Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not completely satisfied, contact our support team within 30 days of your purchase for a full refund."
            />
            <FAQ 
              question="Do you offer discounts for educational institutions?"
              answer="Yes, we offer special pricing for educational institutions and non-profit organizations. Please contact our sales team for more information."
            />
            <FAQ 
              question="How does the billing work for team members?"
              answer="The Team plan includes up to 5 team members. Additional team members can be added for $5 per member per month. Billing is based on the total number of team members at the end of each billing cycle."
            />
          </div>
        </div>

        <div className="mt-24 max-w-4xl mx-auto bg-primary text-white rounded-xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of professionals who create beautiful diagrams with AI assistance.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/">Try for Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link to="/">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="mt-24 bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">AI Mermaid Diagram Generator</h3>
              <p className="text-gray-400">Create beautiful diagrams with the power of AI. Perfect for developers, product managers, and anyone who needs to visualize complex systems.</p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Roadmap</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Legal</a></li>
              </ul>
            </div>
          </div>
          
          <Separator className="bg-gray-800" />
          
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">© 2023 AI Mermaid Diagram Generator. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
