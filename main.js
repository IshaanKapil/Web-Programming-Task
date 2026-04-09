
// ── 1. Inject utility elements on DOM ready ──────────────────
document.addEventListener('DOMContentLoaded', function () {
  // Scroll progress bar
  var prog = document.createElement('div');
  prog.id = 'scroll-progress';
  document.body.prepend(prog);

  // Back-to-top button
  var btn = document.createElement('button');
  btn.id = 'back-top';
  btn.title = 'Back to top';
  btn.innerHTML = '↑';
  document.body.appendChild(btn);
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Page transition overlay
  var overlay = document.createElement('div');
  overlay.id = 'page-transition';
  document.body.appendChild(overlay);

  // Smooth page transitions on internal links (skip hash/anchor links)
  document.querySelectorAll('a[href]').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href || href.includes('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    link.addEventListener('click', function (e) {
      e.preventDefault();
      overlay.classList.add('active');
      setTimeout(function () { window.location.href = href; }, 280);
    });
  });
});

// ── 2. Scroll-driven effects ─────────────────────────────────
window.addEventListener('scroll', function () {
  var scrollTop = window.scrollY;
  var docH = document.documentElement.scrollHeight - window.innerHeight;
  var pct = docH > 0 ? (scrollTop / docH) * 100 : 0;

  var prog = document.getElementById('scroll-progress');
  if (prog) prog.style.width = pct + '%';

  var btn = document.getElementById('back-top');
  if (btn) btn.classList.toggle('visible', scrollTop > 350);

  var nav = document.querySelector('.navbar');
  if (nav) {
    nav.classList.toggle('glass', scrollTop > 60);
    nav.classList.toggle('scrolled', scrollTop > 40);
  }
});

// ── 3. Counter animation ─────────────────────────────────────
function animateCounter(el, target, duration) {
  var start = 0;
  var step = target / (duration / 16);
  var timer = setInterval(function () {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.round(start);
  }, 16);
}

// ── 4. IntersectionObserver for all scroll animations ────────
(function () {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      if (entry.target.classList.contains('fade-in')) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
      if (entry.target.classList.contains('section-heading')) {
        entry.target.classList.add('line-visible');
        io.unobserve(entry.target);
      }
      if (entry.target.classList.contains('skill-bar-fill')) {
        var w = entry.target.dataset.width;
        if (w) entry.target.style.width = w + '%';
        io.unobserve(entry.target);
      }
      if (entry.target.classList.contains('count-up')) {
        var t = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, t, 900);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.col-md-6, .col-lg-4, .col-lg-6').forEach(function (el, i) {
      el.classList.add('fade-in');
      el.style.transitionDelay = (i % 4) * 0.1 + 's';
      io.observe(el);
    });
    document.querySelectorAll('.section-heading').forEach(function (el) { io.observe(el); });
    document.querySelectorAll('.skill-bar-fill').forEach(function (bar) {
      var inlineW = bar.style.width;
      if (inlineW) {
        bar.dataset.width = parseInt(inlineW);
        bar.style.width = '0';
        io.observe(bar);
      }
    });
    document.querySelectorAll('.count-up').forEach(function (el) { io.observe(el); });

    // Also immediately trigger any count-up elements visible in viewport on load
    setTimeout(function () {
      document.querySelectorAll('.count-up').forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && !el.dataset.counted) {
          el.dataset.counted = '1';
          animateCounter(el, parseInt(el.dataset.target), 900);
        }
      });
    }, 400);
  });
})();

// ── 5. Typewriter engine ─────────────────────────────────────
(function () {
  function runTypewriter(el, speed) {
    var raw = el.getAttribute('data-tw');
    if (!raw) return;

    var segments;
    try { segments = JSON.parse(raw); } catch(e) { return; }

    // Clear and insert blinking cursor
    el.innerHTML = '';
    var cursor = document.createElement('span');
    cursor.className = 'cursor-blink';
    el.appendChild(cursor);

    var segIdx = 0, charIdx = 0;
    var currentSpan = null;

    function typeNext() {
      if (segIdx >= segments.length) {
        // Done — leave cursor blinking
        return;
      }

      var seg = segments[segIdx];
      var ch = seg.t[charIdx];

      if (ch === '\n') {
        // Insert <br> before cursor
        currentSpan = null;
        el.insertBefore(document.createElement('br'), cursor);
        charIdx++;
      } else {
        // Create or reuse a span for this segment
        if (!currentSpan) {
          currentSpan = document.createElement(seg.c ? 'span' : 'span');
          if (seg.c) currentSpan.className = seg.c;
          el.insertBefore(currentSpan, cursor);
        }
        currentSpan.textContent += ch;
        charIdx++;
      }

      // Move to next segment if done
      if (charIdx >= seg.t.length) {
        segIdx++;
        charIdx = 0;
        currentSpan = null;
      }

      setTimeout(typeNext, speed);
    }

    setTimeout(typeNext, 0);
  }

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('typewriter-title');
    if (!el) return;
    // Small delay so hero fade-in animation plays first
    setTimeout(function () { runTypewriter(el, 55); }, 350);
  });
})();


function changeParagraph() {
  document.getElementById('demo28').textContent = 'Text changed using JavaScript!';
  document.getElementById('demo28').style.color = '#4e54c8';
}

function submitInput() {
  var val = document.getElementById('input29').value;
  document.getElementById('output29').textContent = val ? 'You entered: ' + val : 'Please type something first!';
}

