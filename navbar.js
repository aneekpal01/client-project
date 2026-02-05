function isMobile() {
    return $(window).width() < 992;
}

function setBodyMegaLock(active) {
    if (active) {
        $('body').addClass('mega-menu-open');
    } else {
        $('body').removeClass('mega-menu-open');
    }
}

function handleMegaMenuShow($menuItem) {
    var $menu = $menuItem.find('.mega-menu');

    if (isMobile()) {
        // Mobile: Toggle menu on click
        $menuItem.toggleClass('active');
        if ($menuItem.hasClass('active')) {
            $menu.slideDown(300).addClass('show');
        } else {
            $menu.slideUp(300).removeClass('show');
        }
    } else {
        // Desktop: Show on hover
        $menu.stop(true, true).fadeIn(200);

        // Dynamic positioning to prevent overflow
        setTimeout(function () {
            var menuWidth = $menu.outerWidth() || $menu[0].scrollWidth;
            var menuItemOffset = $menuItem.offset();
            var menuItemWidth = $menuItem.outerWidth();
            var windowWidth = $(window).width();
            var scrollLeft = $(window).scrollLeft();
            var padding = 20; // Minimum padding from viewport edge

            // All mega menus expand to the right from left edge
            var menuLeftEdge = menuItemOffset.left;
            var menuRightIfLeftAligned = menuLeftEdge + menuWidth;

            // Force left alignment for all menus
            $menu.removeClass('right-aligned viewport-aligned');

            // Base positioning rules - all menus expand from left to right
            // Force left alignment with !important to override any CSS conflicts
            var baseRules = {
                'left': '0 !important',
                'right': 'auto !important',
                'transform-origin': 'top left !important'
            };

            // Check if menu would overflow right side
            if (menuRightIfLeftAligned > windowWidth - padding) {
                // Menu would overflow right - adjust to fit within viewport
                var maxAllowedRight = windowWidth - padding;
                var adjustedLeft = Math.max(padding, maxAllowedRight - menuWidth);
                baseRules.left = adjustedLeft + 'px !important';
                baseRules['max-width'] = (windowWidth - menuItemOffset.left - padding) + 'px';
            } else if (menuLeftEdge < padding) {
                // Menu too close to left edge
                baseRules.left = padding + 'px !important';
                baseRules['max-width'] = (windowWidth - padding * 2) + 'px';
            } else {
                // Default left alignment - expand to the right
                baseRules.left = '0 !important';
                baseRules['max-width'] = 'none';
            }

            // For screens < 1900px, ensure responsive sizing
            if (windowWidth < 1900) {
                baseRules['max-height'] = '85vh';
                baseRules['overflow-y'] = 'auto';
                baseRules['overflow-x'] = 'hidden';
            } else {
                // Screens >= 1900px - full width, no scrolling
                baseRules['max-height'] = 'none';
                baseRules['overflow-y'] = 'visible';
                baseRules['overflow-x'] = 'visible';
            }

            // Apply all rules
            $menu.css(baseRules);
        }, 50);
    }
}

function handleMegaMenuHide($menuItem) {
    if (!isMobile()) {
        var $menu = $menuItem.find('.mega-menu');
        $menu.stop(true, true).fadeOut(200);
        $menuItem.removeClass('active');
    }
}

