import { createRoute, OpenAPIHono, type RouteConfig, type RouteHandler } from '@hono/zod-openapi'
import type { MiddlewareHandler } from 'hono'

type RouteDefinition = {
  path: string
  method: 'get' | 'post' | 'put' | 'patch' | 'delete'
  description: string
  tags: string[]
  request?: RouteConfig['request']
  responses: RouteConfig['responses']
  middleware?: MiddlewareHandler[]
  controllerFN: RouteHandler<RouteConfig>
}

export class Routes {
  router: OpenAPIHono

  constructor(routes: RouteDefinition[]) {
    this.router = new OpenAPIHono()

    for (const { middleware, controllerFN, ...routeConfig } of routes) {
      const route = createRoute(routeConfig)

      if (middleware?.length) {
        const honePath = routeConfig.path.replace(/\{(\w+)\}/g, ':$1')
        this.router.on(routeConfig.method.toUpperCase(), honePath, ...middleware)
      }

      this.router.openapi(route, controllerFN)
    }
  }
}
