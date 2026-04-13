import {vehiclesSubscriptionClient} from '../../../graphql/graphql-client';
import {
  ServiceJourneyDocument,
  ServiceJourneySubscription,
} from './vehicles-gql/service-journey-subscription.graphql-gen';
import WebSocket from 'ws';
import {Subscription} from 'zen-observable-ts';

interface PoolEntry {
  clients: Set<WebSocket.WebSocket>;
  upstream: Subscription;
}

/**
 * Shares a single upstream Entur vehicle subscription per serviceJourneyId
 * across all customer WebSocket connections on this pod.
 *
 * This is an in-process pool — each K8s pod maintains its own. With N pods
 * and M customers watching the same vehicle, this reduces upstream
 * subscriptions from M to at most N (typically M >> N).
 */
class VehicleSubscriptionPool {
  private pool = new Map<string, PoolEntry>();

  subscribe(serviceJourneyId: string, ws: WebSocket.WebSocket): void {
    const existing = this.pool.get(serviceJourneyId);

    if (existing) {
      existing.clients.add(ws);
      return;
    }

    const clients = new Set<WebSocket.WebSocket>([ws]);

    // ApolloClient.subscribe() returns an Observable (lazy, doesn't start yet).
    // Observable.subscribe() activates it and returns a Subscription handle.
    const upstream = vehiclesSubscriptionClient
      .subscribe({
        query: ServiceJourneyDocument,
        fetchPolicy: 'no-cache',
        variables: {serviceJourneyId},
      })
      .subscribe({
        next: (value) => {
          const data = value.data as ServiceJourneySubscription;
          const vehicle = data.vehicles?.find(
            (v) => v.serviceJourney?.id === serviceJourneyId,
          );
          if (!vehicle) return;
          const message = JSON.stringify(vehicle);
          for (const client of clients) {
            if (client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
          }
        },
        error: (err) => {
          console.error(
            `Upstream subscription error for ${serviceJourneyId}: ${err}`,
          );
          this.pool.delete(serviceJourneyId);
        },
      });

    this.pool.set(serviceJourneyId, {clients, upstream});
  }

  unsubscribe(serviceJourneyId: string, ws: WebSocket.WebSocket): void {
    const entry = this.pool.get(serviceJourneyId);
    if (!entry) return;

    entry.clients.delete(ws);

    if (entry.clients.size === 0) {
      entry.upstream.unsubscribe();
      this.pool.delete(serviceJourneyId);
    }
  }
}

export const vehicleSubscriptionPool = new VehicleSubscriptionPool();
