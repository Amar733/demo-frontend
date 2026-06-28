'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { allCategories } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';

export default function AdminPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // Form state
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    stock: 0,
    collection: '',
    isNewArrival: false,
    specialPrice: undefined,
    gender: undefined,
    productType: 'perfume',
  });

  useEffect(() => {
    if (!loading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isAuthenticated, loading, router]);

  useEffect(() => {
    // Load products from localStorage
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Initialize with empty array if no products exist
      setProducts([]);
    }
  }, []);

  const saveProducts = (updatedProducts: Product[]) => {
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setIsEditing(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      stock: 0,
      collection: '',
      isNewArrival: false,
      specialPrice: undefined,
      gender: undefined,
      productType: 'perfume',
    });
  };

  const handleEdit = (product: Product) => {
    setIsEditing(true);
    setIsCreating(false);
    setEditingProduct(product);
    setFormData(product);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products.filter((p) => p.id !== id);
      saveProducts(updatedProducts);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.description || formData.price === 0) {
      alert('Please fill in all required fields');
      return;
    }

    if (isCreating) {
      // Create new product
      const newProduct: Product = {
        ...formData,
        id: Date.now().toString(),
      } as Product;
      saveProducts([...products, newProduct]);
    } else if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id ? { ...formData, id: editingProduct.id } as Product : p
      );
      saveProducts(updatedProducts);
    }

    // Reset form
    setIsEditing(false);
    setIsCreating(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      category: '',
      stock: 0,
      collection: '',
      isNewArrival: false,
      specialPrice: undefined,
      gender: undefined,
      productType: 'perfume',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || product.productType === filterType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel - Product Management</h1>
          <Button onClick={handleCreate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add New Product
          </Button>
        </div>

        {/* Create/Edit Form */}
        {(isCreating || isEditing) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{isCreating ? 'Create New Product' : 'Edit Product'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Price (in cents) *</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                    placeholder="Price in cents (e.g., 1999 for $19.99)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Product Type *</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.productType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        productType: e.target.value as Product['productType'],
                        category: '',
                      })
                    }
                  >
                    <option value="perfume">Perfume</option>
                    <option value="tea">Tea</option>
                    <option value="coffee">Coffee</option>
                    <option value="powerbank">Power Bank</option>
                    <option value="earbuds">Earbuds</option>
                    <option value="toy">Toy</option>
                    <option value="accessory">Accessory</option>
                    <option value="bottle">Bottle</option>
                    <option value="study">Study</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {formData.productType &&
                      allCategories[formData.productType as keyof typeof allCategories]?.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Stock *</label>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    placeholder="Stock quantity"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL *</label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Collection</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.collection || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, collection: e.target.value || undefined })
                    }
                  >
                    <option value="">None</option>
                    <option value="summer">Summer</option>
                    <option value="royal">Royal</option>
                    <option value="special-pricing">Special Pricing</option>
                    <option value="new-arrivals">New Arrivals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Gender</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={formData.gender || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        gender: e.target.value ? (e.target.value as 'male' | 'female' | 'unisex') : undefined,
                      })
                    }
                  >
                    <option value="">None</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Special Price (in cents)</label>
                  <Input
                    type="number"
                    value={formData.specialPrice || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialPrice: e.target.value ? parseInt(e.target.value) : undefined,
                      })
                    }
                    placeholder="Optional discounted price"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival || false}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    id="isNewArrival"
                  />
                  <label htmlFor="isNewArrival" className="text-sm font-medium">
                    Mark as New Arrival
                  </label>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Description *</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Product description"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <Button onClick={handleSave} className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Product
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex items-center gap-2">
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Search</label>
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Filter by Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="perfume">Perfume</option>
                  <option value="tea">Tea</option>
                  <option value="coffee">Coffee</option>
                  <option value="powerbank">Power Bank</option>
                  <option value="earbuds">Earbuds</option>
                  <option value="toy">Toy</option>
                  <option value="accessory">Accessory</option>
                  <option value="bottle">Bottle</option>
                  <option value="study">Study</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredProducts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-gray-500">
                No products found. Click "Add New Product" to create one.
              </CardContent>
            </Card>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <div>
                          <span className="font-medium">Price:</span> ${(product.price / 100).toFixed(2)}
                        </div>
                        <div>
                          <span className="font-medium">Stock:</span> {product.stock}
                        </div>
                        <div>
                          <span className="font-medium">Type:</span> {product.productType}
                        </div>
                        <div>
                          <span className="font-medium">Category:</span> {product.category}
                        </div>
                        {product.specialPrice && (
                          <div className="text-green-600">
                            <span className="font-medium">Special:</span> $
                            {(product.specialPrice / 100).toFixed(2)}
                          </div>
                        )}
                        {product.collection && (
                          <div>
                            <span className="font-medium">Collection:</span> {product.collection}
                          </div>
                        )}
                        {product.gender && (
                          <div>
                            <span className="font-medium">Gender:</span> {product.gender}
                          </div>
                        )}
                        {product.isNewArrival && (
                          <div className="text-blue-600 font-medium">New Arrival</div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(product)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(product.id)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Product Count */}
        <div className="mt-6 text-center text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
}
