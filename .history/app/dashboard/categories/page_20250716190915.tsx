'use client'
import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Filter,
  Download,
  Upload,
  Grid,
  List,
  X,
  Save,
  Image as ImageIcon,
  Tag,
  Calendar
} from 'lucide-react';
import Modal from '@/components/reuseables/Modals';
import { useCreateVideoCategory, useVideoCategories } from '@/hooks/useVideoCategory';
import CategoryForm from '@/components/layouts/main/categories/createCategoryForm';

const CategoriesPage = () => {
  // ALL HOOKS MUST BE DECLARED AT THE TOP, BEFORE ANY CONDITIONAL RETURNS
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  
  type Category = {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string;
    movieCount: number;
    status: string;
    createdAt: string;
    color: string;
  };
  
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Custom hooks
  const { createVideoCategory, isLoading, isSuccess, isError, error } = useCreateVideoCategory();
  const {data, isLoading:loadingVideoCategories, error:loadingVideoCategoriesError} = useVideoCategories();
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    color: '#3b82f6',
    status: 'active'
  });
  
  // Static categories (you might want to replace this with data from useVideoCategories)
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Action',
      slug: 'action',
      description: 'High-octane movies with intense sequences',
      image: '/api/placeholder/300/200',
      movieCount: 245,
      status: 'active',
      createdAt: '2024-01-15',
      color: '#ef4444'
    },
    {
      id: 2,
      name: 'Comedy',
      slug: 'comedy',
      description: 'Funny movies that make you laugh',
      image: '/api/placeholder/300/200',
      movieCount: 189,
      status: 'active',
      createdAt: '2024-01-14',
      color: '#f59e0b'
    },
    {
      id: 3,
      name: 'Drama',
      slug: 'drama',
      description: 'Serious movies with character development',
      image: '/api/placeholder/300/200',
      movieCount: 312,
      status: 'active',
      createdAt: '2024-01-13',
      color: '#8b5cf6'
    },
    {
      id: 4,
      name: 'Horror',
      slug: 'horror',
      description: 'Scary movies that will keep you up at night',
      image: '/api/placeholder/300/200',
      movieCount: 156,
      status: 'active',
      createdAt: '2024-01-12',
      color: '#dc2626'
    },
    {
      id: 5,
      name: 'Romance',
      slug: 'romance',
      description: 'Love stories and romantic comedies',
      image: '/api/placeholder/300/200',
      movieCount: 203,
      status: 'inactive',
      createdAt: '2024-01-11',
      color: '#ec4899'
    },
    {
      id: 6,
      name: 'Sci-Fi',
      slug: 'sci-fi',
      description: 'Science fiction and futuristic movies',
      image: '/api/placeholder/300/200',
      movieCount: 167,
      status: 'active',
      createdAt: '2024-01-10',
      color: '#06b6d4'
    }
  ]);

  // NOW YOU CAN DO CONDITIONAL RETURNS AFTER ALL HOOKS ARE DECLARED
  if (loadingVideoCategories) {
    return <div className="text-center p-4">Loading categories...</div>;
  }

  if (loadingVideoCategoriesError) {
    return <div className="text-center p-4 text-red-500">Error loading categories: {loadingVideoCategoriesError.message}</div>;
  }

  console.log(data?.data);
  useEffect(()=>{
    if(data && (data as any)?.data?.videoCategories) {
      setCategories((data as any)?.data?.videoCategories.map((cat: any, index: number) => ({
        id: index + 1, 
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        image: cat.category_image || '/api/placeholder/300/200',
        movieCount: cat.movieCount || 0,
        status: cat.isActive ? 'active' : 'inactive',
        createdAt: new Date(cat.createdAt).toLocaleDateString(),
        color: cat.category_color || '#3b82f6'
      })));
    }
  },[data])

  // Helper functions
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      color: '#3b82f6',
      status: 'active'
    });
  };

  const handleCreateCategory = async () => {
    try {
      await createVideoCategory({
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        category_image: formData.image,
        category_color: formData.color,
        isActive: formData.status
      });
      // setIsCreateModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  const handleEditCategory = () => {
    setCategories(categories.map(cat => 
      selectedCategory && cat.id === selectedCategory.id ? { ...selectedCategory, ...formData } : cat
    ));
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteCategory = () => {
    setCategories(categories.filter(cat => cat.id !== selectedCategory?.id));
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      color: category.color,
      status: category.status
    });
    setIsEditModalOpen(true);
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleCancel = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    resetForm();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Categories</h1>
          <p className="text-gray-600">Manage your movie categories and genres</p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download size={16} />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Upload size={16} />
            <span>Import</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Categories</p>
              <p className="text-2xl font-bold text-gray-800">{categories.length}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Tag className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Categories</p>
              <p className="text-2xl font-bold text-gray-800">{categories.filter(cat => cat.status === 'active').length}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Eye className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Movies</p>
              <p className="text-2xl font-bold text-gray-800">{categories.reduce((sum, cat) => sum + cat.movieCount, 0)}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <ImageIcon className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Movies/Category</p>
              <p className="text-2xl font-bold text-gray-800">{Math.round(categories.reduce((sum, cat) => sum + cat.movieCount, 0) / categories.length)}</p>
            </div>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            <span>Filter</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Categories Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: category.color }}
                >
                  <Tag className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-800">{category.name}</h3>
                  <div className="relative">
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{category.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="font-medium text-gray-800">{category.movieCount}</span>
                      <span className="text-gray-500 ml-1">movies</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      category.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {category.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(category)}
                      className="p-1 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategory(category);
                        setIsDeleteModalOpen(true);
                      }}
                      className="p-1 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Movies</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: category.color }}
                        >
                          <Tag className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{category.name}</p>
                          <p className="text-sm text-gray-500">/{category.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                      {category.description}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 font-medium">
                      {category.movieCount}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        category.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-1 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-1 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Category"
      >
        <CategoryForm 
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleCreateCategory} 
          submitText="Create Category"
          onCancel={handleCancel}
          generateSlug={generateSlug}
        />
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Category"
      >
        <CategoryForm 
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditCategory} 
          submitText="Update Category"
          onCancel={handleCancel}
          generateSlug={generateSlug}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete the category "{selectedCategory?.name}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCategory}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriesPage;