import { Product } from './product.entity';

describe('Product', () => {
  // specified by type system, but adding a test in the interests of completeness
  it('is implemented with amountAvailable, cost, productName and sellerId fields', () => {
    const model = productModelTestFactory();
    expect(model).toHaveProperty('amountAvailable', expect.any(Number));
    expect(model).toHaveProperty('cost', expect.any(Number));
    expect(model).toHaveProperty('productName', expect.any(String));
    expect(model).toHaveProperty('sellerId', expect.any(Number));
  });
});

function productModelTestFactory({
  productName = 'Product Name',
  cost = 100,
  amountAvailable = 5,
  sellerId = -1,
}: Partial<Product> = {}): Product {
  const model = new Product();
  model.productName = productName;
  model.cost = cost;
  model.amountAvailable = amountAvailable;
  model.sellerId = sellerId;

  return model;
}
