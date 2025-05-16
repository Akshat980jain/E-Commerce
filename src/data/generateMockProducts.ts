import { Product } from '../types';

const categories = [
  'electronics',
  'clothing',
  'home',
  'beauty',
  'sports',
  'books',
  'toys',
  'automotive',
  'garden',
  'food'
];

const adjectives = [
  'Premium', 'Luxury', 'Essential', 'Classic', 'Modern',
  'Professional', 'Elegant', 'Durable', 'Compact', 'Advanced',
  'Smart', 'Portable', 'Wireless', 'Digital', 'Ergonomic'
];

const productTypes = {
  electronics: ['Smartphone', 'Laptop', 'Headphones', 'Smartwatch', 'Camera', 'Tablet', 'Speaker', 'Monitor', 'Keyboard', 'Mouse'],
  clothing: ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Sweater', 'Shoes', 'Socks', 'Hat', 'Scarf', 'Gloves'],
  home: ['Lamp', 'Pillow', 'Blanket', 'Vase', 'Clock', 'Mirror', 'Rug', 'Chair', 'Table', 'Cabinet'],
  beauty: ['Moisturizer', 'Shampoo', 'Perfume', 'Lipstick', 'Foundation', 'Serum', 'Mask', 'Cream', 'Lotion', 'Oil'],
  sports: ['Ball', 'Racket', 'Gloves', 'Shoes', 'Bag', 'Mat', 'Weights', 'Band', 'Bottle', 'Watch'],
  books: ['Novel', 'Cookbook', 'Biography', 'Textbook', 'Magazine', 'Comic', 'Journal', 'Guide', 'Manual', 'Dictionary'],
  toys: ['Puzzle', 'Doll', 'Car', 'Block', 'Game', 'Robot', 'Plush', 'Board Game', 'Card Game', 'Action Figure'],
  automotive: ['Charger', 'Mount', 'Cover', 'Light', 'Mat', 'Tool', 'Cleaner', 'Air Freshener', 'Oil', 'Filter'],
  garden: ['Plant', 'Pot', 'Tool Set', 'Seeds', 'Soil', 'Gloves', 'Hose', 'Fertilizer', 'Light', 'Decoration'],
  food: ['Snack', 'Drink', 'Sauce', 'Spice', 'Mix', 'Bar', 'Chips', 'Nuts', 'Candy', 'Coffee']
};

const descriptions = {
  electronics: 'High-quality electronic device with advanced features and reliable performance.',
  clothing: 'Comfortable and stylish clothing made from premium materials.',
  home: 'Beautiful home decor item that adds elegance to any room.',
  beauty: 'Premium beauty product for your daily skincare routine.',
  sports: 'Professional-grade sports equipment for optimal performance.',
  books: 'Engaging and informative reading material for all ages.',
  toys: 'Fun and educational toy that provides hours of entertainment.',
  automotive: 'Essential automotive accessory for your vehicle.',
  garden: 'High-quality gardening product for your outdoor space.',
  food: 'Delicious and healthy food item made with natural ingredients.'
};

const imageUrls = {
  electronics: [
    'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    'https://images.pexels.com/photos/4482891/pexels-photo-4482891.jpeg',
    'https://images.pexels.com/photos/1706694/pexels-photo-1706694.jpeg'
  ],
  clothing: [
    'https://images.pexels.com/photos/5698851/pexels-photo-5698851.jpeg',
    'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg',
    'https://images.pexels.com/photos/1306246/pexels-photo-1306246.jpeg'
  ],
  home: [
    'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg',
    'https://images.pexels.com/photos/1566308/pexels-photo-1566308.jpeg',
    'https://images.pexels.com/photos/1036936/pexels-photo-1036936.jpeg'
  ],
  beauty: [
    'https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg',
    'https://images.pexels.com/photos/3785170/pexels-photo-3785170.jpeg',
    'https://images.pexels.com/photos/3785156/pexels-photo-3785156.jpeg'
  ],
  sports: [
    'https://images.pexels.com/photos/4056531/pexels-photo-4056531.jpeg',
    'https://images.pexels.com/photos/4162579/pexels-photo-4162579.jpeg',
    'https://images.pexels.com/photos/4162577/pexels-photo-4162577.jpeg'
  ],
  books: [
    'https://images.pexels.com/photos/1907785/pexels-photo-1907785.jpeg',
    'https://images.pexels.com/photos/1907784/pexels-photo-1907784.jpeg',
    'https://images.pexels.com/photos/1907783/pexels-photo-1907783.jpeg'
  ],
  toys: [
    'https://images.pexels.com/photos/163696/toy-car-toy-box-mini-163696.jpeg',
    'https://images.pexels.com/photos/163695/toy-car-toy-box-mini-163695.jpeg',
    'https://images.pexels.com/photos/163694/toy-car-toy-box-mini-163694.jpeg'
  ],
  automotive: [
    'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg',
    'https://images.pexels.com/photos/1149830/pexels-photo-1149830.jpeg',
    'https://images.pexels.com/photos/1149829/pexels-photo-1149829.jpeg'
  ],
  garden: [
    'https://images.pexels.com/photos/1470171/pexels-photo-1470171.jpeg',
    'https://images.pexels.com/photos/1470170/pexels-photo-1470170.jpeg',
    'https://images.pexels.com/photos/1470169/pexels-photo-1470169.jpeg'
  ],
  food: [
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    'https://images.pexels.com/photos/1640776/pexels-photo-1640776.jpeg',
    'https://images.pexels.com/photos/1640775/pexels-photo-1640775.jpeg'
  ]
};

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generatePrice(): number {
  return Number((Math.random() * (999.99 - 1.99) + 1.99).toFixed(2));
}

function generateRating(): number {
  return Number((Math.random() * (5 - 3.5) + 3.5).toFixed(1));
}

function generateReviews(): number {
  return Math.floor(Math.random() * (1000 - 5) + 5);
}

function generateDiscount(): number {
  const shouldHaveDiscount = Math.random() < 0.3; // 30% chance of having a discount
  if (shouldHaveDiscount) {
    return Math.floor(Math.random() * (70 - 5) + 5);
  }
  return 0;
}

export function generateMockProducts(count: number): Product[] {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const category = getRandomElement(categories);
    const adjective = getRandomElement(adjectives);
    const productType = getRandomElement(productTypes[category as keyof typeof productTypes]);
    const name = `${adjective} ${productType}`;
    
    products.push({
      id: `prod_${i + 1}`,
      name,
      description: descriptions[category as keyof typeof descriptions],
      price: generatePrice(),
      image: getRandomElement(imageUrls[category as keyof typeof imageUrls]),
      category,
      inStock: Math.random() > 0.1, // 90% chance of being in stock
      rating: generateRating(),
      reviews: generateReviews(),
      discount: generateDiscount()
    });
  }

  return products;
}