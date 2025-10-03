import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared-ui';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Welcome to Web App
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
            A modern Next.js application built with shared components and utilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Shared UI Components</CardTitle>
              <CardDescription>
                Reusable components from the shared UI package
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Get Started</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shared Configurations</CardTitle>
              <CardDescription>
                Consistent ESLint, TypeScript, and Tailwind configs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Learn More</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shared Libraries</CardTitle>
              <CardDescription>
                Common utilities and helper functions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">Explore</Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to build something amazing?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start building your application with our shared components and utilities.
          </p>
          <Button size="lg">Start Building</Button>
        </div>
      </div>
    </div>
  );
}
