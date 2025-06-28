
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';

const Categories = () => {
  const categories = [
    {
      name: "Electronics",
      description: "Latest gadgets and tech accessories",
      image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=300&fit=crop",
      productCount: 145,
      featured: true
    },
    {
      name: "Clothing",
      description: "Fashion for men and women",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      productCount: 289,
      featured: true
    },
    {
      name: "Home & Garden",
      description: "Everything for your home",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      productCount: 167,
      featured: true
    },
    {
      name: "Sports & Fitness",
      description: "Gear up for your active lifestyle",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      productCount: 98,
      featured: false
    },
    {
      name: "Books & Media",
      description: "Knowledge and entertainment",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
      productCount: 234,
      featured: false
    },
    {
      name: "Beauty & Health",
      description: "Personal care essentials",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      productCount: 187,
      featured: false
    },
    {
      name: "Toys & Games",
      description: "Fun for all ages",
      image: "https://images.unsplash.com/photo-1558060370-d2cdb0d8b200?w=400&h=300&fit=crop",
      productCount: 76,
      featured: false
    },
    {
      name: "Food & Beverages",
      description: "Gourmet treats and essentials",
      image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=400&h=300&fit=crop",
      productCount: 123,
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        {/* <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our diverse range of products organized by category. Find exactly what you're looking for.
          </p>
        </div> */}

        {/* Featured Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.filter(cat => cat.featured).map((category) => (
              <Card key={category.name} className="group cursor-pointer hover:shadow-lg transition-all duration-300">
                <div className="relative overflow-hidden bg-gray-100 rounded-t-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.productCount} products</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-gray-600">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* All Categories */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Card key={category.name} className="group cursor-pointer hover:shadow-md transition-all duration-300">
                <div className="relative overflow-hidden bg-gray-100 rounded-t-lg">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                  <p className="text-xs text-blue-600 font-medium">{category.productCount} products</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Categories;
