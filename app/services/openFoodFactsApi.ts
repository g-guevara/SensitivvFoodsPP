// app/services/openFoodFactsApi.ts
const BASE_URL = 'https://world.openfoodfacts.org';

export interface Product {
  code: string;
  product_name: string;
  brands?: string;
  image_url?: string;
  image_small_url?: string;
  categories?: string;
  ingredients_text?: string;
  nutriments?: {
    [key: string]: number | string;
  };
}

export interface SearchResponse {
  count: number;
  page: number;
  page_size: number;
  products: Product[];
}

export class OpenFoodFactsApi {
  static async searchProducts(query: string, page: number = 1): Promise<SearchResponse> {
    try {
      if (!query.trim()) {
        return { count: 0, page: 1, page_size: 0, products: [] };
      }

      // Extended timeout to 30 seconds for very slow connections
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      // Simplified URL without complex parameters
      const searchUrl = `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=1&page=${page}`;

      console.log('Searching products with URL:', searchUrl);

      const response = await fetch(searchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
        mode: 'cors', // Explicitly set CORS mode
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        return { count: 0, page: 1, page_size: 0, products: [] };
      }
      
      const data = await response.json();
      
      // Ensure products array exists
      if (!data.products) {
        return { count: 0, page: 1, page_size: 0, products: [] };
      }
      
      console.log('Search successful, found products:', data.products.length);
      return data;
    } catch (error) {
      console.error('Error in searchProducts:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error('Request timed out after 30 seconds');
        } else if (error.message.includes('Network request failed')) {
          console.error('Network error - possibly CORS or connectivity issue');
        }
      }
      
      // Always return empty results instead of throwing
      return { count: 0, page: 1, page_size: 0, products: [] };
    }
  }

  // Get product by barcode
  static async getProductByBarcode(barcode: string): Promise<Product | null> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json`, {
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
        mode: 'cors',
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        return null;
      }
      
      const data = await response.json();
      return data.product;
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      return null;
    }
  }

  // Search products by category
  static async getProductsByCategory(category: string, page: number = 1): Promise<SearchResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(
        `${BASE_URL}/category/${encodeURIComponent(category)}.json?page=${page}`,
        { 
          headers: {
            'Accept': 'application/json',
          },
          signal: controller.signal,
          mode: 'cors',
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products by category');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return { count: 0, page: 1, page_size: 0, products: [] };
    }
  }
}