import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FiUpload, FiX } from 'react-icons/fi';
import api from '../../services/api';

const AddProduct = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    category: '',
    stock: '',
    sku: '',
    tags: '',
    isFeatured: false,
    isActive: true,
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
  });

  // Upload image mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file) => {
      const formData = new FormData();
      formData.append('image', file);
      const response = await api.post('/upload/product', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      setUploadedImageUrl(data.data.url);
      toast.success('Image uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to upload image');
      setImageFile(null);
      setImagePreview('');
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (productData) => {
      const response = await api.post('/products', productData);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Product created successfully!');
      navigate('/admin/products');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Failed to create product');
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only image files (JPEG, PNG, GIF, WebP) are allowed');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload immediately
      uploadImageMutation.mutate(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setUploadedImageUrl('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!uploadedImageUrl) {
      toast.error('Please upload a product image');
      return;
    }

    // Prepare product data
    const productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
      category: formData.category,
      stock: parseInt(formData.stock),
      sku: formData.sku || undefined,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
      images: [
        {
          url: uploadedImageUrl,
          alt: formData.name,
          isPrimary: true,
        }
      ],
      isFeatured: formData.isFeatured,
      isActive: formData.isActive,
    };

    createProductMutation.mutate(productData);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <button
          onClick={() => navigate('/admin/products')}
          className="btn btn-secondary"
        >
          Back to Products
        </button>
      </div>

      <div className="card max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Image *
            </label>
            
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadImageMutation.isPending}
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <FiUpload className="text-4xl text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Click to upload product image
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, WebP up to 5MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-64 h-64 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  disabled={uploadImageMutation.isPending}
                >
                  <FiX />
                </button>
                {uploadImageMutation.isPending && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-sm">Uploading...</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              required
              placeholder="e.g., Wireless Headphones"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows="4"
              required
              placeholder="Detailed product description..."
            />
          </div>

          {/* Price Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Price * ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input"
                step="0.01"
                min="0"
                required
                placeholder="99.99"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Compare Price ($)
              </label>
              <input
                type="number"
                name="comparePrice"
                value={formData.comparePrice}
                onChange={handleChange}
                className="input"
                step="0.01"
                min="0"
                placeholder="129.99"
              />
              <p className="text-xs text-gray-500 mt-1">
                Original price for showing discount
              </p>
            </div>
          </div>

          {/* Category and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Category</option>
                {categoriesData?.data?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="input"
                min="0"
                required
                placeholder="50"
              />
            </div>
          </div>

          {/* SKU and Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                SKU (Stock Keeping Unit)
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="input"
                placeholder="WH-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="input"
                placeholder="electronics, wireless, audio"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm">Featured Product (Show on homepage)</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm">Active (Visible to customers)</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={createProductMutation.isPending || uploadImageMutation.isPending}
              className="btn btn-primary flex-1"
            >
              {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
            </button>
            
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Quick Tips */}
      <div className="card mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold mb-2">💡 Quick Tips:</h3>
        <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
          <li>• Upload high-quality product images (max 5MB)</li>
          <li>• Supported formats: JPEG, PNG, GIF, WebP</li>
          <li>• Set a compare price higher than the regular price to show discounts</li>
          <li>• Mark products as "Featured" to display them on the homepage</li>
          <li>• Add relevant tags to improve search functionality</li>
        </ul>
      </div>
    </div>
  );
};

export default AddProduct;
