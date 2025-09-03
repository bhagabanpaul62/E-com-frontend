"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  MapPin,
  Heart,
  Edit3,
  Plus,
  Phone,
  Shield,
  Gift,
  Bell,
  Trash2,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

export default function UserAccountPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("wishlist");
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/users/get-user`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch user profile");
        }

        const data = await response.json();
        setUser(data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading your account...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Something went wrong
              </h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const quickStats = [
    {
      icon: Heart,
      label: "Wishlist",
      value: user?.wishlist?.length || "0",
      color: "bg-red-500",
      tab: "wishlist",
    },
    {
      icon: MapPin,
      label: "Addresses",
      value: user?.addresses?.length || "0",
      color: "bg-green-500",
      tab: "addresses",
    },
    {
      icon: Bell,
      label: "Notifications",
      value: "4",
      color: "bg-blue-500",
      tab: "notifications",
    },
    {
      icon: Shield,
      label: "Security",
      value: "Active",
      color: "bg-purple-500",
      tab: "security",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">
                    Welcome back, {user?.fullName || "User"}!
                  </h1>
                  <p className="text-amber-100">
                    Manage your account and track your orders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div
              key={index}
              onClick={() => setActiveTab(stat.tab)}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {user?.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>

              <nav className="p-2">
                {[
                  { id: "wishlist", icon: Heart, label: "Wishlist" },
                  { id: "addresses", icon: MapPin, label: "Address Book" },
                  { id: "notifications", icon: Bell, label: "Notifications" },
                  { id: "security", icon: Shield, label: "Change Password" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-amber-50 text-amber-700 border-r-2 border-amber-500"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        activeTab === item.id
                          ? "text-amber-600"
                          : "text-gray-500"
                      }`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* Wishlist */}
             
              
              {/* Addresses */}
              <TabsContent value="addresses" className="mt-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-amber-600" />
                      Address Book
                    </h2>
                    <button
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 flex items-center space-x-2 shadow-lg"
                      onClick={() => router.push("/account/add-address")}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Address</span>
                    </button>
                  </div>

                  {user?.addresses?.length > 0 ? (
                    <div className="grid gap-4">
                      {user.addresses.map((address) => (
                        <div
                          key={address._id}
                          className="border border-gray-200 rounded-xl p-6 hover:border-amber-300 hover:shadow-md transition-all duration-200"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-3">
                                <h4 className="font-semibold text-gray-900">
                                  {address.name}
                                </h4>
                                {address.isDefault && (
                                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="space-y-1 text-gray-600">
                                <p>{address.street}</p>
                                <p>
                                  {address.city}, {address.state}{" "}
                                  {address.pincode}
                                </p>
                                <p className="flex items-center space-x-1">
                                  <Phone className="w-4 h-4" />
                                  <span>{address.phone}</span>
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No addresses saved
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Add your first address to get started
                      </p>
                      <button
                        onClick={() => router.push("/account/add-address")}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                      >
                        Add Address
                      </button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Wishlist */}
              <TabsContent value="wishlist" className="mt-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-amber-600" />
                      My Wishlist
                    </h2>
                  </div>

                  {user?.wishlist?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {user.wishlist.map((item) => (
                        <div
                          key={item._id}
                          className="group border border-gray-200 rounded-xl overflow-hidden hover:border-amber-300 hover:shadow-lg transition-all duration-200"
                        >
                          <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                  <Gift className="w-8 h-8 mx-auto mb-2" />
                                  <p className="text-sm">No image</p>
                                </div>
                              </div>
                            )}
                            <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white hover:scale-110 transition-all duration-200">
                              <Heart className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                              {item.title}
                            </h4>
                            <p className="text-lg font-bold text-amber-600 mb-4">
                              ₹{item.price}
                            </p>
                            <div className="flex space-x-2">
                              <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 text-sm font-medium">
                                Add to Cart
                              </button>
                              <button className="p-2 border border-gray-300 rounded-lg hover:border-red-300 hover:bg-red-50 text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className="text-gray-500 mb-6">
                        Save items you love to buy them later
                      </p>
                      <button
                        onClick={() => router.push("/")}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="mt-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                    <Shield className="w-5 h-5 mr-2 text-amber-600" />
                    Change Password
                  </h2>

                  <div className="max-w-md">
                    <div className="p-6 border border-gray-200 rounded-xl">
                      <div className="text-center mb-6">
                        <Shield className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Update Your Password
                        </h3>
                        <p className="text-gray-600">
                          Keep your account secure by updating your password
                          regularly
                        </p>
                      </div>

                      <button
                        onClick={() => router.push("/account/change-password")}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 font-medium"
                      >
                        Change Password
                      </button>

                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Last updated: 30 days ago
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Notifications */}
              <TabsContent value="notifications" className="mt-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                    <Bell className="w-5 h-5 mr-2 text-amber-600" />
                    Notification Preferences
                  </h2>

                  <div className="space-y-4">
                    {[
                      {
                        title: "Order Updates",
                        description: "Get notified about your order status",
                      },
                      {
                        title: "Promotional Emails",
                        description: "Receive offers and deals",
                      },
                      {
                        title: "Price Alerts",
                        description: "When items in your wishlist go on sale",
                      },
                      {
                        title: "New Arrivals",
                        description: "Be the first to know about new products",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-xl"
                      >
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {item.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.description}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                          defaultChecked
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
