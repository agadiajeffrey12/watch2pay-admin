import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

type CategoryFormProps = {
  formData: {
    name: string;
    slug: string;
    description: string;
    image: string;
    color: string;
    status: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    name: string;
    slug: string;
    description: string;
    image: string;
    color: string;
    status: string;
  }>>;
  onSubmit: () => void;
  submitText: string;
  onCancel: () => void;
  generateSlug: (name: string) => string;
};

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  formData, 
  setFormData, 
  onSubmit, 
  submitText, 
  onCancel, 
  generateSlug 
}) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Category Name
      </label>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => {
          setFormData({
            ...formData,
            name: e.target.value,
            slug: generateSlug(e.target.value)
          });
        }}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter category name"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Slug
      </label>
      <input
        type="text"
        value={formData.slug}
        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="category-slug"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Description
      </label>
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter category description"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Category Color
      </label>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
        />
        <input
          type="text"
          value={formData.color}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#3b82f6"
        />
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Status
      </label>
      <select
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <div className="flex items-center justify-center flex-col gap-3 border border-dashed py-4">
      <h2>Upload a photo</h2>
      <Button className="px-6 py-3 bg-blue-600 rounded-md text-white">Select</Button>
    </div>

    <div className="flex justify-end space-x-3 pt-4">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        Cancel
      </button>
      <button
        onClick={onSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <Save size={16} />
        <span>{submitText}</span>
      </button>
    </div>
  </div>
);

export default CategoryForm;