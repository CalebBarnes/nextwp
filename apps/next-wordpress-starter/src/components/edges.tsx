import clsx from "clsx";

export default function Edges({
  children,
  className,
  component: Component = "div",
  ...rest
}: {
  component?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <Component
      className={clsx("mx-auto max-w-7xl px-2 py-2 sm:px-4 lg:px-8", className)}
      {...rest}
    >
      {children}
    </Component>
  );
}
