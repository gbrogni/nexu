import { AggregateRoot } from '../entities/aggregate-root';
import { UniqueEntityID } from '../entities/unique-entity-id';
import { DomainEvent } from './domain-event';

type DomainEventCallback<T extends DomainEvent = DomainEvent> = (
  event: T,
) => void | Promise<void>;

export class DomainEvents {
  private static handlersMap: Record<string, DomainEventCallback[]> = {};
  private static markedAggregates: AggregateRoot<any>[] = [];

  public static shouldRun = true;

  public static markAggregateForDispatch(aggregate: AggregateRoot<any>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  private static async dispatchAggregateEvents(aggregate: AggregateRoot<any>) {
    for (const event of aggregate.domainEvents) {
      await this.dispatch(event);
    }
  }

  private static removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<any>) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));
    if (index >= 0) this.markedAggregates.splice(index, 1);
  }

  private static findMarkedAggregateByID(id: UniqueEntityID): AggregateRoot<any> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  public static async dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = this.findMarkedAggregateByID(id);

    if (!aggregate) return;

    await this.dispatchAggregateEvents(aggregate);
    aggregate.clearEvents();
    this.removeAggregateFromMarkedDispatchList(aggregate);
  }

  public static register(callback: DomainEventCallback, eventClassName: string) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap;

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(callback);
  }

  public static clearHandlers() {
    this.handlersMap = {};
  }

  public static clearMarkedAggregates() {
    this.markedAggregates = [];
  }

  private static async dispatch(event: DomainEvent) {
    if (!this.shouldRun) return;

    const eventClassName = event.constructor.name;
    const handlers = this.handlersMap[eventClassName] ?? [];

    for (const handler of handlers) {
      try {
        await handler(event as any);
      } catch (err) {
        console.error(`[DomainEvents] handler error for ${eventClassName}`, err);
      }
    }
  }
}