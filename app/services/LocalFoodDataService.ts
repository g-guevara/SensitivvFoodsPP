// app/services/LocalFoodDataService.ts
import { Product } from './openFoodFactsApi';
// No need to import Papa since we'll use a simpler CSV parsing approach

interface LocalSearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: Product[];
}

// Sample data to use instead of loading CSV
const SAMPLE_PRODUCTS: Product[] = [
  {
    code: '123456789',
    product_name: 'FrostyCream',
    brands: 'Ice Dream',
    ingredients_text: 'Milk, sugar, cream, vanilla extract',
    image_small_url: 'https://via.placeholder.com/100',
    categories: 'Dairy products',
    nutriments: {}
  },
  {
    code: '987654321',
    product_name: 'NutriFlakes',
    brands: 'HealthyStart',
    ingredients_text: 'Whole grain wheat, sugar, vitamins and minerals',
    image_small_url: 'https://via.placeholder.com/100',
    categories: 'Breakfast cereals',
    nutriments: {}
  },
  {
    code: '456789123',
    product_name: 'FizzUp',
    brands: 'BubblyCo',
    ingredients_text: 'Carbonated water, sugar, natural flavors, citric acid',
    image_small_url: 'https://via.placeholder.com/100',
    categories: 'Sodas',
    nutriments: {}
  },
  {
    code: '567891234',
    product_name: 'ChocoDelight',
    brands: 'SweetTreats',
    ingredients_text: 'Cocoa, sugar, milk powder, vegetable oil',
    image_small_url: 'https://via.placeholder.com/100',
    categories: 'Snacks',
    nutriments: {}
  },
  {
    code: '678912345',
    product_name: 'GrainBars',
    brands: 'NutriHealth',
    ingredients_text: 'Oats, honey, almonds, raisins',
    image_small_url: 'https://via.placeholder.com/100',
    categories: 'Snacks',
    nutriments: {}
  },
  {
    code: '789123456',
    product_name: 'VeggieCrisps',
    brands: 'CrunchGood',
    ingredients_text: 'Potatoes, vegetable oil, salt',
    image_small_url: 'https://via.placeholder.com/100',
    categories: 'Snacks',
    nutriments: {}
  },
  {
    code: '891234567',
    product_name: 'OrganicTea',
    brands: 'PureBrew',
    ingredients_text: 'Organic tea leaves, natural flavors',
    image_small_url: 'https://via.placeholder.com/100',
    categories: 'Beverages',
    nutriments: {}
  },
  {
    code: '912345678',
    product_name: 'FruitJuice',
    brands: 'FreshSqueeze',
    ingredients_text: 'Apple juice, orange juice, vitamin C',
    image_small_url: 'https://via.placeholder.com/100',
    categories: 'Beverages',
    nutriments: {}
  }
];

export class LocalFoodDataService {
  private static data: Product[] | null = null;
  private static isLoading = false;
  private static loadPromise: Promise<Product[]> | null = null;

  /**
   * Loads the product data
   */
  static async loadData(): Promise<Product[]> {
    if (this.data !== null) {
      return this.data;
    }

    if (this.isLoading) {
      return this.loadPromise!;
    }

    this.isLoading = true;
    this.loadPromise = new Promise(async (resolve) => {
      try {
        console.log('Loading sample product data...');
        
        // Using hardcoded sample data instead of loading CSV
        this.data = SAMPLE_PRODUCTS;
        this.isLoading = false;
        console.log(`Loaded ${SAMPLE_PRODUCTS.length} sample products`);
        resolve(SAMPLE_PRODUCTS);
      } catch (error) {
        console.error('Error loading data:', error);
        this.isLoading = false;
        this.data = SAMPLE_PRODUCTS;
        resolve(SAMPLE_PRODUCTS);
      }
    });

    return this.loadPromise;
  }

  /**
   * Searches products by query string
   */
  static async searchProducts(query: string, page: number = 1, pageSize: number = 20): Promise<LocalSearchResponse> {
    try {
      const products = await this.loadData();
      
      if (!query.trim()) {
        return { count: 0, page: 1, page_size: pageSize, products: [] };
      }

      const lowerQuery = query.toLowerCase();
      
      // Search for products that match the query in product_name or brands
      const matchedProducts = products.filter(product => {
        const productName = (product.product_name || '').toLowerCase();
        const brands = (product.brands || '').toLowerCase();
        
        return productName.includes(lowerQuery) || brands.includes(lowerQuery);
      });

      // Apply pagination
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const paginatedProducts = matchedProducts.slice(start, end);

      return {
        count: matchedProducts.length,
        page: page,
        page_size: pageSize,
        products: paginatedProducts
      };
    } catch (error) {
      console.error('Error searching products:', error);
      return { count: 0, page: 1, page_size: pageSize, products: [] };
    }
  }

  /**
   * Gets a product by its barcode
   */
  static async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const products = await this.loadData();
      return products.find(product => product.code === barcode) || null;
    } catch (error) {
      console.error('Error getting product by barcode:', error);
      return null;
    }
  }
}