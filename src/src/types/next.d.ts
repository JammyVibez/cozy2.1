// types/next.d.ts
export type RouteParams<T extends Record<string, string> = {}> = {
  params: T
  searchParams?: Record<string, string | string[] | undefined>
}
