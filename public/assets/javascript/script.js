document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        const targetSection = document.querySelector('.contact');
        if (targetSection) {
            window.scroll({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// เลื่อนแบบสมูท
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

window.addEventListener("scroll", function() {
    const navbar = document.querySelector(".navbar");
    if (window.scrollY > 0) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        if (targetId === 'home') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        card.addEventListener('mouseover', function() {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseout', function() {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const dropdownIcon = document.querySelector('.dropdown-icon');
    const menu = document.querySelector('.menu');

    dropdownIcon.addEventListener('click', function() {
        menu.classList.toggle('open');
    });

    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            menu.style.display = 'flex';
            menu.classList.remove('open');
        } else {
            menu.style.display = 'none';
        }
    });
});

let slideIndex = 0;
showSlides();

function showSlides() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide) => {
        slide.style.display = 'none';
    });
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1 }
    slides[slideIndex - 1].style.display = 'block';
    setTimeout(showSlides, 3000); // เปลี่ยนภาพทุก 3 วินาที
}

function changeSlide(n) {
    slideIndex += n;
    const slides = document.querySelectorAll('.slide');
    if (slideIndex > slides.length) { slideIndex = 1 }
    if (slideIndex < 1) { slideIndex = slides.length }
    slides.forEach((slide) => {
        slide.style.display = 'none';
    });
    slides[slideIndex - 1].style.display = 'block';
}

function animateCartIcon() {
    const cartIcon = document.querySelector('.cart-icon i');
    cartIcon.classList.add('animate-bounce');
    setTimeout(() => {
        cartIcon.classList.remove('animate-bounce');
    }, 500);
}

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const productName = this.parentElement.getAttribute('data-product');
        const productPrice = this.parentElement.getAttribute('data-price');
        const productImage = this.parentElement.getAttribute('data-image');

        if (productName && productPrice && productImage) {
            addToCart(productName, productPrice, productImage);
            animateCartIcon();
        } else {
            console.error('Product details not found for this item.');
        }
    });
});