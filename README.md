# QuickKart

## Backend Information

The backend is deployed at: `https://quickkart-jawy.onrender.com`

## API Endpoints

When connecting to the backend, use the following URL structure:

```
https://quickkart-jawy.onrender.com/api/[endpoint]
```

For example:
- Products: `https://quickkart-jawy.onrender.com/api/products`
- Product by ID: `https://quickkart-jawy.onrender.com/api/products/123`
- User Authentication: `https://quickkart-jawy.onrender.com/api/auth/login`

## Using the API in Your Code

The API URL is configured in `src/config/api.ts`. All API requests should use the API utility functions in `src/utils/api.ts` to ensure proper error handling and consistent URL formatting.

Example usage:

```typescript
import api from '../utils/api';

// Get all products
const getProducts = async () => {
  try {
    const products = await api.get('/api/products');
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// Create a new order
const createOrder = async (orderData) => {
  try {
    const response = await api.post('/api/orders', orderData);
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
```

## Local Development

When developing locally, you can still connect to the deployed backend by using the configured API URL. If you need to use a local backend during development, you can modify the `API_URL` in `src/config/api.ts`. 