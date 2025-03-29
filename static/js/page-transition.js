/**
 * Optimized Page Transition Manager
 * Improved performance for smoother transitions with reduced jitter
 * Uses requestAnimationFrame and GPU-accelerated properties
 */

document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on non-touch devices or if performance API is available
    // This helps reduce lag on mobile devices
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Early exit if the user prefers reduced motion or is on a mobile device
    if (isReducedMotion || ('ontouchstart' in window && window.innerWidth < 768)) {
        // For mobile or reduced motion preference, use minimal transitions
        const minimalStyle = document.createElement('style');
        minimalStyle.textContent = `
            a { transition: none !important; }
        `;
        document.head.appendChild(minimalStyle);
        return;
    }
    
    // Cache DOM references
    const body = document.body;
    const links = document.querySelectorAll('a:not([target="_blank"]):not([href^="#"]):not([href^="mailto:"])');
    let isTransitioning = false; // Track transition state to prevent duplicate transitions
    
    // Create progress indicator element with hardware-accelerated properties
    const progressIndicator = document.createElement('div');
    progressIndicator.className = 'page-transition-progress';
    document.body.appendChild(progressIndicator);
    
    // Add optimized styles for progress indicator
    const style = document.createElement('style');
    style.textContent = `
        .page-transition-progress {
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            width: 0%;
            background-color: #4285f4;
            z-index: 9999;
            transform: translateZ(0); /* GPU acceleration */
            will-change: width; /* Hint to browser for optimization */
            transition: width 0.25s cubic-bezier(0.4, 0.0, 0.2, 1); /* Material Design easing */
        }
        
        .page-transitioning {
            pointer-events: none; /* Prevent further interaction during transition */
        }
        
        /* Optimize transitions on ranking page to minimize jitter */
        .ranking-page .dataTables_wrapper {
            transform: translateZ(0); /* GPU acceleration */
            will-change: transform; /* Hint to browser for optimization */
        }
        
        /* Preload class - applied on initial page load */
        .preload * {
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Add a class to the body to identify the current page
    const path = window.location.pathname;
    if (path.includes('/ranking')) {
        body.classList.add('ranking-page');
    }
    
    // Remove preload class which prevents transitions during initial page load
    // Use requestAnimationFrame for better timing with browser rendering
    requestAnimationFrame(() => {
        body.classList.remove('preload');
    });
    
    // Optimized transition functions with better performance
    function startTransition() {
        if (isTransitioning) return; // Prevent multiple transitions
        
        isTransitioning = true;
        
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
            progressIndicator.style.width = '40%';
            body.classList.add('page-transitioning');
        });
    }
    
    function completeTransition() {
        requestAnimationFrame(() => {
            progressIndicator.style.width = '100%';
            
            // Wait for transition to complete before resetting
            setTimeout(() => {
                requestAnimationFrame(() => {
                    // Fade out transition effect
                    progressIndicator.style.opacity = '0';
                    body.classList.remove('page-transitioning');
                    
                    // Reset for next transition
                    setTimeout(() => {
                        progressIndicator.style.width = '0%';
                        progressIndicator.style.opacity = '1';
                        isTransitioning = false;
                    }, 300);
                });
            }, 150);
        });
    }
    
    // Initialize transition event listeners with optimized handling
    links.forEach(link => {
        if (!link.getAttribute('href')) return; // Skip links without href
        
        const href = link.getAttribute('href');
        if (href.startsWith('/') || 
            href.startsWith(window.location.origin) ||
            !href.includes('://')) {
            
            link.addEventListener('click', function(e) {
                // Don't handle if modifier keys are pressed
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                
                // Start transition effect
                startTransition();
            });
        }
    });
    
    // Handle browser back/forward navigation
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            completeTransition();
        }
    });
    
    // Complete transition when page is fully loaded
    window.addEventListener('load', completeTransition);
});