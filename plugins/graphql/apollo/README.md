# GraphQL Apollo Plugin

A comprehensive GraphQL plugin for Next.js applications using Apollo Client with full development tooling, code generation, and quality assurance.

## Features

- 🚀 **Apollo Client 3** with full TypeScript support
- 🔧 **GraphQL Codegen** for automatic type generation
- 🎯 **ESLint** with GraphQL-specific rules (extends dev-tools)
- 🔄 **Real-time subscriptions** support
- 📊 **Comprehensive caching** strategies
- 🛡️ **Error handling** and retry logic
- 📱 **React hooks** for easy integration

## Quick Start

### 1. Setup Development Environment

```bash
# Initialize the development environment (from dev-tools plugin)
npm run dev:setup

# Setup GraphQL-specific configuration
npm run graphql:setup
```

### 2. Configure GraphQL Server

Update the schema URL in `codegen.yml`:

```yaml
schema:
  - 'http://your-graphql-server.com/graphql'
```

### 3. Generate Types

```bash
# Generate types from your GraphQL schema
npm run graphql:codegen

# Watch mode for development
npm run graphql:codegen:watch
```

### 4. Start Using GraphQL

```typescript
import { useGraphQLQuery } from '@/hooks/use-graphql';
import { GET_USERS } from '@/lib/graphql-queries';

function UsersList() {
  const { data, loading, error } = useGraphQLQuery(GET_USERS, {
    limit: 10,
    offset: 0,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data?.users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Available Scripts

### Development

- `npm run graphql:codegen` - Generate GraphQL types
- `npm run graphql:codegen:watch` - Watch mode for codegen
- `npm run graphql:validate` - Validate GraphQL setup
- `npm run graphql:setup` - Setup GraphQL-specific configuration

### Code Quality (from dev-tools plugin)

- `npm run dev:setup` - Setup complete development environment
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### Git Hooks (from dev-tools plugin)

- `npm run prepare` - Install Husky hooks
- `npm run pre-commit` - Run lint-staged

## Project Structure

```
graphql/apollo/
├── lib/
│   ├── apollo-client.ts          # Apollo Client configuration
│   ├── graphql-queries.ts        # GraphQL queries
│   ├── graphql-mutations.ts      # GraphQL mutations
│   ├── graphql-subscriptions.ts  # GraphQL subscriptions
│   ├── graphql-cache.ts          # Cache management
│   ├── graphql-setup.ts          # Setup and validation
│   ├── setup-dev-environment.ts  # Development environment setup
│   └── generated/                # Generated types (auto-created)
├── hooks/
│   ├── use-graphql.ts           # Generic GraphQL hooks
│   └── use-subscription.ts      # Subscription hooks
├── graphql/
│   ├── schema.graphql           # GraphQL schema
│   └── fragments.ts             # GraphQL fragments
├── .husky/                      # Git hooks
├── codegen.yml                  # GraphQL Codegen configuration
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── tsconfig.json                # TypeScript configuration
└── README.md                    # This file
```

## Configuration

### GraphQL Codegen

The `codegen.yml` file configures automatic type generation:

```yaml
overwrite: true
schema:
  - 'graphql/schema.graphql'
  - 'http://localhost:4000/graphql'
documents:
  - 'lib/**/*.ts'
  - 'hooks/**/*.ts'
generates:
  lib/generated/types.ts:
    plugins:
      - 'typescript'
      - 'typescript-operations'
```

### ESLint

ESLint is configured with:

- TypeScript support
- React and React Hooks rules
- GraphQL-specific rules
- Import/export rules
- Accessibility rules

### Prettier

Prettier is configured for:

- TypeScript/JavaScript
- GraphQL files
- JSON and YAML
- Markdown
- CSS/SCSS

### Husky Git Hooks

- **Pre-commit**: Runs lint-staged, codegen, and schema validation
- **Pre-push**: Runs full linting, type checking, and tests

## Usage Examples

### Queries

```typescript
import { useGraphQLQuery } from '@/hooks/use-graphql';
import { GET_PRODUCTS } from '@/lib/graphql-queries';

function ProductsList() {
  const { data, loading, error, refetch } = useGraphQLQuery(
    GET_PRODUCTS,
    { limit: 20, category: 'electronics' },
    {
      fetchPolicy: 'cache-first',
      onError: error => console.error('Query failed:', error),
      onSuccess: data => console.log('Products loaded:', data),
    }
  );

  return (
    <div>
      <button onClick={() => refetch()}>Refresh</button>
      {/* Render products */}
    </div>
  );
}
```

### Mutations

```typescript
import { useGraphQLMutation } from '@/hooks/use-graphql';
import { CREATE_PRODUCT } from '@/lib/graphql-mutations';