function calculateTotal() {
  var price = parseFloat(document.getElementById('price30').value);
  var qty = parseInt(document.getElementById('qty30').value);
  if (price > 0 && qty > 0) {
    document.getElementById('total30').textContent = 'Total: Rs.' + (price * qty).toFixed(2);
  } else {
    document.getElementById('total30').textContent = 'Enter valid price and quantity';
  }
}

function showMessage() {
  document.getElementById('msg31').textContent = 'Hello! Welcome to the Web Technologies course.';
  document.getElementById('msg31').style.color = '#4e54c8';
}

var isOnline = false;
function toggleStatus() {
  isOnline = !isOnline;
  var el = document.getElementById('status32');
  el.textContent = 'Status: ' + (isOnline ? 'Online' : 'Offline');
  el.style.color = isOnline ? '#28a745' : '#888';
  document.getElementById('toggleBtn').textContent = isOnline ? 'Go Offline' : 'Go Online';
}

function validateUniReg(e) {
  e.preventDefault();
  var pass = document.getElementById('uniPass').value;
  var confirm = document.getElementById('uniConfirm').value;
  var email = document.getElementById('uniEmail').value;
  var result = document.getElementById('uniResult');
  if (pass.length < 8) {
    result.textContent = 'Password must be at least 8 characters.';
    result.style.color = 'red';
  } else if (pass !== confirm) {
    result.textContent = 'Passwords do not match!';
    result.style.color = 'red';
  } else {
    result.textContent = 'Registration successful!';
    result.style.color = 'green';
  }
}

function validateCheckout(e) {
  e.preventDefault();
  var name = document.getElementById('coName').value.trim();
  var phone = document.getElementById('coPhone').value.trim();
  var result = document.getElementById('coResult');
  if (!name) { result.textContent = 'Name is required.'; result.style.color = 'red'; }
  else if (!/^\d{10}$/.test(phone)) { result.textContent = 'Enter valid 10-digit phone.'; result.style.color = 'red'; }
  else { result.textContent = 'Order placed successfully!'; result.style.color = 'green'; }
}

function vtopLogin(e) {
  e.preventDefault();
  var u = document.getElementById('vtopUser').value;
  var p = document.getElementById('vtopPass').value;
  var r = document.getElementById('vtopResult');
  if (u === 'admin' && p === 'password123') { r.textContent = 'Login successful!'; r.style.color = 'green'; }
  else { r.textContent = 'Invalid credentials. Try admin / password123'; r.style.color = 'red'; }
}

function examReg(e) {
  e.preventDefault();
  document.getElementById('examResult').textContent = 'Exam registration completed!';
  document.getElementById('examResult').style.color = 'green';
}

function hotelBook(e) {
  e.preventDefault();
  document.getElementById('hotelResult').textContent = 'Room booked successfully!';
  document.getElementById('hotelResult').style.color = 'green';
}

document.addEventListener('DOMContentLoaded', function () {
  var regInputs = document.querySelectorAll('#regForm38 input');
  regInputs.forEach(function (inp) {
    inp.addEventListener('focus', function () { this.style.borderColor = '#4e54c8'; });
    inp.addEventListener('blur', function () { this.style.borderColor = '#ced4da'; });
  });
  var regForm38 = document.getElementById('regForm38');
  if (regForm38) {
    regForm38.addEventListener('submit', function (e) {
      e.preventDefault();
      document.getElementById('regResult38').textContent = 'Form submitted!';
      document.getElementById('regResult38').style.color = 'green';
    });
  }


  var focusField = document.getElementById('focusUser39');
  if (focusField) setTimeout(function () { focusField.focus(); }, 300);

  var hoverBox = document.getElementById('hoverBox40');
  var hoverInfo = document.getElementById('hoverInfo40');
  if (hoverBox) {
    hoverBox.addEventListener('mouseover', function () {
      hoverInfo.textContent = 'Viewing product details...';
      hoverBox.style.background = '#4e54c8';
      hoverBox.style.color = '#fff';
    });
    hoverBox.addEventListener('mouseout', function () {
      hoverInfo.textContent = 'Hover over the product above';
      hoverBox.style.background = '#e9ecef';
      hoverBox.style.color = '#333';
    });
  }

  var emailInput41 = document.getElementById('email41');
  var passFb41 = document.getElementById('passFb41');
  var emailFb41 = document.getElementById('emailFb41');
  if (emailInput41) {
    emailInput41.addEventListener('input', function () {
      var valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.value);
      emailFb41.textContent = this.value ? (valid ? 'Valid email' : 'Invalid email') : '';
      emailFb41.style.color = valid ? 'green' : 'red';
    });
  }
  var passInput41 = document.getElementById('pass41');
  if (passInput41) {
    passInput41.addEventListener('input', function () {
      var len = this.value.length;
      if (!len) passFb41.textContent = '';
      else if (len < 6) { passFb41.textContent = 'Weak'; passFb41.style.color = 'red'; }
      else if (len < 8) { passFb41.textContent = 'Medium'; passFb41.style.color = 'orange'; }
      else { passFb41.textContent = 'Strong'; passFb41.style.color = 'green'; }
    });
  }

  document.querySelectorAll('.overlap-img').forEach(function (img) {
    img.addEventListener('click', function () {
      document.querySelectorAll('.overlap-img').forEach(function (i) { i.style.zIndex = 1; });
      this.style.zIndex = 10;
    });
  });

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Message sent! Thank you for reaching out.');
      contactForm.reset();
    });
  }
});
