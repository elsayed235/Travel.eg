import { db } from '../db/database';
import { SupplierEntity, ProductSkuEntity } from '../db/schema';

export class SupplierRepository {
  public getAllSuppliers(): SupplierEntity[] {
    return [...db.suppliers];
  }

  public getSupplierById(id: string): SupplierEntity | undefined {
    return db.suppliers.find(s => s.id === id);
  }

  public getSuppliersByCategory(category: string): SupplierEntity[] {
    return db.suppliers.filter(s => s.category.toLowerCase() === category.toLowerCase());
  }

  public upsertSupplier(supplier: SupplierEntity): SupplierEntity {
    const idx = db.suppliers.findIndex(s => s.id === supplier.id);
    if (idx >= 0) {
      db.suppliers[idx] = supplier;
    } else {
      db.suppliers.push(supplier);
    }
    db.saveToDisk();
    return supplier;
  }

  public getSkusBySupplierId(supplierId: string): ProductSkuEntity[] {
    return db.productSkus.filter(s => s.supplierId === supplierId);
  }

  public upsertSku(sku: ProductSkuEntity): ProductSkuEntity {
    const idx = db.productSkus.findIndex(s => s.id === sku.id);
    if (idx >= 0) {
      db.productSkus[idx] = sku;
    } else {
      db.productSkus.push(sku);
    }
    db.saveToDisk();
    return sku;
  }
}

export const supplierRepository = new SupplierRepository();
