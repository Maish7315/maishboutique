import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Linkedin, X } from 'lucide-react';

// Custom TikTok Icon component
const TikTokIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width="24" 
    height="24"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Custom WhatsApp Icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    width="24" 
    height="24"
  >
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12"/>
  </svg>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalId: string) => {
    setActiveModal(modalId);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const footerLinks = {
    shop: [
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Women', href: '/categories/women' },
      { label: 'Men', href: '/categories/men' },
      { label: 'Kids', href: '/categories/kids' },
      { label: 'Sale', href: '/sale' },
    ],
    help: [
      { label: 'Track Order', onClick: () => openModal('track-order') },
      { label: 'Returns & Exchanges', onClick: () => openModal('returns') },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Size Guide', onClick: () => openModal('size-guide') },
      { label: 'FAQs', href: '/faqs' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', onClick: () => openModal('careers') },
      { label: 'Contact', onClick: () => openModal('contact') },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/maishboutique', label: 'Instagram' },
    { icon: Facebook, href: 'https://facebook.com/maishboutique', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com/maishboutique', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com/@maishboutique', label: 'YouTube' },
    { icon: TikTokIcon, href: 'https://www.tiktok.com/@maish_boutique1?is_from_webapp=1&sender_device=pc', label: 'TikTok' },
    { icon: Linkedin, href: 'https://linkedin.com/company/maishboutique', label: 'LinkedIn' },
  ];

  return (
    <>
      <footer className="bg-muted/30 border-t border-border pt-8 pb-24 md:pb-6 mt-auto">
        <div className="container mx-auto px-4">
          {/* Newsletter Section */}
          <div className="bg-primary/5 rounded-xl p-5 md:p-8 mb-8">
            <div className="max-w-xl mx-auto text-center">
              <h3 className="font-display text-lg md:text-2xl font-semibold mb-2">
                Join Our Newsletter
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Subscribe for exclusive deals & 10% off your first order
              </p>
              <form className="flex flex-col gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-12 px-4 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-base"
                />
                <button
                  type="submit"
                  className="h-12 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors touch-manipulation"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Links Grid - Mobile: 1 column, Tablet: 2 columns, Desktop: 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-8">
            {/* Shop */}
            <div>
              <h4 className="font-semibold mb-3">Shop</h4>
              <ul className="space-y-2">
                {footerLinks.shop.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href || '#'}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm block py-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-semibold mb-3">Help</h4>
              <ul className="space-y-2">
                {footerLinks.help.map((link) => (
                  <li key={link.label}>
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left block py-1 touch-manipulation"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.href || '#'}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm block py-1"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    {link.onClick ? (
                      <button
                        onClick={link.onClick}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm text-left block py-1 touch-manipulation"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.href || '#'}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm block py-1"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-3">Contact Us</h4>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>Narok, Kenya</span>
                </li>
                <li className="flex items-start gap-2.5 text-muted-foreground text-sm">
                  <Phone className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <a href="tel:+254799921036" className="hover:text-foreground transition-colors">
                      +254 799 921 036
                    </a>
                    <a href="tel:+254706397660" className="hover:text-foreground transition-colors">
                      +254 706 397 660
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 text-muted-foreground text-sm">
                  <Mail className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <a href="mailto:maishboutiquemarketing@gmail.com" className="hover:text-foreground transition-colors break-all">
                    maishboutiquemarketing@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social & Copyright */}
          <div className="pt-6 border-t border-border">
            <div className="flex flex-col items-center gap-4">
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors touch-manipulation"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>

              {/* Copyright & Payment */}
              <div className="flex flex-col items-center gap-3 text-xs md:text-sm text-muted-foreground">
                <p>© {currentYear} Maish Fashion Boutique. All rights reserved.</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-muted rounded text-xs">Visa</span>
                  <span className="px-2 py-1 bg-muted rounded text-xs">Mastercard</span>
                  <span className="px-2 py-1 bg-muted rounded text-xs">M-Pesa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">
                {activeModal === 'track-order' && 'Track Order'}
                {activeModal === 'returns' && 'Returns & Exchanges Policy'}
                {activeModal === 'about' && 'About Us'}
              </h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              {/* Track Order Modal */}
              {activeModal === 'track-order' && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-6">
                    Talk to our agent
                  </p>
                  <a
                    href="https://wa.me/254799921036"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#20BD5C] transition-colors"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    Chat on WhatsApp
                  </a>
                </div>
              )}

              {/* Returns & Exchanges Modal */}
              {activeModal === 'returns' && (
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    You can return any product within 7 days from the delivery date if you change your mind or if the size is not suitable, except for the following products due to hygiene and health reasons.
                  </p>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Notes:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>You have 7 days to return any item if it is damaged, defective or counterfeit.</li>
                      <li>You can't return an item due to change of mind if its factory seal is opened.</li>
                      <li>While returning a product, please ensure all accessories are included, the item is in its original packaging, and any bundled gifts are returned as well.</li>
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium">Rejected Returns:</p>
                    <p className="text-muted-foreground">
                      If a return request is rejected, the item will be shipped back to you. If the item is not received and no reshipment is requested, it will be stored in our warehouse for up to 30 days. After this period, unclaimed items will be considered forfeited and become our property. Please note that no refund will be issued in these cases.
                    </p>
                  </div>

                  <p className="text-muted-foreground">
                    Unfortunately, you can request a return as per our return policy and place a new order with the desired item.
                  </p>
                </div>
              )}

              {/* Careers Modal */}
              {activeModal === 'careers' && (
                <div className="space-y-4 text-sm">
                  <p className="text-muted-foreground">
                    All latest jobs will be posted here. To join us, you must follow all our social media pages.
                  </p>
                  <div className="flex items-center justify-center gap-4 py-4">
                    <a
                      href="https://instagram.com/maishboutique"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a
                      href="https://facebook.com/maishboutique"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href="https://twitter.com/maishboutique"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.tiktok.com/@maish_boutique1?is_from_webapp=1&sender_device=pc"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <TikTokIcon className="w-5 h-5" />
                    </a>
                    <a
                      href="https://linkedin.com/company/maishboutique"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              )}

              {/* Contact Modal */}
              {activeModal === 'contact' && (
                <div className="space-y-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium mb-2">Contact Us</p>
                    <p className="text-muted-foreground mb-4">
                      We'd love to hear from you! Reach out to us through WhatsApp or email.
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://wa.me/254799921036"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#20BD5C] transition-colors"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      Chat on WhatsApp
                    </a>
                    <a
                      href="mailto:maishboutiquemarketing@gmail.com"
                      className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      Email Us
                    </a>
                  </div>
                </div>
              )}

              {/* Size Guide Modal */}
              {activeModal === 'size-guide' && (
                <div className="space-y-4 text-sm">
                  <p className="font-medium">Available sizes:</p>
                  <p className="text-muted-foreground">XS, SMALL, MEDIUM, LARGE, XL, XXL</p>
                  
                  <p className="text-muted-foreground mt-4">
                    For more info about the sizes and colours contact us on WhatsApp using the Emergency number. We have our Agent Online Marketer who will assist you with your order.
                  </p>
                  
                  <div className="flex flex-col gap-3 mt-4">
                    <a
                      href="https://wa.me/254799921036"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#20BD5C] transition-colors"
                    >
                      <WhatsAppIcon className="w-5 h-5" />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
