// src/components/AllCartDialog/Dialog.tsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Product } from '../../../Model/Types';

type Props = {
    open: boolean;
    onClose: () => void;
    cart: Product[];
    removeFromCart: (product: Product) => void;
};

const Cart: React.FC<Props> = ({ open, onClose, cart, removeFromCart }) => {
    const [cartItems, setCartItems] = useState<Product[]>([]);

    useEffect(() => {
        // Simulate fetching cart items from an API
        const fetchCartItems = async () => {
            try {
                // Replace with actual API call
                const response = await fetch('https://r18brnk5-5000.inc1.devtunnels.ms/product/');
                if (!response.ok) {
                    throw new Error('Failed to fetch cart items');
                }
                const data = await response.json();
                setCartItems(data.products); // Assuming data.products contains the array of cart items
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        if (open) {
            fetchCartItems();
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="cart-dialog-title"
            maxWidth="lg"
            fullWidth
        >
            <DialogTitle id="cart-dialog-title">Shopping Cart</DialogTitle>
            <DialogContent dividers>
                <div>
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div key={item._id} className="flex items-center justify-between border-b border-gray-200 py-2">
                                <div className="flex items-center">
                                    <img src={item.image} alt={item.productName} className="w-12 h-12 object-cover rounded" />
                                    <div className="ml-2">
                                        <div className="font-semibold">{item.productName}</div>
                                        <div className="text-gray-500">{item.price}</div>
                                    </div>
                                </div>
                                <button className="text-red-500" onClick={() => removeFromCart(item)}>
                                    Remove
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No items in the cart.</p>
                    )}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Cart;
