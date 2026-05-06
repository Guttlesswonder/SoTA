declare module 'react' {
  export type FormEvent<T = Element> = {
    preventDefault: () => void
    currentTarget: T
  }

  export type ReactNode = unknown

  export function useMemo<T>(factory: () => T, deps: readonly unknown[]): T

  export function useState<S>(
    initialState: S | (() => S),
  ): [S, (value: S | ((previous: S) => S)) => void]

  export function StrictMode(props: { children?: ReactNode }): ReactNode
}

declare module 'react-dom/client' {
  export function createRoot(container: Element): {
    render: (children: unknown) => void
  }
}

declare module 'react/jsx-runtime' {
  export const Fragment: unknown
  export function jsx(type: unknown, props: unknown, key?: unknown): unknown
  export function jsxs(type: unknown, props: unknown, key?: unknown): unknown
}

declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: any
  }
}
