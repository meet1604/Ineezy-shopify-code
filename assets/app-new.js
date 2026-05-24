/* =========================================
   DOCUMENT READY
========================================= */

$(document).ready(function () {

    initHeroSlider();
    initCategorySlider();
    initBestSellerTabs();

});

// Ensure variant pill UI stays in sync (selected value text + active styles).
// This is a safety net on top of Dawn's VariantSelects behavior.
document.addEventListener('change', function (event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.type !== 'radio') return;
    if (!target.closest('variant-radios')) return;

    const fieldset = target.closest('.product-form__input');
    if (!fieldset) return;

    const selectedValue = fieldset.querySelector('[data-selected-value]');
    if (selectedValue) selectedValue.textContent = target.value;

    fieldset.querySelectorAll('.variant-pill-label.is-selected').forEach((label) => {
        label.classList.remove('is-selected');
    });

    const id = target.id;
    if (!id) return;

    const safeId = window.CSS && typeof window.CSS.escape === 'function' ? window.CSS.escape(id) : id.replace(/\"/g, '\\"');
    const activeLabel = fieldset.querySelector(`label[for="${safeId}"]`);
    if (activeLabel) activeLabel.classList.add('is-selected');
});


/* =========================================
   HERO SLIDER
========================================= */

function initHeroSlider() {

    $('.ineezy-slider').each(function () {

        if (!$(this).hasClass('slick-initialized')) {

            $(this).slick({
                centerMode: true,
                centerPadding: '0px',
                slidesToShow: 1,
                arrows: true,

                responsive: [
                    {
                        breakpoint: 768,
                        settings: {
                            arrows: false,
                            centerMode: true,
                            centerPadding: '40px',
                            slidesToShow: 1
                        }
                    }
                ]
            });

        }

    });

}


/* =========================================
   CATEGORY SLIDER MOBILE ONLY
========================================= */

function initCategorySlider() {

    if ($(window).width() <= 992) {

        $('.collection-wrapper').each(function () {

            if (!$(this).hasClass('slick-initialized')) {

                $(this).slick({
                    slidesToShow: 2.2,
                    slidesToScroll: 2,
                    arrows: false,
                    dots: false,
                    infinite: false,
                    responsive: [
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 1.5,
                                slidesToScroll: 1,
                            }
                        }
                    ]
                });

            }

        });

    } else {

        $('.collection-wrapper.slick-initialized').each(function () {

            $(this).slick('unslick');

        });

    }

}


/* =========================================
   BEST SELLER TABS
========================================= */

function initBestSellerTabs() {

    $('.ineezy-best-seller').each(function () {

        let $section = $(this);

        // PREVENT DUPLICATE INIT
        if ($section.hasClass('tabs-initialized')) {
            return;
        }

        $section.addClass('tabs-initialized');

        // UNIQUE SECTION ID
        let sectionID = $section.attr('id').replace('ineezy-best-seller-', '');

        // FIRST ACTIVE SLIDER
        let $firstSlider = $section.find('.tab-content.active .best-seller-slider');

        if (!$firstSlider.hasClass('slick-initialized')) {

            $firstSlider.slick({
                slidesToShow: 4,
                slidesToScroll: 4,
                infinite: false,
                dots: false,
                arrows: true,

                prevArrow: $section.find('.bestSellerPrev-' + sectionID),
                nextArrow: $section.find('.bestSellerNext-' + sectionID),

                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 3,
                            slidesToScroll: 3,
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            slidesToShow: 1.2,
                            slidesToScroll: 1,
                        }
                    }
                ]
            });

        }

        // TAB CLICK
        $section.find('.tab-btn').on('click', function () {

            let tabID = $(this).data('tab');

            // ACTIVE BUTTON
            $section.find('.tab-btn').removeClass('active');
            $(this).addClass('active');

            // HIDE ALL TABS
            $section.find('.tab-content')
                .removeClass('active')
                .hide();

            // SHOW ACTIVE TAB
            let $activeTab = $section.find('#' + tabID);

            $activeTab
                .addClass('active')
                .fadeIn(200);

            // TARGET SLIDER
            let $slider = $activeTab.find('.best-seller-slider');

            // INIT ONCE
            if (!$slider.hasClass('slick-initialized')) {

                $slider.slick({
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    infinite: false,
                    dots: false,
                    arrows: true,

                    prevArrow: $section.find('.bestSellerPrev-' + sectionID),
                    nextArrow: $section.find('.bestSellerNext-' + sectionID),

                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 3,
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                 slidesToShow: 1.2,
                            slidesToScroll: 1,
                            }
                        }
                    ]
                });

            } else {

                $slider.slick('setPosition');

            }

        });

    });

}


/* =========================================
   TESTIMONIAL SLIDER
========================================= */

$('.ineezy-testimonial-section').each(function () {

    let $section = $(this);

    // PREVENT DOUBLE INIT
    if ($section.hasClass('testimonial-loaded')) {
        return;
    }

    $section.addClass('testimonial-loaded');

    /* TOP SLIDER */

    $section.find('.testimonial-slider-top').slick({
        slidesToShow: 3.5,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 0,
        speed: 6000,
        cssEase: 'linear',
        pauseOnHover: false,

        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2.2
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1.2
                }
            }
        ]
    });


    /* BOTTOM SLIDER */

$section.find('.testimonial-slider-bottom').slick({
    slidesToShow: 3.5,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 0,
    speed: 9000,
    cssEase: 'linear',
    pauseOnHover: false,
    rtl: true,

    responsive: [
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2.2
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1.2
            }
        }
    ]
});

});





// document.addEventListener("DOMContentLoaded", () => {

//   // Gallery switch
//   const thumbs = document.querySelectorAll(".luxury-thumb");

//   thumbs.forEach((thumb) => {

//     thumb.addEventListener("click", () => {

//       const mediaId = thumb.dataset.mediaId;

//       document
//         .querySelectorAll(".luxury-thumb")
//         .forEach((el) => el.classList.remove("active"));

//       document
//         .querySelectorAll(".luxury-media")
//         .forEach((el) => el.classList.remove("active"));

//       thumb.classList.add("active");

//       document
//         .querySelector(`.luxury-media[data-media-id="${mediaId}"]`)
//         .classList.add("active");

//     });

//   });

//   // Quantity
//   const qtyInput = document.getElementById("Quantity");

//   document.querySelector(".qty-plus")?.addEventListener("click", () => {
//     qtyInput.value = parseInt(qtyInput.value) + 1;
//   });

//   document.querySelector(".qty-minus")?.addEventListener("click", () => {

//     if(parseInt(qtyInput.value) > 1){
//       qtyInput.value = parseInt(qtyInput.value) - 1;
//     }

//   });

// });


















/* =========================================
   RESIZE EVENT (DEBOUNCE)
========================================= */

let resizeTimer;

$(window).on('resize', function () {

    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {

        initCategorySlider();

    }, 300);

});
