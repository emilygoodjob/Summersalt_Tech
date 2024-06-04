import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './styles.css'; // Import the CSS file

const InfiniteScroll = () => {
    // State to hold products, current page, and loading status
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    // Function to fetch products from the API
    const fetchProducts = async (page) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://summersalt.com/collections/swimwear/products.json?page=${page}&limit=10`);
            setProducts(prevProducts => [...prevProducts, ...response.data.products]);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    // useEffect to fetch products when the page number changes
    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    // Callback to observe the last product element and trigger page increment
    const lastProductElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading]);

    return (
        <div className="container">
            {products.map((product, index) => {
                const productUrl = `https://www.summersalt.com/products/${product.handle}`;

                // Check if the product is the last one in the current list
                if (products.length === index + 1) {
                    return (
                        <div ref={lastProductElementRef} key={`${product.id}-${index}`} className="product">
                            <a href={productUrl}>
                                <div className="image-wrapper">
                                    <img src={product.images[0].src} alt={product.title} />
                                </div>
                            </a>
                            <a href={productUrl}><p className='product-title'>{product.title}</p></a>
                        </div>
                    );
                } else {
                    return (
                        <div key={`${product.id}-${index}`} className="product">
                            <a href={productUrl}>
                                <div className="image-wrapper">
                                    <img src={product.images[0].src} alt={product.title} />
                                </div>
                            </a>
                            <a href={productUrl}><p className='product-title'>{product.title}</p></a>
                        </div>
                    );
                }
            })}
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default InfiniteScroll;
