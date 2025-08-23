"use client";

import Link from "next/link";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaHeadset,
} from "react-icons/fa";

const FlipkartFooter = () => {
  const footerLinks = {
    about: [
      { name: "Contact Us", href: "/contact" },
      { name: "About Us", href: "/about" },
      { name: "Careers", href: "/careers" },
      { name: "Corporate Information", href: "/corporate" },
    ],
    help: [
      { name: "Payments", href: "/help/payments" },
      { name: "Shipping", href: "/help/shipping" },
      { name: "Cancellation & Returns", href: "/help/returns" },
      { name: "FAQ", href: "/help/faq" },
    ],
    consumer: [
      { name: "Security", href: "/security" },
      { name: "Privacy", href: "/privacy" },
      { name: "Sitemap", href: "/sitemap" },
      { name: "Grievance Redressal", href: "/grievance" },
    ],
    social: [
      { name: "Facebook", href: "#", icon: FaFacebook },
      { name: "Twitter", href: "#", icon: FaTwitter },
      { name: "Instagram", href: "#", icon: FaInstagram },
      { name: "YouTube", href: "#", icon: FaYoutube },
    ],
  };

  const features = [
    {
      icon: FaTruck,
      title: "Free Shipping",
      description: "Free shipping on orders above ₹499",
    },
    {
      icon: FaUndo,
      title: "Easy Returns",
      description: "7 days replacement policy",
    },
    {
      icon: FaShieldAlt,
      title: "Secure Payments",
      description: "100% secure payment methods",
    },
    {
      icon: FaHeadset,
      title: "24/7 Support",
      description: "Customer support anytime",
    },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Features Section */}
      <div className="border-b border-border bg-muted/30">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="text-primary text-xl" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground text-sm">
                    {feature.title}
                  </h4>
                  <p className="text-muted-foreground text-xs">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-4">
              ABOUT
            </h3>
            <ul className="space-y-3">
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-foreground text-sm hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-4">
              HELP
            </h3>
            <ul className="space-y-3">
              {footerLinks.help.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-foreground text-sm hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Consumer Policy */}
          <div>
            <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-4">
              CONSUMER POLICY
            </h3>
            <ul className="space-y-3">
              {footerLinks.consumer.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-foreground text-sm hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-4">
              CONNECT WITH US
            </h3>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3">
                <FaPhone className="text-muted-foreground text-sm" />
                <span className="text-foreground text-sm">
                  +91 8000 000 000
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-muted-foreground text-sm" />
                <span className="text-foreground text-sm">
                  support@yourstore.com
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-muted-foreground text-sm mt-1" />
                <span className="text-foreground text-sm">
                  123 Business Street,
                  <br />
                  City, State 12345
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {footerLinks.social.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-muted rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="text-lg" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="max-w-md">
            <h3 className="text-foreground font-medium mb-3">
              Stay updated with latest offers
            </h3>
            <div className="flex space-x-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <p className="text-muted-foreground text-sm">
                © 2024 YourStore. All rights reserved.
              </p>
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  href="/terms"
                  className="text-muted-foreground text-sm hover:text-foreground"
                >
                  Terms of Use
                </Link>
                <Link
                  href="/privacy"
                  className="text-muted-foreground text-sm hover:text-foreground"
                >
                  Privacy Policy
                </Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-muted-foreground text-sm">We accept:</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 bg-muted rounded border border-border flex items-center justify-center">
                  <span className="text-xs font-bold">💳</span>
                </div>
                <div className="w-8 h-5 bg-muted rounded border border-border flex items-center justify-center">
                  <span className="text-xs font-bold">🏦</span>
                </div>
                <div className="w-8 h-5 bg-muted rounded border border-border flex items-center justify-center">
                  <span className="text-xs font-bold">📱</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FlipkartFooter;
