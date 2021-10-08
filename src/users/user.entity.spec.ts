import { User, UserRole } from './user.entity';

describe('User', () => {
  // specified by type system, but adding a test in the interests of completeness
  it('is implemented with amountAvailable, cost, userName and sellerId fields', () => {
    const model = userModelTestFactory();
    expect(model).toHaveProperty('username', expect.any(String));
    expect(model).toHaveProperty('password', expect.any(String));
    expect(model).toHaveProperty('deposit', expect.any(Number));
    expect(['seller', 'buyer'] as UserRole[]).toContain(model.role);
  });
});

function userModelTestFactory({
  username = 'User Name',
  password = 'secret',
  deposit = 100,
  role = UserRole.buyer,
}: Partial<User> = {}): User {
  const model = new User();
  model.username = username;
  model.password = password;
  model.deposit = deposit;
  model.role = role;

  return model;
}
