/**
 * NexusFlow - Interactive Landing Page Logic
 * Features, Connections, Theme Toggle & Interactive Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTheme();
  initFeatureTabs();
  initConnectionNodes();
  initContactForm();
  initCopyPayload();
  initLiveCounters();
});

/* ==========================================================================
   1. Navbar Scroll Effect & ScrollSpy
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  // Sticky Navbar Blur on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // ScrollSpy Active Link Tracking
    let scrollY = window.pageYOffset;
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // Mobile Drawer Open / Close
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  }

  if (drawerCloseBtn && mobileDrawer) {
    drawerCloseBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   2. Light / Dark Theme Switcher
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('nexus_theme') || 'dark';

  if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeToggle) themeToggle.innerHTML = '<i class="fa-regular fa-sun"></i>';
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (themeToggle) themeToggle.innerHTML = '<i class="fa-regular fa-moon"></i>';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      if (isLight) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = '<i class="fa-regular fa-moon"></i>';
        localStorage.setItem('nexus_theme', 'dark');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.innerHTML = '<i class="fa-regular fa-sun"></i>';
        localStorage.setItem('nexus_theme', 'light');
      }
    });
  }
}

/* ==========================================================================
   3. Features Category Filter Tabs
   ========================================================================== */
function initFeatureTabs() {
  const tabs = document.querySelectorAll('.feature-tab');
  const cards = document.querySelectorAll('.feature-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Toggle active tab class
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-category');

      cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filter === 'all' || cardCategory === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   4. Interactive Connections Showcase & Inspector
   ========================================================================== */
const nodeData = {
  GitHub: {
    title: 'GitHub Enterprise',
    status: 'Connected',
    latency: '0.4 ms',
    rate: '14,200 req/min',
    icon: '<i class="fa-brands fa-github"></i>',
    payload: `{\n  "event": "nexus.node.sync",\n  "source": "github_webhook_v3",\n  "status": "delivered",\n  "duration_ms": 0.42,\n  "payload": {\n    "action": "pull_request.merged",\n    "branch": "production"\n  }\n}`
  },
  'AWS Lambda & S3': {
    title: 'AWS Serverless Ecosystem',
    status: 'Connected',
    latency: '1.1 ms',
    rate: '89,400 req/min',
    icon: '<i class="fa-brands fa-aws" style="color:#ff9900;"></i>',
    payload: `{\n  "event": "aws.sqs.trigger",\n  "region": "us-east-1",\n  "concurrency": 2400,\n  "throughput_mb": 420.5,\n  "state": "HEALTHY"\n}`
  },
  'Slack Alerts': {
    title: 'Slack Real-time Webhooks',
    status: 'Active Webhook',
    latency: '0.8 ms',
    rate: '3,200 req/min',
    icon: '<i class="fa-brands fa-slack" style="color:#4a154b;"></i>',
    payload: `{\n  "channel": "#incident-response",\n  "bot": "NexusWatcher",\n  "text": "All 18 microservice pipelines are optimal.",\n  "timestamp": "${Date.now()}"\n}`
  },
  'Stripe Payments': {
    title: 'Stripe Ledger Sync',
    status: 'Synchronized',
    latency: '0.6 ms',
    rate: '12,500 req/min',
    icon: '<i class="fa-brands fa-stripe" style="color:#635bff;"></i>',
    payload: `{\n  "charge": "ch_3N8xyz",\n  "currency": "usd",\n  "amount": 29900,\n  "signature": "sha256_verified",\n  "settlement": "instant"\n}`
  },
  'Google Cloud': {
    title: 'Google Cloud Platform (BigQuery)',
    status: 'Synchronized',
    latency: '0.9 ms',
    rate: '42,000 req/min',
    icon: '<i class="fa-brands fa-google" style="color:#4285f4;"></i>',
    payload: `{\n  "dataset": "nexus_production_events",\n  "streaming_inserts": true,\n  "rows_buffered": 154000,\n  "pipeline": "bi_engine_v2"\n}`
  },
  'Figma API': {
    title: 'Figma Token Sync',
    status: 'Connected',
    latency: '1.4 ms',
    rate: '5,800 req/min',
    icon: '<i class="fa-brands fa-figma" style="color:#f24e1e;"></i>',
    payload: `{\n  "event": "styles.updated",\n  "design_system": "VortexUI",\n  "tokens_exported": 84,\n  "commit_auto": true\n}`
  },
  'Docker Registry': {
    title: 'Docker Swarm & Registry',
    status: 'Connected',
    latency: '1.2 ms',
    rate: '9,100 req/min',
    icon: '<i class="fa-brands fa-docker" style="color:#2496ed;"></i>',
    payload: `{\n  "image": "nexus/core-orchestrator:latest",\n  "digest": "sha256:7fd4a1...",\n  "nodes_synced": 64,\n  "auto_scale": "enabled"\n}`
  },
  'Python Microservices': {
    title: 'Python FastAPIs & Workers',
    status: 'Active Node',
    latency: '0.3 ms',
    rate: '72,000 req/min',
    icon: '<i class="fa-brands fa-python" style="color:#3776ab;"></i>',
    payload: `{\n  "runtime": "CPython 3.12",\n  "asyncio_workers": 128,\n  "active_tasks": 1042,\n  "event_loop_lag_ms": 0.08\n}`
  }
};

function initConnectionNodes() {
  const nodes = document.querySelectorAll('.integration-node');
  const inspectAvatar = document.getElementById('inspectAvatar');
  const inspectTitle = document.getElementById('inspectTitle');
  const inspectStatus = document.getElementById('inspectStatus');
  const inspectLatency = document.getElementById('inspectLatency');
  const inspectRate = document.getElementById('inspectRate');
  const codeSnippet = document.getElementById('codeSnippet');
  const triggerSyncBtn = document.getElementById('triggerSyncBtn');

  nodes.forEach(node => {
    node.addEventListener('click', () => {
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      const name = node.getAttribute('data-name');
      const data = nodeData[name];

      if (data) {
        inspectAvatar.innerHTML = data.icon;
        inspectTitle.textContent = data.title;
        inspectStatus.textContent = data.status;
        inspectLatency.textContent = data.latency;
        inspectRate.textContent = data.rate;
        codeSnippet.textContent = data.payload;
      }
    });
  });

  // Test Ping button
  if (triggerSyncBtn) {
    triggerSyncBtn.addEventListener('click', () => {
      triggerSyncBtn.disabled = true;
      const originalHTML = triggerSyncBtn.innerHTML;
      triggerSyncBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Pinging Node...';

      setTimeout(() => {
        const randomLatency = (Math.random() * 0.7 + 0.2).toFixed(2);
        inspectLatency.textContent = `${randomLatency} ms`;
        triggerSyncBtn.innerHTML = '<i class="fa-solid fa-check"></i> Node Synchronized!';
        
        showToast(`Connection Ping successful! Latency: ${randomLatency}ms`);

        setTimeout(() => {
          triggerSyncBtn.innerHTML = originalHTML;
          triggerSyncBtn.disabled = false;
        }, 1800);
      }, 700);
    });
  }
}

/* ==========================================================================
   5. Copy Payload Code to Clipboard
   ========================================================================== */
function initCopyPayload() {
  const copyBtn = document.getElementById('copyPayloadBtn');
  const codeSnippet = document.getElementById('codeSnippet');

  if (copyBtn && codeSnippet) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(codeSnippet.textContent).then(() => {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        showToast('Payload copied to clipboard!');
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
        }, 2000);
      }).catch(() => {
        showToast('Failed to copy payload');
      });
    });
  }
}

