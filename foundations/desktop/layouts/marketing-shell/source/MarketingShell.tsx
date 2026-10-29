import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { MarketingShellProps } from './types';

export const MarketingShell: React.FC<MarketingShellProps> = ({
  brandSlot,
  navItems = [],
  actionsSlot,
  announcementSlot,
  footerSlot,
  children,
  stickyHeader = true,
  borderedHeader = true,
  maxWidth = '7xl',
  className = '',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const maxWidthClass = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  }[maxWidth] || 'max-w-7xl';

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${className}`}>
      {/* Optional Top Announcement Bar */}
      {announcementSlot && (
        <div className="w-full border-b border-border bg-muted/50 text-xs text-muted-foreground py-2 px-4 text-center">
          {announcementSlot}
        </div>
      )}

      {/* Header Bar */}
      <header
        className={`w-full z-40 transition-colors ${
          stickyHeader ? 'sticky top-0 backdrop-blur-md bg-background/80' : 'relative bg-background'
        } ${borderedHeader ? 'border-b border-border' : ''}`}
      >
        <div className={`mx-auto ${maxWidthClass} px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between`}>
          {/* Brand Slot */}
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0 flex items-center">
              {brandSlot || <span className="font-semibold text-lg tracking-tight">App</span>}
            </div>

            {/* Desktop Navigation Links */}
            {navItems.length > 0 && (
              <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
                {navItems.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    onClick={item.onClick}
                    className={`text-sm font-medium transition-colors hover:text-foreground ${
                      item.active ? 'text-foreground font-semibold' : 'text-muted-foreground'
                    }`}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            )}
          </div>

          {/* Desktop Actions Slot */}
          <div className="hidden md:flex items-center gap-3">
            {actionsSlot}
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {actionsSlot}
            {navItems.length > 0 && (
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && navItems.length > 0 && (
          <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  if (item.onClick) item.onClick();
                }}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  item.active
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </header>

      {/* Main Neutral Blank Content Area */}
      <main className={`flex-1 w-full mx-auto ${maxWidthClass} px-4 sm:px-6 lg:px-8 py-8`}>
        {children}
      </main>

      {/* Optional Footer Slot */}
      {footerSlot && (
        <footer className="w-full border-t border-border bg-muted/20 py-8 px-4 sm:px-6 lg:px-8">
          <div className={`mx-auto ${maxWidthClass}`}>
            {footerSlot}
          </div>
        </footer>
      )}
    </div>
  );
};
