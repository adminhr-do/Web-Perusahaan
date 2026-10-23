const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;

function showNextSlide() {
    if (slides.length <= 1) return;

    // Hilangkan slide sebelumnya
    slides[currentSlide].classList.remove('active');

    // Pindah ke slide berikutnya
    currentSlide = (currentSlide + 1) % slides.length;

    // Aktifkan slide baru
    slides[currentSlide].classList.add('active');
}

// Ganti gambar setiap 5 detik
setInterval(showNextSlide, 5000);
