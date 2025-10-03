import { logger } from "@KalabAmssalu/logger";
import { task } from "@KalabAmssalu/task";

export interface DesignSystemConfig {
  theme: "light" | "dark" | "system";
  primaryColor: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "xl";
  fontFamily: "sans" | "serif" | "mono";
  enableAnimations: boolean;
  enableRTL: boolean;
}

export interface ComponentVariant {
  name: string;
  props: Record<string, any>;
  styles: Record<string, string>;
}

export interface DesignToken {
  name: string;
  value: string;
  category:
    | "color"
    | "spacing"
    | "typography"
    | "border"
    | "shadow"
    | "animation";
  description?: string;
}

export class DesignSystemManager {
  private static instance: DesignSystemManager;
  private config: DesignSystemConfig;
  private tokens: Map<string, DesignToken> = new Map();
  private variants: Map<string, ComponentVariant[]> = new Map();

  private constructor(config: DesignSystemConfig) {
    this.config = config;
    this.initializeTokens();
  }

  public static getInstance(config?: DesignSystemConfig): DesignSystemManager {
    if (!DesignSystemManager.instance && config) {
      DesignSystemManager.instance = new DesignSystemManager(config);
    }
    return DesignSystemManager.instance;
  }

  private initializeTokens(): void {
    const initTask = task("Initializing design system tokens");

    try {
      initTask.start("Loading design tokens...");

      // Color tokens
      const colorTokens: DesignToken[] = [
        {
          name: "primary-50",
          value: "#eff6ff",
          category: "color",
          description: "Primary color 50",
        },
        {
          name: "primary-500",
          value: "#3b82f6",
          category: "color",
          description: "Primary color 500",
        },
        {
          name: "primary-900",
          value: "#1e3a8a",
          category: "color",
          description: "Primary color 900",
        },
        {
          name: "secondary-50",
          value: "#f8fafc",
          category: "color",
          description: "Secondary color 50",
        },
        {
          name: "secondary-500",
          value: "#64748b",
          category: "color",
          description: "Secondary color 500",
        },
        {
          name: "secondary-900",
          value: "#0f172a",
          category: "color",
          description: "Secondary color 900",
        },
        {
          name: "success-500",
          value: "#22c55e",
          category: "color",
          description: "Success color",
        },
        {
          name: "warning-500",
          value: "#f59e0b",
          category: "color",
          description: "Warning color",
        },
        {
          name: "destructive-500",
          value: "#ef4444",
          category: "color",
          description: "Destructive color",
        },
      ];

      // Spacing tokens
      const spacingTokens: DesignToken[] = [
        {
          name: "spacing-1",
          value: "0.25rem",
          category: "spacing",
          description: "Spacing 1",
        },
        {
          name: "spacing-2",
          value: "0.5rem",
          category: "spacing",
          description: "Spacing 2",
        },
        {
          name: "spacing-4",
          value: "1rem",
          category: "spacing",
          description: "Spacing 4",
        },
        {
          name: "spacing-8",
          value: "2rem",
          category: "spacing",
          description: "Spacing 8",
        },
        {
          name: "spacing-16",
          value: "4rem",
          category: "spacing",
          description: "Spacing 16",
        },
      ];

      // Typography tokens
      const typographyTokens: DesignToken[] = [
        {
          name: "font-size-xs",
          value: "0.75rem",
          category: "typography",
          description: "Extra small font size",
        },
        {
          name: "font-size-sm",
          value: "0.875rem",
          category: "typography",
          description: "Small font size",
        },
        {
          name: "font-size-base",
          value: "1rem",
          category: "typography",
          description: "Base font size",
        },
        {
          name: "font-size-lg",
          value: "1.125rem",
          category: "typography",
          description: "Large font size",
        },
        {
          name: "font-size-xl",
          value: "1.25rem",
          category: "typography",
          description: "Extra large font size",
        },
        {
          name: "font-weight-normal",
          value: "400",
          category: "typography",
          description: "Normal font weight",
        },
        {
          name: "font-weight-medium",
          value: "500",
          category: "typography",
          description: "Medium font weight",
        },
        {
          name: "font-weight-semibold",
          value: "600",
          category: "typography",
          description: "Semibold font weight",
        },
        {
          name: "font-weight-bold",
          value: "700",
          category: "typography",
          description: "Bold font weight",
        },
      ];

      // Border tokens
      const borderTokens: DesignToken[] = [
        {
          name: "border-radius-sm",
          value: "0.125rem",
          category: "border",
          description: "Small border radius",
        },
        {
          name: "border-radius-md",
          value: "0.375rem",
          category: "border",
          description: "Medium border radius",
        },
        {
          name: "border-radius-lg",
          value: "0.5rem",
          category: "border",
          description: "Large border radius",
        },
        {
          name: "border-radius-xl",
          value: "0.75rem",
          category: "border",
          description: "Extra large border radius",
        },
      ];

      // Shadow tokens
      const shadowTokens: DesignToken[] = [
        {
          name: "shadow-sm",
          value: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          category: "shadow",
          description: "Small shadow",
        },
        {
          name: "shadow-md",
          value:
            "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          category: "shadow",
          description: "Medium shadow",
        },
        {
          name: "shadow-lg",
          value:
            "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
          category: "shadow",
          description: "Large shadow",
        },
        {
          name: "shadow-xl",
          value:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
          category: "shadow",
          description: "Extra large shadow",
        },
      ];

      // Animation tokens
      const animationTokens: DesignToken[] = [
        {
          name: "duration-150",
          value: "150ms",
          category: "animation",
          description: "Fast animation duration",
        },
        {
          name: "duration-200",
          value: "200ms",
          category: "animation",
          description: "Normal animation duration",
        },
        {
          name: "duration-300",
          value: "300ms",
          category: "animation",
          description: "Slow animation duration",
        },
        {
          name: "ease-in-out",
          value: "cubic-bezier(0.4, 0, 0.2, 1)",
          category: "animation",
          description: "Ease in out timing function",
        },
      ];

      // Add all tokens to the map
      [
        ...colorTokens,
        ...spacingTokens,
        ...typographyTokens,
        ...borderTokens,
        ...shadowTokens,
        ...animationTokens,
      ].forEach((token) => this.tokens.set(token.name, token));

      initTask.succeed(
        `Design system initialized with ${this.tokens.size} tokens`
      );
      logger.success("🎨 Design system tokens loaded successfully");
    } catch (error) {
      initTask.fail("Failed to initialize design system tokens");
      logger.error("Design system initialization error:", error);
      throw error;
    }
  }

