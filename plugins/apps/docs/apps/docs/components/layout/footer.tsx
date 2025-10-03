export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Documentation</h3>
            <p className="text-sm text-muted-foreground">
              Comprehensive documentation for the monorepo and its packages.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Guides</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/docs/getting-started" className="hover:text-foreground">Getting Started</a></li>
              <li><a href="/docs/components" className="hover:text-foreground">Components</a></li>
              <li><a href="/docs/api" className="hover:text-foreground">API Reference</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Packages</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/docs/packages/shared-ui" className="hover:text-foreground">Shared UI</a></li>
              <li><a href="/docs/packages/shared-configs" className="hover:text-foreground">Shared Configs</a></li>
              <li><a href="/docs/packages/shared-lib" className="hover:text-foreground">Shared Lib</a></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">GitHub</a></li>
              <li><a href="#" className="hover:text-foreground">Issues</a></li>
              <li><a href="#" className="hover:text-foreground">Discussions</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Documentation. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