$(document).ready(function () {

    // Desktop: Hover functionality
    $('.mega-menu-item').hover(
        function () {
            if (!isMobile()) {
                handleMegaMenuShow($(this));
            }
        },
        function () {
            if (!isMobile()) {
                handleMegaMenuHide($(this));
            }
        }
    );

    // Mobile: Click functionality
    $('.mega-menu-item .nav-link').on('click', function (e) {
        if (isMobile()) {
            e.preventDefault();
            e.stopPropagation();
            var $menuItem = $(this).closest('.mega-menu-item');
            var $menu = $menuItem.find('.mega-menu');

            // Toggle current menu
            if ($menuItem.hasClass('active')) {
                $menuItem.removeClass('active');
                $menu.slideUp(300, function () {
                    $(this).removeClass('show');
                });
                // If nothing else is open, allow body scroll again
                setTimeout(function () {
                    if (!$('.mega-menu.show').length) {
                        setBodyMegaLock(false);
                    }
                }, 320);
            } else {
                // Close other menus first
                $('.mega-menu-item').not($menuItem).removeClass('active')
                    .find('.mega-menu').slideUp(300, function () {
                        $(this).removeClass('show');
                    });

                // Open current menu
                $menuItem.addClass('active');
                $menu.addClass('show').slideDown(300);
                setBodyMegaLock(true);
            }
        }
    });

    // Recalculate on window resize
    var resizeTimeout;
    $(window).on('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            if (!isMobile()) {
                // Desktop mode - reposition all visible menus
                $('.mega-menu-item:hover .mega-menu').each(function () {
                    var $menu = $(this);
                    var $menuItem = $menu.closest('.mega-menu-item');

                    if ($menu.is(':visible')) {
                        var menuWidth = $menu.outerWidth() || $menu[0].scrollWidth;
                        var menuItemOffset = $menuItem.offset();
                        var menuItemWidth = $menuItem.outerWidth();
                        var windowWidth = $(window).width();
                        var padding = 20;

                        // All mega menus expand to the right from left edge
                        var menuLeftEdge = menuItemOffset.left;
                        var menuRightIfLeftAligned = menuLeftEdge + menuWidth;

                        // Force left alignment for all menus
                        $menu.removeClass('right-aligned viewport-aligned');

                        // Base positioning rules - all menus expand from left to right
                        // Force left alignment with !important to override any CSS conflicts
                        var baseRules = {
                            'left': '0 !important',
                            'right': 'auto !important',
                            'transform-origin': 'top left !important'
                        };

                        if (menuRightIfLeftAligned > windowWidth - padding) {
                            // Menu would overflow right - adjust to fit within viewport
                            var maxAllowedRight = windowWidth - padding;
                            var adjustedLeft = Math.max(padding, maxAllowedRight - menuWidth);
                            baseRules.left = adjustedLeft + 'px !important';
                            baseRules['max-width'] = (windowWidth - menuItemOffset.left - padding) + 'px';
                        } else if (menuLeftEdge < padding) {
                            // Menu too close to left edge
                            baseRules.left = padding + 'px !important';
                            baseRules['max-width'] = (windowWidth - padding * 2) + 'px';
                        } else {
                            // Default left alignment - expand to the right
                            baseRules.left = '0 !important';
                            baseRules['max-width'] = 'none';
                        }

                        // For screens < 1900px, ensure responsive sizing
                        if (windowWidth < 1900) {
                            baseRules['max-height'] = '85vh';
                            baseRules['overflow-y'] = 'auto';
                            baseRules['overflow-x'] = 'hidden';
                        } else {
                            // Screens >= 1900px - full width, no scrolling
                            baseRules['max-height'] = 'none';
                            baseRules['overflow-y'] = 'visible';
                            baseRules['overflow-x'] = 'visible';
                        }

                        // Apply all rules
                        $menu.css(baseRules);
                    }
                });
            } else {
                // Mobile mode - close all mega menus when switching to mobile
                $('.mega-menu-item').removeClass('active');
                $('.mega-menu').removeClass('show right-aligned viewport-aligned').hide();
                setBodyMegaLock(false);
            }
        }, 150);
    });

    // Close mobile menu when clicking on a link (but not mega menu parent links)
    $('.navbar-nav .nav-link').on('click', function (e) {
        if ($(window).width() < 992) {
            // Don't close if it's a mega menu parent link
            if (!$(this).closest('.mega-menu-item').length || $(this).closest('.mega-menu-item').find('.mega-menu').length === 0) {
                $('.navbar-collapse').collapse('hide');
                setBodyMegaLock(false);
            }
        }
    });

    // Close mega menus when clicking outside on mobile
    $(document).on('click', function (e) {
        if (isMobile() && !$(e.target).closest('.mega-menu-item').length) {
            $('.mega-menu-item').removeClass('active');
            $('.mega-menu').slideUp(300).removeClass('show');
            setBodyMegaLock(false);
        }
    });

    // Smooth scroll for anchor links
    $('a[href^="#"]').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 800);
        }
    });

    // Keyboard Navigation for Mega Menus
    $('.mega-menu-item .nav-link').on('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).trigger('mouseenter');
            $(this).next('.mega-menu').find('a').first().focus();
        }
    });

    // Close mega menu on Escape key
    $(document).on('keydown', function (e) {
        if (e.key === 'Escape') {
            $('.mega-menu').fadeOut(200);
            $('.mega-menu-item').removeClass('active');
            setBodyMegaLock(false);
            $('.mega-menu-item .nav-link').blur();
        }
    });

    // Close mega menu when clicking outside
    $(document).on('click', function (e) {
        if (!$(e.target).closest('.mega-menu-item').length) {
            $('.mega-menu').fadeOut(200);
        }
    });

    // Set active page indicator based on current URL
    var currentPath = window.location.pathname;
    $('.navbar-nav .nav-link').each(function () {
        var linkPath = $(this).attr('href');
        if (linkPath && currentPath.includes(linkPath.split('/')[1])) {
            $(this).addClass('active').attr('aria-current', 'page');
        }
    });

    // Improve mobile menu toggle animation
    $('#navTop').on('show.bs.collapse', function () {
        $('.navbar-toggler').attr('aria-expanded', 'true');
    });

    $('#navTop').on('hide.bs.collapse', function () {
        $('.navbar-toggler').attr('aria-expanded', 'false');
    });

    // Focus management for accessibility
    $('.navbar-toggler').on('click', function () {
        setTimeout(function () {
            if ($('#navTop').hasClass('show')) {
                $('.navbar-nav .nav-link').first().focus();
            }
        }, 300);
    });
});
