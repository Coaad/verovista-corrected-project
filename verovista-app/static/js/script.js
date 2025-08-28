/**
 * VeroVista - Interactive JavaScript
 * Handles search, animations, AJAX calls, and user interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // --- DOM Elements ---
    const searchForm = document.getElementById('search-form');
    const queryInput = document.getElementById('search-query');
    const resultsContainer = document.getElementById('results-container');
    const searchButton = document.getElementById('search-button');

    // --- Initialize App ---
    initializeApp();

    function initializeApp() {
        setupEventListeners();
        setupAnimations();
        initializeFlashMessages();

        // Focus search input if present
        if (queryInput) {
            queryInput.focus();
        }

        console.log('VeroVista initialized successfully');
    }

    // --- Event Listeners ---
    function setupEventListeners() {
        // Search form submission
        if (searchForm) {
            searchForm.addEventListener('submit', handleSearchSubmit);
        }

        // Category card clicks
        document.addEventListener('click', handleCategoryClick);

        // Product link clicks (for history tracking)
        document.addEventListener('click', handleProductClick);

        // Search input enhancements
        if (queryInput) {
            queryInput.addEventListener('input', debounce(handleSearchInput, 300));
            queryInput.addEventListener('keydown', handleSearchKeydown);
        }

        // Smooth scroll for anchor links
        document.addEventListener('click', handleSmoothScroll);

        // Flash message close buttons
        document.addEventListener('click', handleFlashMessageClose);
    }

    // --- Search Functionality ---
    async function handleSearchSubmit(e) {
        e.preventDefault();
        const query = queryInput.value.trim();

        if (!query) {
            showNotification('Please enter a search term', 'warning');
            return;
        }

        await performSearch(query);
    }

    async function performSearch(query, useAjax = true) {
        if (!query.trim()) return;

        // Update URL without page reload
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('q', query);
        history.replaceState({}, '', newUrl);

        if (useAjax && resultsContainer) {
            await performAjaxSearch(query);
        } else {
            // Fallback to regular form submission
            window.location.href = `/search?query=${encodeURIComponent(query)}`;
        }
    }

    async function performAjaxSearch(query) {
        setLoadingState(true);

        try {
            const response = await fetch(`/search-ajax?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            displaySearchResults(data.products, data.query);

            // Scroll to results
            if (resultsContainer && data.products.length > 0) {
                resultsContainer.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }

        } catch (error) {
            console.error('AJAX Search Error:', error);
            displaySearchError(error.message);
        } finally {
            setLoadingState(false);
            setupAnimations(); // Re-initialize animations for new content
        }
    }

    function displaySearchResults(products, query) {
        if (!resultsContainer) return;

        let html = `
            <div class="results-header animate-on-scroll">
                <h2 class="page-title">
                    <i class="fas fa-search-plus"></i> Results for "${escapeHtml(query)}"
                </h2>
                <div class="results-count">
                    ${products.length > 0 
                        ? `Found ${products.length} product${products.length !== 1 ? 's' : ''}` 
                        : 'No products found'
                    }
                </div>
            </div>
        `;

        if (products.length === 0) {
            html += `
                <div class="no-results animate-on-scroll">
                    <div class="no-results-icon">
                        <i class="fas fa-search-minus"></i>
                    </div>
                    <h2>No products found for "${escapeHtml(query)}"</h2>
                    <p>Try searching for:</p>
                    <ul class="search-suggestions">
                        <li><a href="#" onclick="searchFor('iphone'); return false;">iPhone</a></li>
                        <li><a href="#" onclick="searchFor('nike shoes'); return false;">Nike Shoes</a></li>
                        <li><a href="#" onclick="searchFor('laptop'); return false;">Laptop</a></li>
                        <li><a href="#" onclick="searchFor('headphones'); return false;">Headphones</a></li>
                    </ul>
                </div>
            `;
        } else {
            const productCards = products.map(product => `
                <div class="product-card animate-on-scroll" data-product-id="${escapeHtml(product.product_id)}">
                    <a href="/product/${escapeHtml(product.product_id)}" class="product-link">
                        <div class="image-container">
                            <img src="${escapeHtml(product.image_url)}" 
                                 alt="${escapeHtml(product.name)}" 
                                 loading="lazy">
                            <div class="category-badge">${escapeHtml(product.category)}</div>
                        </div>
                        <div class="card-content">
                            <h3 class="product-title">${escapeHtml(truncateText(product.name, 60))}</h3>
                            <p class="product-brand">${escapeHtml(product.brand)}</p>
                            <div class="price-section">
                                ${product.offers && product.offers.length > 0 ? `
                                    <div class="price-info">
                                        <span class="price">₹${Math.round(product.offers[0].price).toLocaleString()}</span>
                                        <span class="platform">on ${escapeHtml(product.offers[0].platform)}</span>
                                    </div>
                                    ${product.offers[0].rating ? `
                                        <div class="rating">
                                            <i class="fas fa-star"></i> ${product.offers[0].rating.toFixed(1)}/5
                                        </div>
                                    ` : ''}
                                    ${product.offers.length > 1 ? `
                                        <div class="offers-count">
                                            +${product.offers.length - 1} more offer${product.offers.length > 2 ? 's' : ''}
                                        </div>
                                    ` : ''}
                                ` : `
                                    <div class="price-info">
                                        <span class="price-na">Price N/A</span>
                                    </div>
                                `}
                            </div>
                        </div>
                    </a>
                </div>
            `).join('');

            html += `<div class="results-grid">${productCards}</div>`;
        }

        resultsContainer.innerHTML = html;
    }

    function displaySearchError(message) {
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
            <div class="search-error animate-on-scroll">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3>Search Error</h3>
                <p>${escapeHtml(message)}</p>
                <button onclick="location.reload()" class="cta-button secondary">
                    <i class="fas fa-refresh"></i> Try Again
                </button>
            </div>
        `;
    }

    // --- UI State Management ---
    function setLoadingState(isLoading) {
        if (!searchButton) return;

        const buttonText = searchButton.querySelector('#button-text');
        const loadingSpinner = searchButton.querySelector('#loading-spinner');

        searchButton.disabled = isLoading;

        if (buttonText) {
            buttonText.textContent = isLoading ? 'Searching...' : 'Search VeroVista';
        }

        if (loadingSpinner) {
            loadingSpinner.classList.toggle('hidden', !isLoading);
        }

        if (queryInput) {
            queryInput.disabled = isLoading;
        }

        // Show loading in results container
        if (isLoading && resultsContainer) {
            resultsContainer.innerHTML = `
                <div class="search-loading" style="text-align: center; padding: 3rem 0;">
                    <div style="font-size: 3rem; color: var(--accent-yellow); margin-bottom: 1rem;">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <h3 style="color: var(--heading-color); margin-bottom: 0.5rem;">Searching...</h3>
                    <p style="color: var(--secondary-text);">Finding the best deals for you</p>
                </div>
            `;
        }
    }

    // --- Click Handlers ---
    function handleCategoryClick(e) {
        const categoryCard = e.target.closest('.category-card');
        if (!categoryCard) return;

        e.preventDefault();

        const query = categoryCard.dataset.query;
        if (query && queryInput) {
            queryInput.value = query;
            performSearch(query);
        }
    }

    function handleProductClick(e) {
        const productLink = e.target.closest('[data-product-id] a, .feature-card[data-product-id]');
        if (!productLink) return;

        const productContainer = productLink.closest('[data-product-id]');
        const productId = productContainer?.dataset.productId;

        if (productId) {
            addToHistory(productId);

            // Visual feedback
            productContainer.style.transform = 'scale(0.98)';
            setTimeout(() => {
                if (productContainer) {
                    productContainer.style.transform = '';
                }
            }, 150);
        }
    }

    function handleSmoothScroll(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) return;

        const href = link.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();

        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        } else if (href === '#search-section-anchor') {
            // Special case for search anchor
            const searchSection = document.querySelector('.search-section');
            if (searchSection) {
                searchSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    }

    function handleFlashMessageClose(e) {
        if (e.target.classList.contains('close-btn')) {
            const flashMessage = e.target.closest('.flash-message');
            if (flashMessage) {
                flashMessage.style.animation = 'slideOut 0.3s ease-out forwards';
                setTimeout(() => flashMessage.remove(), 300);
            }
        }
    }

    // --- Search Input Enhancements ---
    function handleSearchInput(e) {
        const query = e.target.value.trim();

        // Add input validation styling
        if (query.length > 0) {
            e.target.style.borderColor = 'var(--success-color)';
        } else {
            e.target.style.borderColor = '';
        }
    }

    function handleSearchKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (searchForm) {
                searchForm.dispatchEvent(new Event('submit'));
            }
        }
    }

    // --- History Management ---
    async function addToHistory(productId) {
        try {
            const response = await fetch('/api/add-to-history', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ product_id: productId })
            });

            if (response.ok) {
                console.log('Added to history:', productId);
            }
        } catch (error) {
            console.warn('Failed to add to history:', error);
        }
    }

    // --- Animations ---
    function setupAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');

        // Remove existing observer if any
        if (window.veroVistaObserver) {
            window.veroVistaObserver.disconnect();
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.opacity = '1';
                    element.style.animation = 'fadeInUp 0.6s ease-out forwards';
                    observer.unobserve(element);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
        });

        animatedElements.forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });

        window.veroVistaObserver = observer;
    }

    // --- Flash Messages ---
    function initializeFlashMessages() {
        const flashMessages = document.querySelectorAll('.flash-message');

        flashMessages.forEach((message, index) => {
            // Auto-hide success messages after 5 seconds
            if (message.classList.contains('success')) {
                setTimeout(() => {
                    if (message.parentNode) {
                        message.style.animation = 'slideOut 0.3s ease-out forwards';
                        setTimeout(() => message.remove(), 300);
                    }
                }, 5000 + (index * 500));
            }
        });
    }

    function showNotification(message, type = 'info') {
        const container = document.querySelector('.flash-messages-container') || 
                         document.querySelector('.container');

        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `flash-message ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center;">
                <i class="fas fa-info-circle" style="margin-right: 0.75rem;"></i>
                ${escapeHtml(message)}
            </div>
            <button class="close-btn" onclick="this.parentElement.remove()">×</button>
        `;

        if (container.classList.contains('flash-messages-container')) {
            container.appendChild(notification);
        } else {
            const messagesContainer = document.createElement('div');
            messagesContainer.className = 'flash-messages-container';
            messagesContainer.appendChild(notification);
            container.insertBefore(messagesContainer, container.firstChild);
        }

        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 4000);
    }

    // --- Utility Functions ---
    function escapeHtml(unsafe) {
        if (typeof unsafe !== 'string') return '';
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // --- Global Functions (for inline handlers) ---
    window.searchFor = function(query) {
        if (queryInput) {
            queryInput.value = query;
            performSearch(query);
        } else {
            window.location.href = `/search?query=${encodeURIComponent(query)}`;
        }
    };

    window.clearHistory = function() {
        if (confirm('Are you sure you want to clear all your search history? This action cannot be undone.')) {
            showNotification('History clearing is not implemented in this demo', 'info');
        }
    };

    window.removeFromHistory = function(productId) {
        if (confirm('Remove this product from your history?')) {
            const card = document.querySelector(`[data-product-id="${productId}"]`);
            if (card) {
                card.style.animation = 'fadeOut 0.3s ease-out forwards';
                setTimeout(() => {
                    card.remove();
                    showNotification('Product removed from history', 'success');
                }, 300);
            }
        }
    };

    // --- Error Handling ---
    window.addEventListener('error', function(e) {
        console.error('JavaScript Error:', e.error);
        // Could send error to logging service here
    });

    window.addEventListener('unhandledrejection', function(e) {
        console.error('Unhandled Promise Rejection:', e.reason);
        // Could send error to logging service here
    });

    // --- Performance Monitoring ---
    if ('performance' in window) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                const perfData = window.performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
            }, 0);
        });
    }
});

// --- Additional CSS Animations ---
const additionalStyles = document.createElement('style');
additionalStyles.innerHTML = `
    @keyframes slideOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }

    @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.9); }
    }

    .search-error {
        text-align: center;
        padding: 3rem 2rem;
        background: var(--content-bg);
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--error-color);
    }

    .search-error .error-icon {
        font-size: 3rem;
        color: var(--error-color);
        margin-bottom: 1rem;
    }

    .search-error h3 {
        color: var(--heading-color);
        margin-bottom: 1rem;
    }

    .search-error p {
        color: var(--secondary-text);
        margin-bottom: 2rem;
    }

    .no-results {
        text-align: center;
        padding: 3rem 2rem;
        background: var(--content-bg);
        border-radius: var(--border-radius-lg);
        border: 1px solid var(--border-color);
    }

    .no-results-icon {
        font-size: 4rem;
        color: var(--secondary-text);
        margin-bottom: 2rem;
        opacity: 0.7;
    }

    .no-results h2 {
        color: var(--heading-color);
        margin-bottom: 1rem;
    }

    .no-results p {
        color: var(--secondary-text);
        margin-bottom: 1.5rem;
    }

    .search-suggestions {
        list-style: none;
        padding: 0;
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
        margin-bottom: 2rem;
    }

    .search-suggestions a {
        padding: 0.5rem 1rem;
        background: var(--secondary-bg);
        color: var(--link-color);
        border-radius: 20px;
        text-decoration: none;
        transition: all 0.3s ease;
        border: 1px solid var(--border-color);
    }

    .search-suggestions a:hover {
        background: var(--accent-yellow);
        color: #111;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(additionalStyles);