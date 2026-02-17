import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.svg";
import { MENU_ITEMS } from "./MenuItem";


const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  // Optimized base classes
  const navLinkBase = "transition-colors duration-300 font-medium relative tracking-wide px-3 py-1";
  const activeLinkClass = "text-amber-400 font-semibold after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-full after:h-0.5 after:bg-amber-400";
  const inactiveLinkClass = "text-gray-100 hover:text-amber-300 hover:after:w-full hover:after:bg-amber-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:transition-all after:duration-300";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 shadow-lg ${scrolled
        ? "bg-blue-900/95 backdrop-blur-md py-2"
        : "bg-blue-900 py-3"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between md:justify-center">
        {/* MOBILE LOGO - Only visible on mobile */}
        <Link to="/" className="flex items-center md:hidden">
          <img src={logo} alt="JNTUK LOGO" className="h-10 w-auto filter brightness-0 invert" />
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-10">
          <nav className="flex items-center gap-8 text-lg font-semibold">
            {MENU_ITEMS.map((item, index) =>
              item.children ? (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-1 ${openDropdown === item.label ? 'text-amber-400' : 'text-gray-100 hover:text-amber-300'} transition-colors font-medium tracking-wide`}
                  >
                    {item.label}
                    <svg className={`w-4 h-4 transition-transform duration-200 ${openDropdown === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div
                    className={`absolute pt-4 w-64 transform transition-all duration-200 ${index > MENU_ITEMS.length - 2 ? 'right-0 origin-top-right' : 'left-0 origin-top-left'} ${openDropdown === item.label
                      ? "opacity-100 scale-100 translate-y-0 visible"
                      : "opacity-0 scale-95 -translate-y-2 invisible"
                      }`}
                  >
                    <div className="rounded-xl bg-white shadow-xl border border-gray-100 ring-1 ring-black/5 max-h-[calc(100vh-100px)] overflow-y-auto">
                      {item.children.map((child) => (
                        child.children ? (
                          <details key={child.label} className="group/nested">
                            <summary
                              className={`w-full flex items-center justify-between px-4 py-3 text-sm text-gray-600 hover:bg-yellow-50 hover:text-yellow-700 transition-colors border-l-2 border-transparent hover:border-yellow-500 cursor-pointer list-none`}
                            >
                              {child.label}
                              <svg className="w-3 h-3 transform transition-transform group-open/nested:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </summary>
                            <div className="pl-6 pr-2 space-y-1 pb-2">
                              {child.children.map((grandchild) => (
                                <Link
                                  key={grandchild.label}
                                  to={grandchild.path}
                                  className={`block px-3 py-2 text-sm rounded-md hover:bg-yellow-50 hover:text-yellow-700 transition-colors ${isActive(grandchild.path) ? "bg-yellow-50 text-yellow-700 font-medium" : "text-gray-500"}`}
                                >
                                  {grandchild.label}
                                </Link>
                              ))}
                            </div>
                          </details>
                        ) : (
                          <Link
                            key={child.label}
                            to={child.path}
                            className={`block px-4 py-3 text-sm hover:bg-yellow-50 hover:text-yellow-700 transition-colors border-l-2 border-transparent hover:border-yellow-500 ${isActive(child.path) ? "bg-yellow-50 text-yellow-700 border-yellow-500" : "text-gray-600"
                              }`}
                          >
                            {child.label}
                          </Link>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`${navLinkBase} ${isActive(item.path) ? activeLinkClass : inactiveLinkClass}`}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>


        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-white hover:bg-blue-800 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden fixed inset-x-0 top-[${scrolled ? '60px' : '72px'}] bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-xl transition-all duration-300 ease-in-out origin-top ${mobileOpen ? "max-h-[80vh] opacity-100 py-4" : "max-h-0 opacity-0 overflow-hidden py-0"
          }`}
      >
        <div className="px-4 space-y-1">
          {MENU_ITEMS.map((item) =>
            item.children ? (
              <details key={item.label} className="group/mobile">
                <summary className="cursor-pointer flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 text-gray-700 font-medium select-none">
                  {item.label}
                  <svg className="w-4 h-4 transition-transform group-open/mobile:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100 space-y-1">
                  {item.children.map((child) => (
                    child.children ? (
                      <details key={child.label} className="group/nested-mobile">
                        <summary className="cursor-pointer flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded-lg select-none">
                          {child.label}
                          <svg className="w-3 h-3 transition-transform group-open/nested-mobile:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <div className="mt-1 ml-4 pl-4 border-l-2 border-gray-100 space-y-1">
                          {child.children.map((grandchild) => (
                            <Link
                              key={grandchild.label}
                              to={grandchild.path}
                              className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive(grandchild.path) ? "bg-yellow-50 text-yellow-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-black"}`}
                              onClick={() => setMobileOpen(false)}
                            >
                              {grandchild.label}
                            </Link>
                          ))}
                        </div>
                      </details>
                    ) : (
                      <Link
                        key={child.label}
                        to={child.path}
                        className={`block px-4 py-2.5 rounded-lg text-sm transition-colors ${isActive(child.path) ? "bg-yellow-50 text-yellow-700 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-black"
                          }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    )
                  ))}
                </div>
              </details>
            ) : (
              <Link
                key={item.label}
                to={item.path}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isActive(item.path) ? "bg-yellow-50 text-yellow-700" : "text-gray-700 hover:bg-gray-50 hover:text-black"
                  }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}

        </div>
      </div>
    </header>
  );
};

export default Navbar;
