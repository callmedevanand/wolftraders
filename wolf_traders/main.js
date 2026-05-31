/* -------------------------------------------------------------
   WOLF TRADERS - Interactive JavaScript Controller (Parallax Edition)
   Includes mobile menu, scroll progress, 3D parallax cards,
   accordions, and element scroll animations.
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Scroll Progress Bar
    const progressBar = document.getElementById('scroll-progress-bar');
    
    const updateProgressBar = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        } else {
            progressBar.style.width = '0%';
        }
    };
    
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();

    // 2. Mobile Navigation Toggle
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isActive = mobileNavToggle.classList.toggle('active');
            navMenu.classList.toggle('active', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Close menu when clicking nav links
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                mobileNavToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }



    // 4. Expandable Course Curriculum Timeline (Accordion Model)
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        const header = item.querySelector('.timeline-header');
        const content = item.querySelector('.timeline-content');
        
        if (header && content) {
            header.addEventListener('click', () => {
                const isCurrentlyActive = item.classList.contains('active');
                
                // Close other active modules for single-open accordions
                timelineItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.timeline-content').style.maxHeight = '0px';
                    }
                });

                if (!isCurrentlyActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                } else {
                    item.classList.remove('active');
                    content.style.maxHeight = '0px';
                }
            });
        }
    });

    // 5. FAQ Section Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if (question && answer) {
            question.addEventListener('click', () => {
                const isCurrentlyActive = item.classList.contains('active');
                
                // Toggle single-open FAQs
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0px';
                    }
                });

                if (!isCurrentlyActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    item.classList.remove('active');
                    answer.style.maxHeight = '0px';
                }
            });
        }
    });

    // 6. Intersection Observer for Fade-Up reveals
    const animationOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    };

    const animateObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, animationOptions);

    const elementsToAnimate = document.querySelectorAll('.animate-fade-in, .animate-text-reveal');
    elementsToAnimate.forEach(el => animateObserver.observe(el));

    // Stagger fade all active columns and lists
    const itemsToFade = document.querySelectorAll('.premium-card, .faq-item, .timeline-item');
    
    itemsToFade.forEach(item => {
        item.classList.add('animate-fade-in');
        animateObserver.observe(item);
    });

    // 7. Auto-expand the first curriculum module and FAQ module
    if (timelineItems.length > 0) {
        const firstTimeline = timelineItems[0];
        firstTimeline.classList.add('active');
        const firstTimelineContent = firstTimeline.querySelector('.timeline-content');
        setTimeout(() => {
            firstTimelineContent.style.maxHeight = firstTimelineContent.scrollHeight + 'px';
        }, 120);
    }
    
    if (faqItems.length > 0) {
        const firstFaq = faqItems[0];
        firstFaq.classList.add('active');
        const firstFaqAnswer = firstFaq.querySelector('.faq-answer');
        setTimeout(() => {
            firstFaqAnswer.style.maxHeight = firstFaqAnswer.scrollHeight + 'px';
        }, 120);
    }

    // 8. UPI Checkout Modal Controller
    const checkoutModal = document.getElementById('checkout-modal');
    const modalClose = document.getElementById('modal-close');
    const pricingButtons = document.querySelectorAll('.pricing-card .btn');
    const modalPlanTitle = document.getElementById('modal-plan-title');
    const modalPlanAmount = document.getElementById('modal-plan-amount');
    const modalPlanPeriod = document.getElementById('modal-plan-period');
    const qrImage = document.getElementById('qr-image');
    const confirmBtn = document.getElementById('confirm-payment-btn');

    // Mobile App Buttons
    const gpayBtn = document.getElementById('gpay-btn');
    const phonepeBtn = document.getElementById('phonepe-btn');
    const paytmBtn = document.getElementById('paytm-btn');
    const genericUpiBtn = document.getElementById('generic-upi-btn');

    let selectedPlan = '';
    let selectedAmount = '';

    if (checkoutModal && pricingButtons.length > 0) {
        pricingButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();

                const card = btn.closest('.pricing-card');
                const isMentorship = card.classList.contains('featured') || card.querySelector('h3').textContent.includes('Personal');

                if (isMentorship) {
                    selectedPlan = 'Personal Mentorship';
                    selectedAmount = '2499';
                    modalPlanPeriod.textContent = '/ 4 months';
                } else {
                    selectedPlan = 'Foundation';
                    selectedAmount = '1499';
                    modalPlanPeriod.textContent = '/ 2 months';
                }

                modalPlanTitle.textContent = selectedPlan;
                modalPlanAmount.textContent = Number(selectedAmount).toLocaleString('en-IN');

                // Generate UPI Link
                const payeeVpa = '8891116388@kotakbank';
                const payeeName = encodeURIComponent('Wolf Traders');
                const transactionNote = encodeURIComponent(`Wolf Traders ${selectedPlan}`);
                
                const upiLink = `upi://pay?pa=${payeeVpa}&pn=${payeeName}&am=${selectedAmount}&cu=INR&tn=${transactionNote}`;
                
                // Update QR image using public QR code API
                qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=000000&data=${encodeURIComponent(upiLink)}`;
                
                // Set app-specific deep links
                if (gpayBtn) gpayBtn.href = `gpay://upi/pay?pa=${payeeVpa}&pn=${payeeName}&am=${selectedAmount}&cu=INR&tn=${transactionNote}`;
                if (phonepeBtn) phonepeBtn.href = `phonepe://pay?pa=${payeeVpa}&pn=${payeeName}&am=${selectedAmount}&cu=INR&tn=${transactionNote}`;
                if (paytmBtn) paytmBtn.href = `paytmmp://pay?pa=${payeeVpa}&pn=${payeeName}&am=${selectedAmount}&cu=INR&tn=${transactionNote}`;
                if (genericUpiBtn) genericUpiBtn.href = upiLink;

                // Open modal
                checkoutModal.classList.add('active');
            });
        });

        // Close modal handlers
        const closeModal = () => {
            checkoutModal.classList.remove('active');
        };

        modalClose.addEventListener('click', closeModal);
        checkoutModal.addEventListener('click', (e) => {
            if (e.target === checkoutModal) {
                closeModal();
            }
        });

        // Close on Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && checkoutModal.classList.contains('active')) {
                closeModal();
            }
        });

        // Confirm receipt & WhatsApp redirect
        confirmBtn.addEventListener('click', () => {
            const message = `Hi, I have completed the UPI payment of ₹${Number(selectedAmount).toLocaleString('en-IN')} for the Wolf Traders ${selectedPlan} Plan.\n\nI am sending the payment confirmation screenshot below. Please activate my access.`;
            
            const waUrl = `https://wa.me/916782597871?text=${encodeURIComponent(message)}`;
            
            window.open(waUrl, '_blank');
            closeModal();
        });
    }
});
