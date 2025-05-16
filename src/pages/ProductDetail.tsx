import React from 'react';
import { useParams } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../hooks/useCart';

function ProductDetail() {
  const { id } = useParams();
  const { getProduct } = useProducts();
  const { addToCart } = useCart();
  const product = getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-2xl font-semibold text-gray-900">₹{product.price.toFixed(2)}</p>
            <div className="prose prose-sm text-gray-600">
              <p>{product.description}</p>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-200"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>

            {/* Additional Product Information */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <dl className="space-y-4">
                <div>
                  <dt className="font-medium text-gray-900">Availability</dt>
                  <dd className="text-gray-600">
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-900">Category</dt>
                  <dd className="text-gray-600">{product.category}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;