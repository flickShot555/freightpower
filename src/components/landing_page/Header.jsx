import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/landing_page/header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const ids = ['features','how-it-works','testimonials','about','pricing'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

  // Account for fixed header by calculating header height at runtime and using a negative top rootMargin.
  // Use multiple thresholds and pick the section with the largest intersectionRatio to determine the active section.
  const headerEl = document.querySelector('.header');
  const headerHeight = headerEl ? Math.ceil(headerEl.getBoundingClientRect().height) : 64; // px
  const observer = new IntersectionObserver((entries) => {
      // Find the entry with the largest intersectionRatio
      let maxEntry = null;
      entries.forEach(entry => {
        if (!maxEntry || entry.intersectionRatio > maxEntry.intersectionRatio) {
          maxEntry = entry;
        }
      });

      if (maxEntry && maxEntry.isIntersecting) {
        setActiveSection(maxEntry.target.id);
      }
  }, { root: null, rootMargin: `-${headerHeight}px 0px 0px 0px`, threshold: [0, 0.25, 0.5, 0.75, 1] });

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Fallback/robust active-section detection using scroll position and header height.
  // This ensures the nav updates even if IntersectionObserver misses short sections or timing.
  useEffect(() => {
    const ids = ['features','how-it-works','testimonials','about','pricing'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    const getHeaderHeight = () => {
      const headerEl = document.querySelector('.header');
      return headerEl ? headerEl.getBoundingClientRect().height : 64;
    };

    const onScrollActive = () => {
      const headerH = getHeaderHeight();
      const scrollPosition = window.scrollY + headerH + 2; // small buffer

      // Find the section whose top is closest to the scrollPosition
      let closest = null;
      let closestDistance = Infinity;
      for (let i = 0; i < sections.length; i++) {
        const s = sections[i];
        const top = s.offsetTop;
        const distance = Math.abs(top - scrollPosition);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = s;
        }
      }

      if (closest && closest.id && activeSection !== closest.id) {
        setActiveSection(closest.id);
      }
    };

    window.addEventListener('scroll', onScrollActive, { passive: true });
    // run once to set initial active
    onScrollActive();

    return () => window.removeEventListener('scroll', onScrollActive);
  }, [activeSection]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
    // close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : 'transparent'}`}>
      <div className="landing-header-container">
        <div className="landing-header-content">
          {/* Logo */}
          <div className="logo">
            <Link 
              to="/" 
              className="logo-text"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              FreightPower
            </Link>
          </div>

          {/* Navigation Menu */}
          <nav className="landing-nav">
            <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className={`landing-nav-link ${activeSection === 'features' ? 'active' : ''} ${isScrolled ? 'scrolled' : 'transparent'}`}>
              Features
            </a>
            <a href="#how-it-works" onClick={(e) => handleNavClick(e, 'how-it-works')} className={`landing-nav-link ${activeSection === 'how-it-works' ? 'active' : ''} ${isScrolled ? 'scrolled' : 'transparent'}`}>
              How it Works
            </a>
            <a href="#testimonials" onClick={(e) => handleNavClick(e, 'testimonials')} className={`landing-nav-link ${activeSection === 'testimonials' ? 'active' : ''} ${isScrolled ? 'scrolled' : 'transparent'}`}>
              Marketplace
            </a>
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className={`landing-nav-link ${activeSection === 'about' ? 'active' : ''} ${isScrolled ? 'scrolled' : 'transparent'}`}>
              About Us
            </a>
            <a href="#pricing" onClick={(e) => handleNavClick(e, 'pricing')} className={`landing-nav-link ${activeSection === 'pricing' ? 'active' : ''} ${isScrolled ? 'scrolled' : 'transparent'}`}>
              Pricing
            </a>
          </nav>

          {/* CTA Button */}
          <div className="cta-section">
            <Link to="/login" className="login-button">
              Login
            </Link>
            <Link to="/select-role" className="signup-button">
              Sign up
            </Link>

            {/* Mobile menu button */}
            <button 
              className={`mobile-menu-button ${isScrolled ? 'scrolled' : 'transparent'}`}
              onClick={toggleMobileMenu}
            >
              <svg className={`mobile-menu-icon ${isScrolled ? 'scrolled' : 'transparent'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-nav">
            <nav className="mobile-nav-content">
              <a href="#features" className={`mobile-nav-link ${activeSection === 'features' ? 'active' : ''}`} onClick={(e) => { handleNavClick(e, 'features'); }}>
                Features
              </a>
              <a href="#how-it-works" className={`mobile-nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`} onClick={(e) => { handleNavClick(e, 'how-it-works'); }}>
                How it Works
              </a>
              <a href="#testimonials" className={`mobile-nav-link ${activeSection === 'testimonials' ? 'active' : ''}`} onClick={(e) => { handleNavClick(e, 'testimonials'); }}>
                Testimonials
              </a>
              <a href="#about" className={`mobile-nav-link ${activeSection === 'about' ? 'active' : ''}`} onClick={(e) => { handleNavClick(e, 'about'); }}>
                About
              </a>
              <a href="#pricing" className={`mobile-nav-link ${activeSection === 'pricing' ? 'active' : ''}`} onClick={(e) => { handleNavClick(e, 'pricing'); }}>
                Pricing
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}