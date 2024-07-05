import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAddProductMutation } from '../../../Services/productServices';
import ReactImageUploading, { ImageListType } from 'react-images-uploading'; // Import ReactImageUploading and ImageListType
import { Product } from '../../../Model/Types'; // Assuming Product type is imported

// Define a type for the error response
interface ErrorResponse {
  success: boolean;
  message: string;
  error?: Record<string, string[]>; // Assuming validation errors are in this format
}

type Props = {
  open: boolean;
  onClose: () => void;
  onAddProduct: (newProduct: Product) => Promise<void>; // Define onAddProduct prop
};

const AddProductDialog: React.FC<Props> = ({ open, onClose, onAddProduct }) => {
  const [formData, setFormData] = useState({
    productName: '',
    brand: '',
    price: '',
    rating: '',
    image: null as File | null,
  });
  const [addProduct, { isLoading }] = useAddProductMutation();

  // State and function for managing images
  const [images, setImages] = useState<ImageListType>([]); // Use ImageListType for images state

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
    if (imageList.length > 0) {
      setFormData({
        ...formData,
        image: imageList[0].file || null,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const form = new FormData();
    form.append('productName', formData.productName);
    form.append('brand', formData.brand);
    form.append('price', formData.price);
    form.append('rating', formData.rating);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const response = await addProduct(form).unwrap();
      toast.success('Product added successfully!');
      onClose();
      // Call the onAddProduct callback with the new product data
      if (response && response.product) {
        onAddProduct(response.product);
      }
    } catch (error) {
      // Check if 'error' has expected properties
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        const err = error as ErrorResponse;
        const errorMessage = err.message || 'Error adding product. Please try again.';
        toast.error(errorMessage);

        // Handle validation errors
        if (err.error) {
          Object.keys(err.error).forEach((key) => {
            const fieldErrors = err.error?.[key];
            if (fieldErrors && fieldErrors.length > 0) {
              fieldErrors.forEach((error) => {
                toast.error(`${key}: ${error}`);
              });
            }
          });
        }
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="add-product-dialog-title" maxWidth="sm" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="productName">Product Name*</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="brand">Brand Name*</label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="price">Price*</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rating">Rating*</label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-gray-700 font-bold mb-2">
              Upload Image*
            </label>
            <ReactImageUploading
              value={images}
              onChange={onChange}
              dataURLKey="data_url"
              multiple={false}
              maxNumber={1}
            >
              {({ imageList, onImageUpload }) => (
                <div className="image-upload">
                  {imageList.map((image) => (
                    <div key={image.key} className="image-item">
                      <img src={image.data_url} alt="" width="100" />
                    </div>
                  ))}
                  <button type='button' className="btn btn-primary" onClick={onImageUpload}>
                    Upload Image
                  </button>
                </div>
              )}
            </ReactImageUploading>
          </div>
          <DialogActions>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Product'}
            </Button>
          </DialogActions>
        </form>
        <ToastContainer position="bottom-center" />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