  public getToken(name: string): DesignToken | undefined {
    return this.tokens.get(name);
  }

  public getTokensByCategory(category: DesignToken["category"]): DesignToken[] {
    return Array.from(this.tokens.values()).filter(
      (token) => token.category === category
    );
  }

  public getAllTokens(): DesignToken[] {
    return Array.from(this.tokens.values());
  }

  public addToken(token: DesignToken): void {
    this.tokens.set(token.name, token);
    logger.info(`Added design token: ${token.name}`);
  }

  public removeToken(name: string): boolean {
    const removed = this.tokens.delete(name);
    if (removed) {
      logger.info(`Removed design token: ${name}`);
    }
    return removed;
  }

  public updateConfig(newConfig: Partial<DesignSystemConfig>): void {
    this.config = { ...this.config, ...newConfig };
    logger.info("Design system configuration updated");
  }

  public getConfig(): DesignSystemConfig {
    return { ...this.config };
  }

  public addComponentVariant(
    componentName: string,
    variant: ComponentVariant
  ): void {
    if (!this.variants.has(componentName)) {
      this.variants.set(componentName, []);
    }

    const variants = this.variants.get(componentName)!;
    variants.push(variant);

    logger.info(
      `Added variant '${variant.name}' to component '${componentName}'`
    );
  }

