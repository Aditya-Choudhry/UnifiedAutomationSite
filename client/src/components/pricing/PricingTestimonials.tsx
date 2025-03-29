import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/lib/icons";

// Testimonial data
const testimonials = [
  {
    quote: "We switched from a competitor and immediately saved 30% on our automation costs. The pricing is transparent and we never have to worry about hidden fees.",
    author: "Sarah Johnson",
    title: "CTO, GrowthTech",
    avatar: "SJ"
  },
  {
    quote: "The ROI was immediate. Within 3 months, our team automation workflows paid for themselves 5 times over by reducing manual work.",
    author: "Michael Chen",
    title: "Operations Director, FlexLogistics",
    avatar: "MC"
  },
  {
    quote: "What I love most is the predictable pricing. We can accurately forecast our costs as we scale, which is crucial for our business planning.",
    author: "Priya Patel",
    title: "Finance Manager, BrightStart",
    avatar: "PP"
  },
  {
    quote: "As a small business, the starter plan was perfect. As we grew, upgrading to Professional was seamless with no disruption to our workflows.",
    author: "David Wilson",
    title: "Founder, CreativeFlow",
    avatar: "DW"
  }
];

const PricingTestimonials = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">What Our Customers Say</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Don't just take our word for it. Here's what businesses are saying about the value they get from our pricing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="overflow-hidden border-slate-200">
            <CardContent className="p-6">
              <div className="flex mb-4">
                <Icons.info className="text-primary-200 h-8 w-8" />
              </div>
              <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center mt-auto">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback className="bg-primary-100 text-primary-800">{testimonial.avatar}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">{testimonial.author}</h4>
                  <p className="text-sm text-slate-500">{testimonial.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-slate-100 rounded-lg p-6 mt-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-bold">Average Customer ROI</h3>
            <p className="text-slate-600">Based on customer surveys and case studies</p>
          </div>
          <div className="flex flex-wrap gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600">324%</div>
              <div className="text-sm text-slate-500">1-Year Return</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">82%</div>
              <div className="text-sm text-slate-500">Cost Reduction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600">15.5</div>
              <div className="text-sm text-slate-500">Hours Saved/Week</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingTestimonials;