import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Button, Menu, MenuItem } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { navigation } from "../../../config/navigationMenu";
import AuthModal from "../Auth/AuthModal";
import { getUser, logout } from "../../../Redux/Auth/Action";
import { getCart } from "../../../Redux/Customers/Cart/Action";

const STORE_NAME = "LUMINA";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { auth, cart } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const openUserMenu = Boolean(anchorEl);

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
      dispatch(getCart(jwt));
    }
  }, [jwt, dispatch]);

  useEffect(() => {
    if (auth.user) {
      setOpenAuthModal(false);
    }
    if (location.pathname === "/login" || location.pathname === "/register") {
      navigate("/");
    }
  }, [auth.user, location.pathname, navigate]);

  const goTo = (href) => {
    setMobileOpen(false);
    navigate(href);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    dispatch(logout());
    navigate("/");
  };

  const handleAccountClick = () => {
    setAnchorEl(null);
    navigate(auth.user?.role === "ROLE_ADMIN" ? "/admin" : "/account/order");
  };

  const userInitial = auth.user?.firstName
    ? auth.user.firstName[0].toUpperCase()
    : "U";

  return (
    <div className="sticky top-0 z-40 bg-[#fbf7f0]/95 backdrop-blur border-b border-stone-200">
      <div className="flex h-10 items-center justify-center bg-[#171717] px-4 text-xs font-semibold uppercase tracking-[0.25em] text-white">
        Free delivery for orders over 1.000.000 VND
      </div>

      <header className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <button
            type="button"
            className="rounded-full border border-stone-300 bg-white p-2 text-stone-700 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#171717] text-sm font-black tracking-widest text-white">
              LM
            </span>
            <div>
              <p className="text-xl font-black tracking-[0.28em] text-stone-950">
                {STORE_NAME}
              </p>
              <p className="text-[11px] uppercase tracking-[0.22em] text-stone-500">
                Fashion Studio
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {navigation.categories.map((category) => (
              <div className="group relative" key={category.id}>
                <button className="py-7 text-sm font-semibold uppercase tracking-[0.18em] text-stone-700 transition group-hover:text-[#a24d24]">
                  {category.name}
                </button>
                <div className="pointer-events-none absolute left-1/2 top-full w-[46rem] -translate-x-1/2 translate-y-3 rounded-sm border border-stone-200 bg-white p-6 opacity-0 shadow-2xl transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="grid grid-cols-[1.1fr_0.9fr] gap-8">
                    <div className="grid grid-cols-3 gap-6">
                      {category.sections.map((section) => (
                        <div key={section.id}>
                          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-stone-900">
                            {section.name}
                          </p>
                          <div className="space-y-3">
                            {section.items.map((item) => (
                              <button
                                key={item.name}
                                onClick={() => goTo(item.href)}
                                className="block text-left text-sm text-stone-500 transition hover:text-[#a24d24]"
                              >
                                {item.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {category.featured.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => goTo(item.href)}
                          className="group/card text-left"
                        >
                          <div className="aspect-[4/5] overflow-hidden rounded-sm bg-stone-100">
                            <img
                              src={item.imageSrc}
                              alt={item.imageAlt}
                              className="h-full w-full object-cover transition duration-500 group-hover/card:scale-105"
                            />
                          </div>
                          <p className="mt-3 text-sm font-semibold text-stone-900">
                            {item.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {navigation.pages.map((page) => (
              <Link
                key={page.name}
                to={page.href}
                className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-700 transition hover:text-[#a24d24]"
              >
                {page.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate("/products/search")}
              className="rounded-full border border-stone-300 bg-white p-2 text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
            >
              <span className="sr-only">Search</span>
              <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/cart")}
              className="relative rounded-full border border-stone-300 bg-white p-2 text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
            >
              <ShoppingBagIcon className="h-5 w-5" aria-hidden="true" />
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#a24d24] px-1 text-xs font-bold text-white">
                {cart.cart?.totalItem || 0}
              </span>
            </button>

            {auth.user ? (
              <>
                <Avatar
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  sx={{
                    bgcolor: deepPurple[500],
                    color: "white",
                    cursor: "pointer",
                    width: 36,
                    height: 36,
                  }}
                >
                  {userInitial}
                </Avatar>
                <Menu
                  anchorEl={anchorEl}
                  open={openUserMenu}
                  onClose={() => setAnchorEl(null)}
                >
                  <MenuItem onClick={handleAccountClick}>
                    {auth.user?.role === "ROLE_ADMIN" ? "Admin Dashboard" : "Đơn hàng của tôi"}
                  </MenuItem>
                  {auth.user?.role !== "ROLE_ADMIN" && (
                    <MenuItem onClick={() => { setAnchorEl(null); navigate("/account/profile"); }}>
                      Thông tin cá nhân
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                onClick={() => setOpenAuthModal(true)}
                sx={{
                  color: "#171717",
                  fontWeight: 700,
                  letterSpacing: ".12em",
                }}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </header>

      <Transition.Root show={mobileOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={setMobileOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in duration-200"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="w-full max-w-sm overflow-y-auto bg-[#fbf7f0] p-6 shadow-xl">
                <div className="mb-8 flex items-center justify-between">
                  <p className="text-lg font-black tracking-[0.25em]">
                    {STORE_NAME}
                  </p>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-full border border-stone-300 bg-white p-2"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-8">
                  {navigation.categories.map((category) => (
                    <div key={category.id}>
                      <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-stone-950">
                        {category.name}
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {category.sections
                          .flatMap((section) => section.items)
                          .map((item) => (
                            <button
                              key={`${category.id}-${item.name}`}
                              onClick={() => goTo(item.href)}
                              className="rounded-sm border border-stone-200 bg-white px-3 py-3 text-left text-sm font-medium text-stone-700"
                            >
                              {item.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                  {navigation.pages.map((page) => (
                    <button
                      key={page.name}
                      onClick={() => goTo(page.href)}
                      className="block text-sm font-bold uppercase tracking-[0.22em] text-stone-950"
                    >
                      {page.name}
                    </button>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <AuthModal
        handleClose={() => setOpenAuthModal(false)}
        open={openAuthModal}
      />
    </div>
  );
}
