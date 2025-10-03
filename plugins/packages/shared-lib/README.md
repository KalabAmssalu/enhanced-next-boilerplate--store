# @repo/shared-lib

A shared utility library for the monorepo, providing common functions, types, and constants.

## Features

- **Validation**: Email, password, URL, and phone validation with Zod
- **Date Utilities**: Date formatting, parsing, and manipulation with date-fns
- **String Utilities**: String manipulation, formatting, and masking
- **Array Utilities**: Array manipulation, filtering, and transformation
- **Object Utilities**: Object manipulation, cloning, and merging
- **URL Utilities**: URL parsing, building, and validation
- **Storage Utilities**: Local and session storage helpers
- **Crypto Utilities**: Hashing, encoding, and random generation
- **Constants**: Common constants for HTTP, regex, dates, and more
- **Types**: Shared TypeScript types and interfaces

## Installation

```bash
npm install @repo/shared-lib
```

## Usage

### Validation

```typescript
import { validateEmail, validatePassword, validate } from "@repo/shared-lib";

// Simple validation
const isValid = validateEmail("user@example.com");

// Schema validation
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const result = validate(schema, {
  email: "user@example.com",
  password: "password123",
});
```

### Date Utilities

```typescript
import { formatDate, getRelativeTime } from "@repo/shared-lib";

const formatted = formatDate(new Date(), "yyyy-MM-dd");
const relative = getRelativeTime(new Date(Date.now() - 3600000)); // "1 hour ago"
```

### String Utilities

```typescript
import { capitalize, slugify, truncate } from "@repo/shared-lib";

const capitalized = capitalize("hello world"); // "Hello world"
const slug = slugify("Hello World!"); // "hello-world"
const truncated = truncate("Long text here", 10); // "Long text ..."
```

### Array Utilities

```typescript
import { chunk, unique, groupBy } from "@repo/shared-lib";

const chunks = chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
const uniqueItems = unique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]
const grouped = groupBy(users, (user) => user.role);
```

### Object Utilities

```typescript
import { pick, omit, deepClone } from "@repo/shared-lib";

const user = { id: 1, name: "John", email: "john@example.com" };
const picked = pick(user, ["id", "name"]); // { id: 1, name: 'John' }
const omitted = omit(user, ["email"]); // { id: 1, name: 'John' }
const cloned = deepClone(user);
```

### Storage Utilities

```typescript
import { LocalStorage, SessionStorage } from "@repo/shared-lib";

// Local storage
LocalStorage.set("theme", "dark");
const theme = LocalStorage.get("theme", "light");

// Session storage
SessionStorage.set("tempData", { key: "value" });
const tempData = SessionStorage.get("tempData");
```

### Constants

```typescript
import { HTTP_STATUS, REGEX_PATTERNS, STORAGE_KEYS } from "@repo/shared-lib";

if (response.status === HTTP_STATUS.OK) {
  // Handle success
}

if (REGEX_PATTERNS.EMAIL.test(email)) {
  // Valid email
}

const theme = LocalStorage.get(STORAGE_KEYS.THEME);
```

## Development

```bash
# Build the package
npm run build

# Watch for changes
npm run dev

# Type check
npm run type-check

# Clean build artifacts
npm run clean
```

## Contributing

1. Add your utility function to the appropriate file
2. Export it from the main index file
3. Add proper TypeScript types
4. Include usage examples in the README
5. Test your function thoroughly

## License

MIT


