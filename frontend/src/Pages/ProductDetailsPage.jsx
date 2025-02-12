// import React, { useEffect, useState } from "react";
// import styles from "../Styles/Style";
// import { useNavigate, useParams } from "react-router-dom";
// import Header from "../Components/Layout/Header";
// import Footer from "../Components/Layout/Footer";
// import ProductDetails from "../Components/Layout/ProductDetails";
// import SuggestedProduct from "../Components/Layout/SuggestedProduct";
// import { productData } from "../Static/data";

// const ProductDetailsPage = () => { 
//   const { name } = useParams();
//   const [data, setData] = useState(null);
//   const productName = name.replace(/-/g, " ");

//   useEffect(() => {
//     const data = productData.find((item) => item.name === productName);
//     setData(data && data);
//   });

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <>
//       <Header />
//       <ProductDetails data={data} />
//       {data && <SuggestedProduct data={data} />}
//       <Footer />
//     </>
//   );
// };

// export default ProductDetailsPage;



import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../Redux/slices/productSlice"; // Import product fetch action
import Header from "../Components/Layout/Header";
import Footer from "../Components/Layout/Footer";
import ProductDetails from "../Components/Layout/ProductDetails";
import SuggestedProduct from "../Components/Layout/SuggestedProduct";
import styles from "../Styles/Style";

const ProductDetailsPage = () => {
  const dispatch = useDispatch();

  // Get product details from Redux store
  const { selectedProduct, status } = useSelector((state) => state.products);

  const { id } = useParams(); // Capture product ID from the URL

  useEffect(() => {
    if (id) {
      
      dispatch(fetchProductById(id)); // Fetch the product by ID
    }
    window.scrollTo(0, 0);
  }, [dispatch, id]);
  
  

  return (
    <>
      <Header />
      
      {status === "loading" && <p className="text-center">Loading product details...</p>}
      {status === "failed" && <p className="text-center text-red-500">Failed to load product.</p>}

      {selectedProduct && (
        <>
          <ProductDetails data={selectedProduct} />
          <SuggestedProduct data={selectedProduct} />
        </>
      )}

      <Footer />
    </>
  );
};

export default ProductDetailsPage;