function CreateProductForm() {
  const [createProduct, { loading, error }] = useGraphQLMutation(
    CREATE_PRODUCT,
    {
      onSuccess: data => {
        console.log('Product created:', data);
        // Invalidate and refetch queries
      },
    }
  );

  const handleSubmit = async formData => {
    try {
      await createProduct({
        variables: {
          input: {
            name: formData.name,
            price: formData.price,
            category: formData.category,
          },
        },
      });
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type='submit' disabled={loading}>
        {loading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
}
```

### Subscriptions

```typescript
import { useGraphQLSubscription } from '@/hooks/use-subscription';
import { ORDER_STATUS_CHANGED } from '@/lib/graphql-subscriptions';

function OrderStatusTracker({ orderId }) {
  const { data, error } = useGraphQLSubscription(
    ORDER_STATUS_CHANGED,
    { orderId },
    {
      onData: data => {
        console.log('Order status updated:', data);
        // Update UI or show notification
      },
    }
  );

  return (
    <div>
      <h3>Order Status</h3>
      {data?.orderStatusChanged && (
        <p>Status: {data.orderStatusChanged.status}</p>
      )}
    </div>
  );
}
```

### Cache Management

```typescript
import { useGraphQLClient } from '@/hooks/use-graphql';

function CacheControls() {
  const { clearCache, resetStore, evictField } = useGraphQLClient();

  const handleClearCache = async () => {
    await clearCache();
    console.log('Cache cleared');
  };

  const handleResetStore = async () => {
    await resetStore();
    console.log('Store reset');
  };

  const handleEvictProducts = () => {
    evictField('products');
    console.log('Products evicted from cache');
  };

  return (
    <div>
      <button onClick={handleClearCache}>Clear Cache</button>
      <button onClick={handleResetStore}>Reset Store</button>
      <button onClick={handleEvictProducts}>Evict Products</button>
    </div>
  );
}
```

## Best Practices

### 1. Use Generated Types

Always use the generated types from `lib/generated/types.ts`:

```typescript
import {
  GetProductsQuery,
  GetProductsQueryVariables,
} from '@/lib/generated/types';

const { data } = useGraphQLQuery<GetProductsQuery, GetProductsQueryVariables>(
  GET_PRODUCTS,
  variables
);
```

### 2. Fragment Usage

Use GraphQL fragments for reusable field selections:

```typescript
import { PRODUCT_FRAGMENT } from '@/graphql/fragments';

export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      ...ProductFragment
    }
  }
  ${PRODUCT_FRAGMENT}
`;
```

### 3. Error Handling

Implement proper error handling:

```typescript
const { data, error, loading } = useGraphQLQuery(QUERY, variables, {
  onError: error => {
    // Log error
    logger.error('GraphQL query failed:', error);

    // Show user-friendly message
    toast.error('Failed to load data. Please try again.');
  },
});
```

### 4. Optimistic Updates

Use optimistic updates for better UX:

```typescript
const [updateProduct] = useGraphQLMutation(UPDATE_PRODUCT, {
  optimisticResponse: {
    updateProduct: {
      __typename: 'Product',
      id: productId,
      name: newName,
      // ... other fields
    },
  },
});
```

## Integration with Other Plugins

This plugin works seamlessly with:

- **Dev-Tools Plugin**: Provides ESLint, Prettier, Husky, and TypeScript configuration
- **Design System Plugin**: Integrates with component linting
- **State Management Plugin**: Supports Zustand and React Query patterns

## Troubleshooting

### Common Issues

1. **Types not generated**: Make sure your GraphQL server is running and accessible
2. **ESLint errors**: Run `npm run lint:fix` to auto-fix issues (from dev-tools plugin)
3. **Husky hooks not working**: Run `npm run prepare` to reinstall hooks (from dev-tools plugin)
4. **Cache issues**: Use the cache management utilities to clear/reset cache
5. **Development environment issues**: Run `npm run dev:setup` to reset the environment

### Getting Help

- Check the generated types in `lib/generated/`
- Run `npm run graphql:validate` to check your setup
- Use the browser's Apollo Client DevTools extension
- Check the console for detailed error messages

## Contributing

1. Make sure all tests pass: `npm test`
2. Run linting: `npm run lint` (from dev-tools plugin)
3. Format code: `npm run format` (from dev-tools plugin)
4. Generate types: `npm run graphql:codegen`
5. Commit your changes (hooks will run automatically from dev-tools plugin)

## License

MIT
