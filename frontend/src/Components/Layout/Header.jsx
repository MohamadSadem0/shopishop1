import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSectionsWithCategories } from "../../Redux/slices/sectionSlice";
import styles from "../../Styles/Style";
import Logo from "../../Assets/logo.png";
import avatar from "../../Assets/avatar.jpg";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import Cart from "../../Components/Cart";
import Wishlist from "../../Components/Wishlist";
import ResponsiveHeader from "./ResponsiveHeader/ResponsiveHeader";

const Header = ({ activeHeading }) => {
  const dispatch = useDispatch();
  const { sectionsWithCategories, status: sectionStatus } = useSelector(
    (state) => state.sections
  );

  // Local states
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [click, setClick] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Redux states
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user, role } = useSelector((state) => state.auth);
  const profile = user?.photoUrl || avatar;

  // Decide which link & button text (Login, Dashboard, etc.)
  const { dashboardRoute, buttonText } = (() => {
    if (!user) {
      return { dashboardRoute: "/login", buttonText: "Login" };
    }
    const userRole = role?.toUpperCase();
    if (userRole === "MERCHANT" || userRole === "SUPERADMIN") {
      return {
        dashboardRoute:
          userRole === "SUPERADMIN"
            ? "/superadmin-dashboard"
            : "/dashboard-create-product",
        buttonText: "Go Dashboard",
      };
    }
    return { dashboardRoute: "/signup-seller", buttonText: "Become Seller" };
  })();

  // Handle top search
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    // Filter categories from your sections data
    const filteredCategories = sectionsWithCategories.flatMap((section) =>
      section.categories.filter((category) =>
        category.name.toLowerCase().includes(term.toLowerCase())
      )
    );
    setSearchData(filteredCategories);
    setClick(term.length !== 0);
  };

  // Fetch sections + categories on mount
  useEffect(() => {
    dispatch(fetchSectionsWithCategories());
  }, [dispatch]);

  // Watch scroll to fix the bottom header (sticky)
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 70);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* =============== Top Header =============== */}
      <div className={`${styles.section}`}>
        {/* Use the style from your previous header */}
        <div className="hidden 800px:h-[50px] 800px:pt-12 800px:pb-12 800px:flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <img src={Logo} alt="Logo" className="w-[150px] h-[120px]" />
          </Link>

          {/* Search Box */}
          <div className={`${styles.section} relative w-[50%]`}>
            <input
              type="text"
              className="w-full py-2 rounded border border-[#3957db] focus:outline-none pl-2"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search categories..."
            />
            <AiOutlineSearch
              size={30}
              color="#333"
              className="absolute top-1.5 right-2 cursor-pointer"
            />
            {click && searchData?.length > 0 && (
              <div className="absolute min-h-[30vh] shadow-sm-2 bg-slate-50 z-[9] p-4">
                {searchData.map((category, i) => (
                  <Link
                    key={i}
                    to={`/category/${category.name.replace(/\s+/g, "-")}`}
                  >
                    <div className="w-full flex items-center py-3">
                      <h1>{category.name}</h1>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Button: Go Dashboard / Login / Become Seller */}
          <div className={`${styles.button}`}>
            <Link to={dashboardRoute}>
              <h1 className="text-white flex items-center justify-center">
                {buttonText}
                <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive Header (for mobile/tablet) */}
      <ResponsiveHeader
        active={isScrolled}
        openMenu={openMenu}
        setOpenMenu={setOpenMenu}
        setOpenCart={setOpenCart}
        setOpenWishlist={setOpenWishlist}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        searchData={searchData}
        activeHeading={activeHeading}
        cart={cart}
        click={click}
      />

      {/* =============== Header Bottom =============== */}
      <div
        className={`800px:flex hidden w-full bg-[#3957db] items-center justify-between transition p-5 1040px:p-0 ${
          isScrolled ? "fixed top-0 left-0 shadow-sm z-10" : ""
        }`}
      >
        <div
          className={`${styles.section} ${styles.noramlFlex} relative justify-between`}
        >
          {/* ====== "All Sections" Dropdown Button ====== */}
          <div
            className="relative mt-[10px] w-[270px] h-[60px] hidden 1000px:flex items-center"
            onClick={() => setDropDown(!dropDown)}
          >
            <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
            <button className="w-full h-[100%] flex items-center justify-between font-sans pl-10 bg-white text-lg font-[500] rounded-t-md select-none">
              All Sections
            </button>
            <IoIosArrowDown
              size={20}
              className="absolute right-2 top-4 cursor-pointer"
            />
            {dropDown && (
              <DropDown
                sectionsWithCategories={sectionsWithCategories || []}
                setDropDown={setDropDown}
              />
            )}
          </div>

          {/* ====== Main Navbar ====== */}
          <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          {/* ====== Icons: Wishlist, Cart, Profile ====== */}
          <div className="flex">
            {/* Wishlist Icon */}
            <div
              className={`${styles.noramlFlex} cursor-pointer`}
              onClick={() => setOpenWishlist(true)}
            >
              <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
              {wishlist && wishlist.length > 0 && (
                <span className="ml-[-10px] mb-[20px] text-white text-sm">
                  {wishlist.length}
                </span>
              )}
            </div>

            {/* Cart Icon */}
            <div
              className={`${styles.noramlFlex} ml-4 cursor-pointer`}
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
              {cart && cart.length > 0 && (
                <span className="ml-[-10px] mb-[20px] text-white text-sm">
                  {cart.length}
                </span>
              )}
            </div>

            {/* Profile Avatar */}
            <div className={`${styles.noramlFlex} ml-4`}>
              <Link to={user ? "/profile" : "/login"}>
                <img
                  src={profile}
                  alt="avatar"
                  className="w-[33px] h-[33px] rounded-full object-cover"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* =============== Overlays for Cart & Wishlist =============== */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;
