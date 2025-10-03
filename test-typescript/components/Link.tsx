import React from "react";
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import { performanceUtils } from "../lib/performance";

interface LinkProps extends NextLinkProps {
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  onMouseEnter?: () => void;
}

export const Link: React.FC<LinkProps> = ({
  children,
  className,
  prefetch = true,
  onMouseEnter,
  href,
  ...props
}) => {
  const handleMouseEnter = () => {
    // Prefetch on hover for better performance
    if (prefetch && typeof href === "string") {
      performanceUtils.prefetchResource(href);
    }

    if (onMouseEnter) {
      onMouseEnter();
    }
  };

  return (
    <NextLink
      href={href}
      className={className}
      prefetch={prefetch}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </NextLink>
  );
};

// External link component with security and performance optimizations
export const ExternalLink: React.FC<
  LinkProps & { target?: string; rel?: string }
> = ({
  children,
  className,
  target = "_blank",
  rel = "noopener noreferrer",
  href,
  ...props
}) => {
  const handleClick = () => {
    // Track external link clicks
    if (typeof window !== "undefined" && "analytics" in window) {
      (window as any).analytics.track("external_link_click", {
        url: href,
      });
    }
  };

  return (
    <a
      href={href as string}
      target={target}
      rel={rel}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  );
};

export default Link;
