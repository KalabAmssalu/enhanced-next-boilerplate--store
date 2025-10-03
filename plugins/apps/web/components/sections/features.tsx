import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared-ui';

const features = [
  {
    title: 'Modern Stack',
    description: 'Built with Next.js 14, React 18, TypeScript, and Tailwind CSS for the best developer experience.',
    icon: '⚡',
  },
  {
    title: 'Type Safety',
    description: 'Full TypeScript support with strict configuration and shared type definitions across the monorepo.',
    icon: '🔒',
  },
  {
    title: 'Performance',
    description: 'Optimized for performance with code splitting, lazy loading, and modern build tools.',
    icon: '🚀',
  },
  {
    title: 'Accessibility',
    description: 'WCAG compliant components with proper ARIA attributes and keyboard navigation.',
    icon: '♿',
  },
  {
    title: 'Testing',
    description: 'Comprehensive testing setup with Jest, React Testing Library, and Playwright.',
    icon: '🧪',
  },
  {
    title: 'DevOps',
    description: 'CI/CD pipelines, Docker support, and deployment configurations included.',
    icon: '🔧',
  },
];

export function Features() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Everything you need to build modern web apps
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Our comprehensive toolkit includes all the modern tools and best practices you need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}


