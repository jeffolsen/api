import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cms/_auth/preview/$')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cms/_auth/preview/$"!</div>
}
