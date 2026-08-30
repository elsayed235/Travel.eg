import { db } from '../../server/db/database';
import { InMemoryPersistenceAdapter } from '../../server/db/adapters/InMemoryPersistenceAdapter';
import type { ProductSkuEntity } from '../../server/db/schema';

/**
 * Drops the whole state rather than clearing individual arrays, so a test can
 * never inherit a row a previous test forgot about.
 */
export function resetDb(): void {
  db.setAdapter(new InMemoryPersistenceAdapter());
}

export function seedSku(over: Partial<ProductSkuEntity> = {}): ProductSkuEntity {
  const sku: ProductSkuEntity = {
    id: 'SKU-DIVE-TEST',
    supplierId: 'SUP-TEST',
    serviceType: 'diving',
    title: 'Test Blue Hole Dive',
    titleAr: 'غطسة اختبارية',
    description: 'Fixture SKU.',
    basePriceEGP: 1200,
    currency: 'EGP',
    maxCapacityPerSlot: 8,
    active: true,
    cancellationPolicyHours: 24,
    ...over
  };
  db.productSkus.push(sku);
  return sku;
}

let holdSeq = 0;
export const nextIdempotencyKey = () => `IDK-TEST-${++holdSeq}`;
