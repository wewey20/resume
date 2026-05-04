/* 1. AUTOMATIC IMAGE SLIDESHOW (Hero) */
let currentImg = 0;
const imgs = document.querySelectorAll('#tilt-card img');
function changeImg() {
    if(imgs.length > 0) {
        imgs[currentImg].classList.remove('active-img');
        currentImg = (currentImg + 1) % imgs.length;
        imgs[currentImg].classList.add('active-img');
    }
}
setInterval(changeImg, 4000);

/* 2. INTERACTIVE TEXT SCRAMBLE */
const nameSpans = document.querySelectorAll('.interactive-name');
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

nameSpans.forEach(span => {
    const originalText = span.innerText;
    span.addEventListener('mouseover', () => {
        let iteration = 0;
        const interval = setInterval(() => {
            span.innerText = originalText.split("").map((letter, index) => {
                if(index < iteration) return originalText[index];
                return chars[Math.floor(Math.random() * 26)];
            }).join("");

            if(iteration >= originalText.length) clearInterval(interval);
            iteration += 1 / 3;
        }, 30);
    });
});

/* 3. TILT EFFECT */
const card = document.getElementById('tilt-card');
const area = document.getElementById('profile-area');
if(area && card) {
    area.addEventListener('mousemove', (e) => {
        const rect = area.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `rotateX(${y * -20}deg) rotateY(${x * 20}deg)`;
    });
    area.addEventListener('mouseleave', () => card.style.transform = `rotateX(0deg) rotateY(0deg)`);
}

/* 4. NUMBER COUNTER ENGINE */
function animateNumbers(container) {
    container.querySelectorAll('.ring-item').forEach(item => {
        const target = parseInt(item.getAttribute('data-percent'));
        const numDisplay = item.querySelector('.percent-number');
        if(!numDisplay) return;

        let current = 0;
        const duration = 1500;
        const increment = target / (duration / 16);

        const count = () => {
            current += increment;
            if (current < target) {
                numDisplay.innerText = Math.ceil(current);
                requestAnimationFrame(count);
            } else {
                numDisplay.innerText = target;
            }
        };
        count();
    });

    container.querySelectorAll('.bar-row').forEach(row => {
        const target = parseInt(row.getAttribute('data-width'));
        const counterDisplay = row.querySelector('.counter');
        if(!counterDisplay) return;

        let current = 0;
        const count = () => {
            current += (target / 60);
            if (current < target) {
                counterDisplay.innerText = Math.ceil(current) + '%';
                requestAnimationFrame(count);
            } else {
                counterDisplay.innerText = target + '%';
            }
        };
        count();
    });
}

/* 5. ANIMATION TRIGGER */
function animateGroupElements(group) {
    group.querySelectorAll('.bar-row').forEach(row => {
        const bar = row.querySelector('.bar-inner');
        if(bar) {
            bar.style.width = row.getAttribute('data-width');
            bar.parentElement.style.setProperty('--bar-w', row.getAttribute('data-width'));
        }
    });

    group.querySelectorAll('.ring-item').forEach(ring => {
        const circle = ring.querySelector('.progress-circle');
        const percent = ring.getAttribute('data-percent');
        const circumference = 283;
        const offset = circumference - (percent / 100) * circumference;
        if(circle) circle.style.strokeDashoffset = offset;
    });

    animateNumbers(group);
}

/* 6. SCROLL OBSERVER */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
            if(entry.target.classList.contains('skill-group')) {
                animateGroupElements(entry.target);
            }
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.item-block, .skill-group').forEach(el => observer.observe(el));

/* 7. SKILLS FILTER LOGIC */
function filterSkills(category) {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active-filter');
        if (btn.getAttribute('onclick').includes(`'${category}'`)) btn.classList.add('active-filter');
    });

    document.querySelectorAll('.skill-group').forEach(group => {
        group.classList.add('hidden');
        group.querySelectorAll('.bar-inner').forEach(bar => bar.style.width = '0');
        group.querySelectorAll('.progress-circle').forEach(circle => circle.style.strokeDashoffset = '283');
        group.querySelectorAll('.percent-number, .counter').forEach(num => num.innerText = '0%');
    });

    const activeGroup = document.querySelector(`.skill-group[data-category="${category}"]`);
    if (activeGroup) {
        activeGroup.classList.remove('hidden');
        setTimeout(() => animateGroupElements(activeGroup), 50);
    }
}

/* 8. NAV ACTIVE STATE */
window.addEventListener('scroll', () => {
    let current = "";
    document.querySelectorAll("section, header").forEach(s => {
        if(window.pageYOffset >= s.offsetTop - 200) current = s.getAttribute("id");
    });
    document.querySelectorAll("nav a").forEach(a => {
        a.classList.remove("active");
        if(a.getAttribute("href") && a.getAttribute("href").includes(current)) a.classList.add("active");
    });
});

