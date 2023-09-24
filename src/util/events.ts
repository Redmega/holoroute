export const Events = {
  Hub: {
    StartRoute: 'hub:route:start',
    CompleteRoute: 'hub:route:complete',
    TransferResource: 'hub:route:transfer',
  },
}

export interface StartRouteArgs {
  origin: string // id
}

export interface CompleteRouteArgs {
  origin: string
  target: string
}

export interface TransferRouteArgs {
  resource: string
  target: string
}
