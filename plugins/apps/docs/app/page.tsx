import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/shared-ui';
import { Search } from '@/components/search';

const docs = [
  {
    title: 'Getting Started',
    description: 'Learn how to set up and configure your project',
    href: '/docs/getting-started',
    category: 'Setup',
  },
  {
    title: 'Components',
    description: 'Explore our comprehensive component library',
    href: '/docs/components',
    category: 'UI',
  },
  {
    title: 'API Reference',
    description: 'Complete API documentation and examples',
    href: '/docs/api',
    category: 'API',
  },
  {
    title: 'Deployment',
    description: 'Deploy your application to production',
    href: '/docs/deployment',
    category: 'DevOps',
  },
  {
    title: 'Contributing',
    description: 'How to contribute to the project',
    href: '/docs/contributing',
    category: 'Development',
  },
  {
    title: 'Troubleshooting',
    description: 'Common issues and their solutions',
    href: '/docs/troubleshooting',
    category: 'Support',
  },
];

export default function DocsHomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
          Documentation
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Everything you need to know about building with Enterprise
        </p>
      </div>

      <div className="mb-8">
        <Search />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {docs.map((doc, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{doc.title}</CardTitle>
                <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {doc.category}
                </span>
              </div>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <a
                href={doc.href}
                className="text-primary hover:text-primary/80 font-medium"
              >
                Read more →
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


