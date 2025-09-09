document.addEventListener('DOMContentLoaded', function() {
    // Create the back-to-top button
    const backToTopButton = document.createElement('button');
    backToTopButton.id = 'back-to-top';
    backToTopButton.className = 'back-to-top';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    
    // Add SVG icon
    
    backToTopButton.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
    `;

   /*
   backToTopButton.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 19V5M5 12l7-7 7 7"/>
        </svg>
    `;
    */
    // Add the button to the body
    document.body.appendChild(backToTopButton);
    
    const scrollThreshold = 300;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > scrollThreshold) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    });

    // Smooth scroll to top when clicked
    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});