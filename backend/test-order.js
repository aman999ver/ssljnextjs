async function test() {
  const baseUrl = 'http://localhost:5001'; // Assuming port 5001

  // 1. Login
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password123' }) // Need a real user or register
  });
  
  if (loginRes.status === 400) {
    // try to register
    await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: 'Test', lastName: 'User', email: 'test@example.com', phone: '123', password: 'password123' })
    });
  }

  const loginRes2 = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
  });
  
  const loginData = await loginRes2.json();
  const token = loginData.token;
  console.log("Token:", token);

  // 2. Add to cart
  // Find a product
  const productsRes = await fetch(`${baseUrl}/api/admin/products`);
  const products = await productsRes.json();
  const productId = products[0]._id;

  await fetch(`${baseUrl}/api/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ productId, quantity: 1 })
  });
  console.log("Added to cart");

  // 3. Create order
  const orderRes = await fetch(`${baseUrl}/api/orders/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      shippingAddress: {
        fullName: 'Test User',
        phone: '123',
        address: '123 Test St',
        city: 'Test City'
      },
      paymentMethod: 'COD',
      notes: ''
    })
  });

  const orderData = await orderRes.text();
  console.log("Order Res:", orderRes.status, orderData);
}

test();
