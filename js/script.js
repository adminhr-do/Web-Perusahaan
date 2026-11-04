// =========================================================
// SERVICES DROPDOWN (MOBILE & TOUCH SUPPORT)
// =========================================================
function initDropdown() {
    const dropdownToggles = document.querySelectorAll('.nav-dropdown .dropdown-toggle');

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();

            const dropdown = this.closest('.nav-dropdown');
            if (!dropdown) return;

            const isAlreadyActive = dropdown.classList.contains('active');

            // Tutup dropdown lain yang mungkin sedang terbuka
            document.querySelectorAll('.nav-dropdown.active').forEach(item => {
                if (item !== dropdown) {
                    item.classList.remove('active');
                }
            });

            // Toggle status active pada dropdown yang diklik
            dropdown.classList.toggle('active', !isAlreadyActive);
        });
    });

    // Tutup dropdown jika pengguna mengklik / menyentuh di luar menu
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-dropdown')) {
            document.querySelectorAll('.nav-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Tutup dropdown dengan tombol Escape (aksesibilitas)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.nav-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Reset status dropdown saat layar diubah ke ukuran desktop
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            document.querySelectorAll('.nav-dropdown.active').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

// =========================================================
// HERO SLIDER
// =========================================================
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length <= 1) return;

    let currentSlide = 0;

    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Ganti gambar setiap 5 detik
    setInterval(showNextSlide, 5000);
}

// Inisialisasi saat DOM selesai dimuat
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        initDropdown();
        initHeroSlider();
    });
} else {
    initDropdown();
    initHeroSlider();
}
