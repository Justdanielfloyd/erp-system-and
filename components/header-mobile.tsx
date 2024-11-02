"use client";

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { SIDENAV_ITEMS } from "@/lib/constants";

import { Icon } from "@iconify/react";
import { motion, useCycle } from "framer-motion";
import { MenuItemWithSubMenuProps } from "@/lib/types";
import { MenuToggle } from "@/components/index-clientside";
import { ModeToggle } from "./ui/toggle-mode";
import Loading from "./ui/loading";

const HeaderMobile = () => {
  const pathname = usePathname();
  const containerRef = useRef(null);
  const { height } = useDimensions(containerRef);
  const [isOpen, toggleOpen] = useCycle(false, true);
  const [navigate, setNavigate] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleLoader = useCallback(() => {
    setLoading(navigate !== "");

    if (isLoading === true && pathname === navigate) {
      setLoading(false);
      setNavigate("");
    }
  }, [isLoading, pathname, navigate]);

  useEffect(() => {
    handleLoader();
  }, [pathname, handleLoader]);

  const sidebar = {
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at 100% 0)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    }),
    closed: {
      clipPath: "circle(0px at 100% 0)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
      },
    },
  };

  return (
    <>
      <div>{isLoading && <Loading />}</div>
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        className={`${
          pathname === "/authentication"
            ? "hidden"
            : "fixed inset-0 z-50 w-full md:hidden"
        } ${isOpen ? "" : "pointer-events-none"}`}
        ref={containerRef}
      >
        <motion.div
          className="absolute inset-0 right-0 w-full bg-gradient-to-b from-hoverGrill to-actions"
          variants={sidebar}
        />
        <motion.ul
          variants={variants}
          className="absolute grid w-full gap-3 px-10 py-16"
        >
          {SIDENAV_ITEMS.map((item, idx) => {
            const isLastItem = idx === SIDENAV_ITEMS.length - 1; // Check if it's the last item

            return (
              <div key={idx}>
                {item.submenu ? (
                  <MenuItemWithSubMenu
                    item={item}
                    toggleOpen={toggleOpen}
                    handleLoader={handleLoader}
                    setNavigate={setNavigate}
                  />
                ) : (
                  <MenuItem>
                    <Link
                      href={item.path}
                      onClick={() => {
                        toggleOpen();
                        if (window.location.pathname !== item.path) {
                          setNavigate(item.path);
                          handleLoader();
                        }
                      }}
                      className={`flex w-full text-2xl ${
                        item.path === pathname ? "font-bold" : ""
                      }`}
                    >
                      {item.title}
                    </Link>
                  </MenuItem>
                )}

                {!isLastItem && (
                  <MenuItem className="my-3 h-px w-full bg-black" />
                )}
              </div>
            );
          })}
        </motion.ul>
        <ModeToggle
          className={`${isOpen ? "" : "hidden"} absolute bottom-3 left-10`}
        />
        <MenuToggle toggle={toggleOpen} />
      </motion.nav>
    </>
  );
};

export default HeaderMobile;

const MenuItem = ({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) => {
  return (
    <motion.li variants={MenuItemVariants} className={className}>
      {children}
    </motion.li>
  );
};

const MenuItemWithSubMenu: React.FC<MenuItemWithSubMenuProps> = ({
  item,
  toggleOpen,
  handleLoader,
  setNavigate,
}) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <>
      <MenuItem>
        <button
          className="flex w-full text-2xl"
          onClick={() => setSubMenuOpen(!subMenuOpen)}
        >
          <div className="flex flex-row justify-between w-full items-center">
            <span
              className={`${pathname.includes(item.path) ? "font-bold" : ""}`}
            >
              {item.title}
            </span>
            <div className={`${subMenuOpen && "rotate-180"}`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </div>
        </button>
      </MenuItem>
      <div className="mt-2 ml-2 flex flex-col space-y-2">
        {subMenuOpen && (
          <>
            {item.subMenuItems?.map((subItem, subIdx) => {
              return (
                <MenuItem key={subIdx}>
                  <Link
                    href={subItem.path}
                    onClick={() => {
                      toggleOpen();
                      if (window.location.pathname !== subItem.path) {
                        setNavigate(subItem.path);
                        handleLoader();
                      }
                    }}
                    className={` ${
                      subItem.path === pathname ? "font-bold" : ""
                    }`}
                  >
                    {subItem.title}
                  </Link>
                </MenuItem>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

const MenuItemVariants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
      duration: 0.02,
    },
  },
};

const variants = {
  open: {
    transition: { staggerChildren: 0.02, delayChildren: 0.15 },
  },
  closed: {
    transition: { staggerChildren: 0.01, staggerDirection: -1 },
  },
};

const useDimensions = (
  ref: React.MutableRefObject<{
    offsetWidth: number;
    offsetHeight: number;
  } | null>
) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
  }, [ref]);

  return dimensions.current;
};
