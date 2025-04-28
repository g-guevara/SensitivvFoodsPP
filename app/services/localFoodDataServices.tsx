// app/services/localFoodDataService.ts

// Define interface similar to the Product interface from OpenFoodFactsApi
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
  
  // Hardcoded sample data to simulate CSV content
  // This will be replaced with actual CSV data once we can load it
  const sampleProducts: Product[] = [
    {
      code: "3017620425035",
      product_name: "Nutella",
      brands: "Ferrero",
      categories: "Spreads,Sweet spreads,Cocoa and hazelnuts spreads",
      image_small_url: "https://images.openfoodfacts.org/images/products/301/762/042/5035/front_en.432.100.jpg",
      ingredients_text: "Sugar, palm oil, hazelnuts 13%, fat-reduced cocoa powder 7.4%, skimmed milk powder 6.6%, whey powder, emulsifiers: lecithins [soy], vanillin."
    },
    {
      code: "5449000000996",
      product_name: "Coca-Cola",
      brands: "Coca-Cola",
      categories: "Beverages,Carbonated drinks,Sodas,Colas",
      image_small_url: "https://images.openfoodfacts.org/images/products/544/900/000/0996/front_en.291.100.jpg",
      ingredients_text: "Carbonated water, high fructose corn syrup, caramel color, phosphoric acid, natural flavors, caffeine."
    },
    {
      code: "8000500310427",
      product_name: "Kinder Bueno",
      brands: "Ferrero,Kinder",
      categories: "Snacks,Sweet snacks,Confectioneries,Chocolates,Filled chocolates",
      image_small_url: "https://images.openfoodfacts.org/images/products/800/050/031/0427/front_en.207.100.jpg",
      ingredients_text: "Milk chocolate 31.5% (sugar, cocoa butter, cocoa mass, skimmed milk powder, concentrated butter, emulsifier: lecithins (soy), vanillin), sugar, palm oil, wheat flour, hazelnuts (10.8%), skimmed milk powder, whole milk powder, chocolate (sugar, cocoa mass, cocoa butter, emulsifier: lecithins (soy), vanillin), fat-reduced cocoa powder, emulsifier: lecithins (soy), raising agents (sodium bicarbonate, ammonium bicarbonate), salt, vanillin."
    },
    {
      code: "8076809513722",
      product_name: "Barilla Spaghetti n.5",
      brands: "Barilla",
      categories: "Plant-based foods,Cereals and potatoes,Cereal grains,Pastas,Wheat pastas,Spaghetti",
      image_small_url: "https://images.openfoodfacts.org/images/products/807/680/951/3722/front_es.176.100.jpg",
      ingredients_text: "Durum wheat semolina, water."
    },
    {
      code: "3017620421006",
      product_name: "Ferrero Rocher",
      brands: "Ferrero",
      categories: "Snacks,Sweet snacks,Confectioneries,Chocolates,Filled chocolates",
      image_small_url: "https://images.openfoodfacts.org/images/products/301/762/042/1006/front_en.84.100.jpg",
      ingredients_text: "Milk chocolate (30%) (sugar, cocoa butter, cocoa mass, skimmed milk powder, concentrated butter, emulsifier: lecithins (soy), vanillin), hazelnuts (28.5%), sugar, palm oil, wheat flour, whey powder, fat-reduced cocoa powder, emulsifier: lecithins (soy), raising agent (sodium bicarbonate), salt, vanillin."
    },
    {
      code: "3033710065967",
      product_name: "Cristaline Natural Mineral Water",
      brands: "Cristaline",
      categories: "Beverages,Waters,Spring waters,Mineral waters,Natural mineral waters",
      image_small_url: "https://images.openfoodfacts.org/images/products/303/371/006/5967/front_en.42.100.jpg",
      ingredients_text: "Natural mineral water"
    },
    {
      code: "8000500037560",
      product_name: "Kinder Surprise",
      brands: "Ferrero,Kinder",
      categories: "Snacks,Sweet snacks,Confectioneries,Chocolates",
      image_small_url: "https://images.openfoodfacts.org/images/products/800/050/003/7560/front_en.84.100.jpg",
      ingredients_text: "Milk chocolate 47% (sugar, milk powder, cocoa butter, cocoa mass, emulsifier: lecithins (soy), vanillin), sugar, skimmed milk powder, palm oil, butter oil, emulsifier: lecithins (soy), vanillin."
    },
    {
      code: "3168930010265",
      product_name: "Lay's Classic Potato Chips",
      brands: "Lay's,PepsiCo",
      categories: "Snacks,Salty snacks,Chips and crisps,Potato chips",
      image_small_url: "https://images.openfoodfacts.org/images/products/316/893/001/0265/front_en.73.100.jpg",
      ingredients_text: "Potatoes, vegetable oil (sunflower, corn), salt."
    },
    {
      code: "80177418",
      product_name: "Original Cheerios",
      brands: "General Mills,Cheerios",
      categories: "Breakfast cereals,Cereals and potatoes,Cereals,Oat cereals",
      image_small_url: "https://images.openfoodfacts.org/images/products/80177418/front_en.7.100.jpg",
      ingredients_text: "Whole grain oats, corn starch, sugar, salt, tripotassium phosphate, vitamin E."
    },
    {
      code: "7622210449283",
      product_name: "Oreo",
      brands: "Mondelez,Nabisco",
      categories: "Snacks,Sweet snacks,Biscuits and cakes,Biscuits,Sandwich biscuits,Chocolate biscuits",
      image_small_url: "https://images.openfoodfacts.org/images/products/762/221/044/9283/front_en.344.100.jpg",
      ingredients_text: "Wheat flour, sugar, palm oil, fat-reduced cocoa powder 4.6%, wheat starch, glucose-fructose syrup, raising agents (potassium hydrogen carbonate, ammonium hydrogen carbonate, sodium hydrogen carbonate), salt, emulsifiers (soy lecithin, sunflower lecithin), flavor (vanillin)."
    },
    {
      code: "8001505005592",
      product_name: "San Pellegrino",
      brands: "San Pellegrino,Nestlé",
      categories: "Beverages,Waters,Mineral waters,Sparkling mineral waters",
      image_small_url: "https://images.openfoodfacts.org/images/products/800/150/500/5592/front_en.93.100.jpg",
      ingredients_text: "Natural mineral water, carbon dioxide."
    },

    {
      code: "5000112637922",
      product_name: "Guinness Draught",
      brands: "Guinness",
      categories: "Beverages,Alcoholic beverages,Beers,Stouts",
      image_small_url: "https://images.openfoodfacts.org/images/products/500/011/263/7922/front_en.30.100.jpg",
      ingredients_text: "Water, malted barley, barley, hops, yeast."
    },

    {
      code: "9002490100070",
      product_name: "Red Bull Energy Drink",
      brands: "Red Bull",
      categories: "Beverages,Carbonated drinks,Energy drinks",
      image_small_url: "https://images.openfoodfacts.org/images/products/900/249/010/0070/front_en.142.100.jpg",
      ingredients_text: "Water, sucrose, glucose, acidity regulator (sodium citrates), carbon dioxide, taurine (0.4%), acidity regulator (magnesium carbonate), caffeine (0.03%), vitamins (niacin, pantothenic acid, B6, B12), flavorings, colors (caramel, riboflavin)."
    }
  ];
  
  // Cache for loaded data
  let cachedProducts: Product[] = [...sampleProducts];
  let isDataLoaded = true;
  
  export class LocalFoodDataService {
    static async loadData(): Promise<void> {
      if (isDataLoaded) return;
  
      try {
        // In a real implementation, this would load data from the CSV file
        // Since we're working with hardcoded data for now, we'll just use our sample
        console.log(`Loaded ${cachedProducts.length} products from sample data`);
        isDataLoaded = true;
      } catch (error) {
        console.error('Error loading local food data:', error);
        throw error;
      }
    }
  
    static async searchProducts(query: string, page: number = 1, pageSize: number = 20): Promise<SearchResponse> {
      try {
        // Ensure data is loaded
        if (!isDataLoaded) {
          await this.loadData();
        }
  
        // Convert query to lowercase for case-insensitive search
        const lowerQuery = query.toLowerCase().trim();
        
        // Filter products based on the query
        const filteredProducts = cachedProducts.filter(product => {
          const productName = (product.product_name || '').toLowerCase();
          const brands = (product.brands || '').toLowerCase();
          const categories = (product.categories || '').toLowerCase();
          
          return productName.includes(lowerQuery) || 
                 brands.includes(lowerQuery) || 
                 categories.includes(lowerQuery);
        });
        
        // Calculate pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        
        // Construct and return the response
        return {
          count: filteredProducts.length,
          page,
          page_size: pageSize,
          products: paginatedProducts,
        };
      } catch (error) {
        console.error('Error searching local products:', error);
        return { count: 0, page: 1, page_size: pageSize, products: [] };
      }
    }
  }