  public getComponentVariants(componentName: string): ComponentVariant[] {
    return this.variants.get(componentName) || [];
  }

  public generateCSSVariables(): string {
    const variables: string[] = [];

    this.tokens.forEach((token, name) => {
      const cssVarName = `--${name.replace(/-/g, "-")}`;
      variables.push(`${cssVarName}: ${token.value};`);
    });

    return `:root {\n  ${variables.join("\n  ")}\n}`;
  }

  public generateTailwindConfig(): object {
    const config: any = {
      theme: {
        extend: {
          colors: {},
          spacing: {},
          fontSize: {},
          fontWeight: {},
          borderRadius: {},
          boxShadow: {},
          transitionDuration: {},
          transitionTimingFunction: {},
        },
      },
    };

    this.tokens.forEach((token, name) => {
      const [category, ...parts] = name.split("-");
      const key = parts.join("-");

      switch (category) {
        case "primary":
        case "secondary":
        case "success":
        case "warning":
        case "destructive":
          if (!config.theme.extend.colors[category]) {
            config.theme.extend.colors[category] = {};
          }
          config.theme.extend.colors[category][key] = token.value;
          break;
        case "spacing":
          config.theme.extend.spacing[key] = token.value;
          break;
        case "font":
          if (name.includes("size")) {
            config.theme.extend.fontSize[key] = token.value;
          } else if (name.includes("weight")) {
            config.theme.extend.fontWeight[key] = token.value;
          }
          break;
        case "border":
          if (name.includes("radius")) {
            config.theme.extend.borderRadius[key] = token.value;
          }
          break;
        case "shadow":
          config.theme.extend.boxShadow[key] = token.value;
          break;
        case "duration":
          config.theme.extend.transitionDuration[key] = token.value;
          break;
        case "ease":
          config.theme.extend.transitionTimingFunction[key] = token.value;
          break;
      }
    });

    return config;
  }

  public exportTokens(format: "json" | "css" | "scss" | "tailwind"): string {
    switch (format) {
      case "json":
        return JSON.stringify(Object.fromEntries(this.tokens), null, 2);
      case "css":
        return this.generateCSSVariables();
      case "scss":
        const scssVars = Array.from(this.tokens.entries())
          .map(
            ([name, token]) => `$${name.replace(/-/g, "-")}: ${token.value};`
          )
          .join("\n");
        return scssVars;
      case "tailwind":
        return JSON.stringify(this.generateTailwindConfig(), null, 2);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  public validateTokens(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    this.tokens.forEach((token, name) => {
      // Validate token name format
      if (!/^[a-z]+(-[a-z0-9]+)*$/.test(name)) {
        errors.push(`Invalid token name format: ${name}`);
      }

      // Validate token value based on category
      switch (token.category) {
        case "color":
          if (
            !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(token.value) &&
            !token.value.startsWith("rgb") &&
            !token.value.startsWith("hsl")
          ) {
            errors.push(
              `Invalid color value for token ${name}: ${token.value}`
            );
          }
          break;
        case "spacing":
        case "typography":
        case "border":
          if (!/^\d+(\.\d+)?(rem|px|em|%)$/.test(token.value)) {
            errors.push(`Invalid size value for token ${name}: ${token.value}`);
          }
          break;
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Utility functions for design system
export const designSystem = {
  createToken: (
    name: string,
    value: string,
    category: DesignToken["category"],
    description?: string
  ): DesignToken => ({
    name,
    value,
    category,
    description,
  }),

  createVariant: (
    name: string,
    props: Record<string, any>,
    styles: Record<string, string>
  ): ComponentVariant => ({
    name,
    props,
    styles,
  }),

  getDefaultConfig: (): DesignSystemConfig => ({
    theme: "system",
    primaryColor: "#3b82f6",
    borderRadius: "md",
    fontFamily: "sans",
    enableAnimations: true,
    enableRTL: false,
  }),
};
