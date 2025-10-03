import { Button } from '@repo/shared-ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared-ui';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { Stats } from '@/components/sections/stats';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <Stats />
      
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Get Started Today
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              Join thousands of users who are already using our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Setup</CardTitle>
                <CardDescription>
                  Get up and running in minutes with our intuitive setup process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Get Started</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>24/7 Support</CardTitle>
                <CardDescription>
                  Our team is here to help you every step of the way
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">Contact Support</Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Enterprise Ready</CardTitle>
                <CardDescription>
                  Built for scale with enterprise-grade security and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">Learn More</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}


