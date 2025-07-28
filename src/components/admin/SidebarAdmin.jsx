"use client";
import React, { useState } from "react";
import { BiCategory } from "react-icons/bi";
import { IoBagAddOutline } from "react-icons/io5";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function SidebarAdmin({ children }) {
  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: (
        <IconBrandTabler className="h-5 w-5 shrink-0 text-neutral-700 " />
      ),
    },
    {
      label: "Profile",
      href: "/admin/profile",
      icon: (
        <IconUserBolt className="h-5 w-5 shrink-0 text-neutral-700 " />
      ),
    },
    {
      label: "Category",
      href: "/admin/category",
      icon: (
        <BiCategory className="h-5 w-5 shrink-0 text-neutral-700 " />
      ),
    },
    {
      label: "Product",
      href: "/admin/product",
      icon: (
        <IoBagAddOutline className="h-5 w-5 shrink-0 text-neutral-700 " />
      ),
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 " />
      ),
    },
    {
      label: "Logout",
      href: "/logout",
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 " />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden border-neutral-200 bg-gray-100 md:flex-row  ",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
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
          />
        </SidebarBody>
      </Sidebar>

      {/* ✅ Main content with scroll enabled */}
      <div className="flex flex-1 overflow-y-auto">
        <div className="flex h-full w-full flex-1 flex-col gap-2 overflow-y-auto border border-neutral-200 bg-white p-2 md:p-10  ">
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
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black " />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black "
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
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black " />
    </a>
  );
};
