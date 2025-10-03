import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@repo/shared-ui';

export default function DocsHomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
          Documentation
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
          Comprehensive documentation for the monorepo and its packages.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Learn how to set up and use the monorepo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/docs/getting-started">Get Started</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
            <CardDescription>
              Explore the shared UI components library
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild className="w-full">
              <a href="/docs/components">View Components</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Reference</CardTitle>
            <CardDescription>
              Detailed API documentation and examples
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" asChild className="w-full">
              <a href="/docs/api">API Docs</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Quick Links
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Packages</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><a href="/docs/packages/shared-ui" className="hover:text-foreground">Shared UI</a></li>
              <li><a href="/docs/packages/shared-configs" className="hover:text-foreground">Shared Configs</a></li>
              <li><a href="/docs/packages/shared-lib" className="hover:text-foreground">Shared Lib</a></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Apps</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li><a href="/docs/apps/web" className="hover:text-foreground">Web App</a></li>
              <li><a href="/docs/apps/docs" className="hover:text-foreground">Docs App</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
