import React, { useState } from 'react';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Stack from '@mui/material/Stack';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CircularProgress } from '@mui/material';
import CustomPagination from '../../Pagination/Pagination';
import Cart from '../AllCartDialog/Dialog';
import { useGetAllProductsQuery, useAddProductMutation } from '../../../Services/productServices';
import { Product } from '../../../Model/Types';
import AddToProductForm from '../AddToCartForm/AddToProductForm';

const ProductCard: React.FC<{ product: Product; addToCart: (product: Product) => void }> = ({ product }) => (
    <div className="relative max-w-xs rounded overflow-hidden shadow-lg m-4">
        <img className="w-80 h-32 object-cover rounded-t-md" src={product.image} alt={product.productName} />
        <div className="p-2">
            <div className="text-sm mb-1">Name : {product.productName}</div>
            <p className="text-sm mb-1">Brand : {product.brand}</p>
            <p className="text-sm mb-1">Price : {product.price}</p>
            <p className="text-sm mb-1">Rating : {product.rating}</p>

        </div>
    </div>
);

const ProductList: React.FC = () => {
    const [cart, setCart] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [openCartDialog, setOpenCartDialog] = useState(false);
    const [loadingPage, setLoadingPage] = useState(false);
    const [isOpenProductForm, setIsOpenProductForm] = useState(false);

    const productsPerPage = 6;

    const { data, error, isLoading, isFetching, refetch } = useGetAllProductsQuery({});

    const [addProduct] = useAddProductMutation();

    const handleOpenCartDialog = () => {
        setOpenCartDialog(true);
    };

    const handleCloseCartDialog = () => {
        setOpenCartDialog(false);
    };

    // const handleOpenProductDialog = () => {
    //     setIsOpenProductForm(true);
    // };

    const handleCloseProductDialog = () => {
        setIsOpenProductForm(false);
    };

    const addToCart = (product: Product) => {
        if (!cart.find((item) => item._id === product._id)) {
            setCart((prevCart) => [...prevCart, product]);
            toast.success('Product added to cart.');
        } else {
            toast.error('Product is already in the cart.');
        }
    };

    const removeFromCart = (product: Product) => {
        setCart((prevCart) => prevCart.filter((item) => item._id !== product._id));
        toast.info('Product removed from cart.');
    };

    const handlePageChange = async (event: React.ChangeEvent<unknown>, page: number) => {
        setLoadingPage(true); // Set loading state

        await setCurrentPage(page); // Set new page

        setLoadingPage(false); // Unset loading state
    };

    const handleAddProduct = async (newProduct: Product) => {
        try {
            const response = await addProduct(newProduct).unwrap();
            toast.success('Product added successfully.');

            // Refetch the products after adding a new one to update the list
            await refetch();
        } catch (error) {
            toast.error('Failed to add product.');
            console.error('Error adding product:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    if (error) {
        return <div>Error fetching products: {error.toString()}</div>;
    }

    const products = data?.products ?? [];
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    return (
        <>
            <div className='container mx-auto'>

                <div className='flex justify-between p-2'>
                    <button className="bg-blue-500 text-white py-1 px-1 rounded hover:bg-blue-700 flex items-center" onClick={() => setIsOpenProductForm(true)}>
                        <FontAwesomeIcon icon={faCartPlus} className="mr-2" /> Add Cart
                    </button>
                    <button className="bg-blue-500 text-white py-1 px-1 rounded hover:bg-blue-700 flex items-center" onClick={handleOpenCartDialog}>
                        <FontAwesomeIcon icon={faCartPlus} className="mr-2" /> Cart ({cart.length})
                    </button>
                </div>
                <div className="flex flex-wrap justify-center">
                    {currentProducts.map((product: any) => (
                        <ProductCard key={product._id} product={product} addToCart={addToCart} />
                    ))}
                </div>
                <Stack spacing={2} alignItems="end" className="my-4">
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={Math.ceil(products.length / productsPerPage)}
                        onPageChange={handlePageChange}
                    />
                </Stack>

            </div>
            <ToastContainer position='top-center' />
            {openCartDialog && (
                <Cart
                    open={openCartDialog}
                    onClose={handleCloseCartDialog}
                    cart={cart}
                    removeFromCart={removeFromCart}
                />
            )}
            {isOpenProductForm && (
                <AddToProductForm
                    open={isOpenProductForm}
                    onClose={handleCloseProductDialog}
                    onAddProduct={handleAddProduct}
                />
            )}
            {isFetching || loadingPage && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <CircularProgress />
                </div>
            )}
        </>
    );
};

export default ProductList;
