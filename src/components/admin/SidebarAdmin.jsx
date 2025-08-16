"use client";

import React, { useState } from "react";
import { BiCategory } from "react-icons/bi";
import { IoBagAddOutline, IoLocationOutline } from "react-icons/io5";
import { MdOutlineReviews } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import { RiCoupon2Line } from "react-icons/ri";
import { IconArrowLeft, IconBrandTabler } from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

// Sidebar width constants
const COLLAPSED_WIDTH = "w-[60px]";
const EXPANDED_WIDTH = "w-[250px]";

export function SidebarAdmin({ children }) {
  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Category",
      href: "/admin/category",
      icon: <BiCategory className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Product",
      href: "/admin/product",
      icon: <IoBagAddOutline className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Order",
      href: "/admin/order",
      icon: <IoLocationOutline className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Coupon",
      href: "/admin/coupon",
      icon: <RiCoupon2Line className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Customer",
      href: "/admin/customers",
      icon: <FaRegUser className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Reviews",
      href: "/admin/reviews",
      icon: <MdOutlineReviews className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
    {
      label: "Logout",
      href: "/logout",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700" />,
    },
  ];

  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* ✅ Sidebar floating over content */}
      <div
        className={cn(
          "fixed top-0 left-0 z-40 h-screen border-r border-neutral-200 bg-white transition-all duration-300",
          isHovered ? EXPANDED_WIDTH : COLLAPSED_WIDTH
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar open={isHovered} setOpen={() => {}}>
          <SidebarBody className="flex h-full flex-col justify-between gap-10 overflow-y-auto">
            <div className="flex-1 overflow-y-auto">
              {isHovered ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={link} open={isHovered} />
                ))}
              </div>
            </div>
            <SidebarLink
              link={{
                label: "E-com-app",
                href: "#",
                icon: (
                  <img
                    src="/globe.svg"
                    className="h-7 w-7 shrink-0 rounded-full"
                    width={50}
                    height={50}
                    alt="Avatar"
                  />
                ),
              }}
              open={isHovered}
            />
          </SidebarBody>
        </Sidebar>
      </div>

      {/* ✅ Main content full width */}
      <div className="ml-0 flex flex-1 flex-col p-4 md:p-10">
        <div className="flex w-full flex-col gap-2 border border-neutral-200 bg-white p-4 md:p-10 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black px-4"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-medium text-black"
      >
        E-com-Dashboard
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black px-4"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black" />
    </a>
  );
};
