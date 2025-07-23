/**
 * Xploreon Custom Cursor - Circular Only Version
 * Simple and reliable circular cursor implementation
 */

(function() {
    'use strict';
    
    console.log('🚀 Loading Xploreon Circular Cursor...');
    
    // Check if we're on a desktop device
    const isDesktop = window.innerWidth >= 768 && 
                     window.matchMedia('(pointer: fine)').matches && 
                     !('ontouchstart' in window);
    
    console.log('Desktop detected:', isDesktop);
    
    if (!isDesktop) {
        console.log('📱 Mobile device detected - cursor disabled');
        return;
    }
    
    class XploreonCircularCursor {
        constructor() {
            this.cursor = null;
            this.mouseX = 0;
            this.mouseY = 0;
            this.isVisible = false;
            this.trailEnabled = true;
            this.lastTrailTime = 0;
            
            this.init();
        }
        
        init() {
            console.log('🎯 Initializing circular cursor...');
            this.createCursor();
            this.bindEvents();
            this.startAnimation();
            
            // Small delay to ensure everything is loaded
            setTimeout(() => {
                this.show();
                console.log('✅ Circular cursor initialized successfully!');
            }, 100);
        }
        
        createCursor() {
            // Remove any existing cursor
            const existing = document.querySelector('.xploreon-cursor');
            if (existing) {
                existing.remove();
            }
            
            this.cursor = document.createElement('div');
            this.cursor.className = 'xploreon-cursor';
            this.cursor.style.position = 'fixed';
            this.cursor.style.zIndex = '999999';
            this.cursor.style.pointerEvents = 'none';
            this.cursor.style.opacity = '0';
            
            document.body.appendChild(this.cursor);
            console.log('🎨 Circular cursor element created');
        }
        
        bindEvents() {
            // Mouse movement
            document.addEventListener('mousemove', (e) => {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                
                if (!this.isVisible) {
                    this.show();
                }
                
                // Create trail
                if (this.trailEnabled && Date.now() - this.lastTrailTime > 100) {
                    this.createTrail(e.clientX, e.clientY);
                    this.lastTrailTime = Date.now();
                }
            });
            
            // Mouse enter/leave document
            document.addEventListener('mouseenter', () => this.show());
            document.addEventListener('mouseleave', () => this.hide());
            
            // Click events
            document.addEventListener('mousedown', () => {
                if (this.cursor) {
                    this.cursor.classList.add('active');
                }
            });
            
            document.addEventListener('mouseup', () => {
                if (this.cursor) {
                    this.cursor.classList.remove('active');
                }
            });
            
            // Hover effects
            this.setupHoverEffects();
            
            // Page visibility
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.hide();
                } else {
                    this.show();
                }
            });
            
            console.log('📡 Event listeners bound');
        }
        
        setupHoverEffects() {
            // Define interactive elements
            const interactiveSelectors = [
                'a', 'button', 'input', 'textarea', 'select',
                '[role="button"]', '.clickable', '.futuristic-button',
                '.nav-link', '.quick-action', '.chatbot-toggle',
                '.send-button', '.mic-button', '.close-btn',
                '.menu-toggle-btn', '.mobile-nav-link'
            ].join(', ');
            
            const buttonSelectors = [
                'button', '.futuristic-button', '.chatbot-toggle',
                '.send-button', '.mic-button', '[role="button"]'
            ].join(', ');
            
            const textSelectors = [
                'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'span', 'div', 'article', 'section'
            ].join(', ');
            
            // Use event delegation for better performance
            document.addEventListener('mouseover', (e) => {
                if (!this.cursor) return;
                
                const target = e.target;
                
                if (target.matches(interactiveSelectors) || target.closest(interactiveSelectors)) {
                    this.cursor.classList.add('hover');
                    
                    // Special button effects
                    if (target.matches(buttonSelectors) || target.closest(buttonSelectors)) {
                        this.cursor.classList.add('button');
                    }
                } else if (target.matches(textSelectors) && this.isTextElement(target)) {
                    // Still circular but different effect for text
                    this.cursor.classList.add('text');
                }
            });
            
            document.addEventListener('mouseout', (e) => {
                if (!this.cursor) return;
                
                const target = e.target;
                
                if (target.matches(interactiveSelectors) || target.closest(interactiveSelectors)) {
                    this.cursor.classList.remove('hover', 'button');
                } else if (target.matches(textSelectors)) {
                    this.cursor.classList.remove('text');
                }
            });
        }
        
        isTextElement(element) {
            const style = window.getComputedStyle(element);
            return style.userSelect !== 'none' && 
                   element.tagName !== 'BUTTON' && 
                   element.tagName !== 'A' &&
                   element.textContent.trim().length > 0;
        }
        
        createTrail(x, y) {
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.position = 'fixed';
            trail.style.left = x + 'px';
            trail.style.top = y + 'px';
            trail.style.transform = 'translate(-50%, -50%)';
            trail.style.pointerEvents = 'none';
            trail.style.zIndex = '999998';
            
            document.body.appendChild(trail);
            
            // Remove after animation
            setTimeout(() => {
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                }
            }, 600);
        }
        
        startAnimation() {
            const animate = () => {
                if (this.cursor && this.isVisible) {
                    this.cursor.style.left = this.mouseX + 'px';
                    this.cursor.style.top = this.mouseY + 'px';
                }
                requestAnimationFrame(animate);
            };
            animate();
        }
        
        show() {
            if (this.cursor && !this.isVisible) {
                this.cursor.style.opacity = '1';
                this.isVisible = true;
            }
        }
        
        hide() {
            if (this.cursor && this.isVisible) {
                this.cursor.style.opacity = '0';
                this.isVisible = false;
            }
        }
        
        // Public methods
        showLoading() {
            if (this.cursor) {
                this.cursor.classList.add('loading');
            }
        }
        
        hideLoading() {
            if (this.cursor) {
                this.cursor.classList.remove('loading');
            }
        }
        
        toggleTrail(enabled) {
            this.trailEnabled = enabled !== undefined ? enabled : !this.trailEnabled;
        }
        
        destroy() {
            if (this.cursor && this.cursor.parentNode) {
                this.cursor.parentNode.removeChild(this.cursor);
            }
            
            // Clean up trails
            const trails = document.querySelectorAll('.cursor-trail');
            trails.forEach(trail => {
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                }
            });
            
            console.log('🗑️ Circular cursor destroyed');
        }
    }
    
    // Initialize when DOM is ready
    function initCursor() {
        const cursor = new XploreonCircularCursor();
        
        // Make globally available
        window.XploreonCursor = cursor;
        
        // Integration with existing loading system
        const originalShowLoading = window.showLoading;
        if (originalShowLoading) {
            window.showLoading = function() {
                originalShowLoading.apply(this, arguments);
                cursor.showLoading();
            };
        }
        
        const originalHideLoading = window.hideLoading;
        if (originalHideLoading) {
            window.hideLoading = function() {
                originalHideLoading.apply(this, arguments);
                cursor.hideLoading();
            };
        }
    }
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCursor);
    } else {
        initCursor();
    }
    
})();