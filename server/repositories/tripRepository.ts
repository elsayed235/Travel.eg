import { db } from '../db/database';
import { TripEntity, TripItemEntity } from '../db/schema';

export class TripRepository {
  public getAllTrips(): TripEntity[] {
    return [...db.trips];
  }

  public getTripById(id: string): TripEntity | undefined {
    return db.trips.find(t => t.id === id);
  }

  public getTripsByUserId(userId: string): TripEntity[] {
    return db.trips.filter(t => t.userId === userId);
  }

  public upsertTrip(trip: TripEntity): TripEntity {
    const idx = db.trips.findIndex(t => t.id === trip.id);
    if (idx >= 0) {
      db.trips[idx] = trip;
    } else {
      db.trips.unshift(trip);
    }
    db.saveToDisk();
    return trip;
  }

  public getTripItems(tripId: string): TripItemEntity[] {
    return db.tripItems.filter(item => item.tripId === tripId);
  }

  public upsertTripItem(item: TripItemEntity): TripItemEntity {
    const idx = db.tripItems.findIndex(i => i.id === item.id);
    if (idx >= 0) {
      db.tripItems[idx] = item;
    } else {
      db.tripItems.push(item);
    }
    db.saveToDisk();
    return item;
  }

  public removeTripItem(itemId: string): boolean {
    const idx = db.tripItems.findIndex(i => i.id === itemId);
    if (idx >= 0) {
      db.tripItems.splice(idx, 1);
      db.saveToDisk();
      return true;
    }
    return false;
  }
}

export const tripRepository = new TripRepository();
