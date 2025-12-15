// ==================== Smooth Scrolling ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== Active Navigation Link ====================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ==================== Hero Buttons ====================
const getStartedBtn = document.getElementById('get-started-btn');
const learnMoreBtn = document.getElementById('learn-more-btn');

getStartedBtn.addEventListener('click', () => {
    document.querySelector('#pipeline').scrollIntoView({ behavior: 'smooth' });
});

learnMoreBtn.addEventListener('click', () => {
    document.querySelector('#features').scrollIntoView({ behavior: 'smooth' });
});

// ==================== Pipeline Simulation ====================
const runPipelineBtn = document.getElementById('run-pipeline-btn');
const pipelineStages = document.querySelectorAll('.pipeline-stage');

let isPipelineRunning = false;

async function runPipeline() {
    if (isPipelineRunning) return;

    isPipelineRunning = true;
    runPipelineBtn.disabled = true;
    runPipelineBtn.textContent = 'Running...';

    // Reset all stages
    pipelineStages.forEach(stage => {
        stage.classList.remove('success', 'failed', 'running');
        stage.querySelector('.stage-status').textContent = 'Waiting...';
    });

    // Simulate pipeline execution
    const stages = ['checkout', 'build', 'test', 'deploy'];

    for (let i = 0; i < stages.length; i++) {
        const stage = document.querySelector(`[data-stage="${stages[i]}"]`);
        const statusEl = stage.querySelector('.stage-status');

        // Mark as running
        stage.classList.add('running');
        statusEl.textContent = 'Running...';

        // Simulate stage execution time
        await sleep(2000 + Math.random() * 1000);

        // Random success/failure (90% success rate)
        const success = Math.random() > 0.1;

        stage.classList.remove('running');

        if (success) {
            stage.classList.add('success');
            statusEl.textContent = 'Success ✓';
        } else {
            stage.classList.add('failed');
            statusEl.textContent = 'Failed ✗';

            // Stop pipeline on failure
            showNotification('Pipeline failed at ' + stages[i] + ' stage', 'error');
            break;
        }

        // If last stage completed successfully
        if (i === stages.length - 1 && success) {
            showNotification('Pipeline completed successfully!', 'success');
        }
    }

    isPipelineRunning = false;
    runPipelineBtn.disabled = false;
    runPipelineBtn.textContent = 'Run Pipeline';
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

runPipelineBtn.addEventListener('click', runPipeline);

// ==================== Contact Form ====================
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    console.log('Form submitted:', data);

    // Simulate form submission
    showNotification('Message sent successfully!', 'success');
    contactForm.reset();
});

// ==================== Notification System ====================
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        zIndex: '1000',
        animation: 'slideIn 0.3s ease-out',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(20px)'
    });

    // Set background based on type
    if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, hsl(140, 70%, 50%), hsl(140, 70%, 40%))';
    } else if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, hsl(0, 70%, 50%), hsl(0, 70%, 40%))';
    } else {
        notification.style.background = 'linear-gradient(135deg, hsl(200, 75%, 55%), hsl(250, 85%, 60%))';
    }

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ==================== Intersection Observer for Animations ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    observer.observe(card);
});

// ==================== Initialize ====================
console.log('🚀 DevOps App initialized successfully!');
console.log('Jenkins CI/CD Pipeline ready to run.');