/* 9. EXPERIENCE GALLERY CAROUSEL */
document.querySelectorAll('.exp-item').forEach(item => {
    const content = item.querySelector('.exp-content');
    const track   = item.querySelector('.gallery-track');
    const dots    = item.querySelectorAll('.dot');
    const prevBtn = item.querySelector('.gallery-arrow.prev');
    const nextBtn = item.querySelector('.gallery-arrow.next');

    item.addEventListener('mouseenter', () => {
        if (content) content.classList.add('exp-visible');
    });

    if (!track) return;

    let current = 0;
    const total = track.children.length;

    function goTo(index) {
        current = (index + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            goTo(parseInt(dot.dataset.index));
        });
    });

    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(current - 1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(current + 1); });
});

/* 10. INITIALIZATION */
window.addEventListener('DOMContentLoaded', () => {
    filterSkills('programming');
});

/* 11. CUSTOM CURSOR */
const cursor = document.querySelector('.custom-cursor');

window.addEventListener('mousemove', (e) => {
    cursor.style.transform = `translate3d(${e.clientX - 25}px, ${e.clientY - 25}px, 0)`;
});

/* 12. RING STAGGER ANIMATION ON SCROLL */
document.addEventListener('DOMContentLoaded', () => {
    const rings = document.querySelectorAll('.ring-item');

    const ringObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentGrid = entry.target.parentElement.querySelectorAll('.ring-item');

                currentGrid.forEach((ring, index) => {
                    const percent = parseInt(ring.getAttribute('data-percent'));
                    const circle = ring.querySelector('.progress-circle');
                    const numberDisplay = ring.querySelector('.percent-number');

                    if (!ring.classList.contains('animated')) {
                        ring.classList.add('animated');

                        setTimeout(() => {
                            const circumference = 283;
                            const offset = circumference - (percent / 100) * circumference;
                            circle.style.strokeDashoffset = offset;

                            let count = 0;
                            const duration = 2000;
                            const interval = duration / percent;

                            const counter = setInterval(() => {
                                count++;
                                if (numberDisplay) numberDisplay.innerText = count;
                                if (count >= percent) clearInterval(counter);
                            }, interval);
                        }, index * 200);
                    }
                });

                ringObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    rings.forEach(r => ringObserver.observe(r));
});

/* 13. EXPERIENCE FILTER */
function filterExp(tab) {
    document.querySelectorAll('.exp-filter-btn').forEach(btn => {
        btn.classList.remove('active-exp-filter');
        if (btn.getAttribute('onclick').includes("'" + tab + "'")) {
            btn.classList.add('active-exp-filter');
        }
    });

    document.querySelectorAll('.exp-group').forEach(group => {
        group.classList.add('hidden');
    });

    const target = document.getElementById('exp-' + tab);
    if (target) {
        target.classList.remove('hidden');
        target.querySelectorAll('.item-block').forEach(el => {
            el.classList.remove('visible');
            setTimeout(() => el.classList.add('visible'), 50);
        });
    }
}

/* 14. MODAL TILT CARD EFFECT */
document.addEventListener('DOMContentLoaded', () => {
    const modal    = document.getElementById('proof-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCap = document.getElementById('modal-caption');
    const closeBtn = document.querySelector('.modal-close');

    if (!modal) return;

    const wrapper  = modal.querySelector('.modal-content-wrapper');
    const tiltCard = document.createElement('div');
    tiltCard.className = 'modal-card';
    wrapper.insertBefore(tiltCard, modalImg);
    tiltCard.appendChild(modalImg);

    window.openProof = function (imgSrc, title) {
        modalImg.src        = imgSrc;
        modalCap.innerText  = title;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        tiltCard.style.transition = 'none';
        tiltCard.style.transform  = 'rotateX(0deg) rotateY(0deg)';
    };

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === closeBtn || e.target.classList.contains('modal-close')) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    tiltCard.addEventListener('mousemove', (e) => {
        const rect = tiltCard.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        tiltCard.style.transform = `rotateX(${y * -18}deg) rotateY(${x * 18}deg)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
        tiltCard.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        tiltCard.style.transform  = 'rotateX(0deg) rotateY(0deg)';
    });

    tiltCard.addEventListener('mouseenter', () => {
        tiltCard.style.transition = 'transform 0.1s ease';
    });
});

/* 15. DARK MODE TOGGLE */
document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('theme-toggle');
    const body      = document.body;

    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
    }

    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });
});

/* 16. VOLUNTEER CARD SLIDESHOWS */
document.querySelectorAll('.vol-slideshow').forEach(show => {
    const slides = show.querySelectorAll('.vol-slide');
    if (slides.length < 2) return;
    let current = 0;
    setInterval(() => {
        slides[current].classList.remove('active-vol-slide');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active-vol-slide');
    }, 2500);
});