/* ==========================================================================
   6. Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Reset errors
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => el.classList.remove('invalid'));

    // Validate Name
    if (!nameInput.value.trim()) {
      showError('nameError', nameInput, 'Please enter your full name');
      isValid = false;
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim()) {
      showError('emailError', emailInput, 'Email address is required');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError('emailError', emailInput, 'Please provide a valid work email');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      showError('messageError', messageInput, 'Message should be at least 10 characters long');
      isValid = false;
    }

    if (isValid) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending message...';

      setTimeout(() => {
        showToast(`Thank you, ${nameInput.value.trim()}! We'll be in touch shortly.`);
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
      }, 1200);
    }
  });

  function showError(elementId, inputElement, text) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) errorEl.textContent = text;
    if (inputElement) inputElement.classList.add('invalid');
  }
}

/* ==========================================================================
   7. Toast Notification Handler
   ========================================================================== */
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');

  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
}

/* ==========================================================================
   8. Live Metric Simulation
   ========================================================================== */
function initLiveCounters() {
  const metricNumber = document.querySelector('.preview-metric-card .metric-number');
  if (!metricNumber) return;

  setInterval(() => {
    const randomThroughput = (4.75 + Math.random() * 0.25).toFixed(2);
    metricNumber.textContent = `${randomThroughput}M/s`;
  }, 3000);
}
