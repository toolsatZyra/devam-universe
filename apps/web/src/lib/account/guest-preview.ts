export const GUEST_GATEWAY_LIMIT = 2;
export const GUEST_SARTHI_EXCHANGE_LIMIT = 1;

export function canGuestOpenGateway(
  visitedGatewayIds: ReadonlySet<string>,
  gatewayId: string,
  signedIn: boolean,
): boolean {
  return signedIn || visitedGatewayIds.has(gatewayId) || visitedGatewayIds.size < GUEST_GATEWAY_LIMIT;
}

export function canGuestAskSarthi(completedExchangeCount: number, signedIn: boolean): boolean {
  return signedIn || completedExchangeCount < GUEST_SARTHI_EXCHANGE_LIMIT;
}
