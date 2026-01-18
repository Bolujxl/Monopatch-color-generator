

let generateBtn = document.getElementById("generate-btn");

function getContrastColor(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
}

function copyHex(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(() => {
        // Show toast
        const toast = document.getElementById("toast");
        toast.className = "show";
        setTimeout(function () {
            toast.className = toast.className.replace("show", "");
        }, 3000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}




function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

generateBtn.addEventListener("click", function () {
    // Generate a random base Hue (0-360)
    const baseHue = Math.floor(Math.random() * 360);
    // Fixed Saturation for consistency (e.g., 70%)
    const saturation = 70;

    // Generate 5 distinct Lightness values
    if (document.getElementById("hex-box1")) {
        // We have 5 boxes, let's distribute lightness from 20% to 80% (step 15%)
        // [20, 35, 50, 65, 80]
        const lightnessSteps = [20, 35, 50, 65, 80];

        for (let i = 1; i <= 5; i++) {
            let lightness = lightnessSteps[i - 1];
            let hexCode = hslToHex(baseHue, saturation, lightness);

            let codeElement = document.getElementById(`hex-code${i}`);
            let boxElement = document.getElementById(`hex-box${i}`);

            if (codeElement && boxElement) {
                codeElement.innerHTML = hexCode;
                let contrastColor = getContrastColor(hexCode);
                codeElement.style.color = contrastColor;
                boxElement.style.backgroundColor = hexCode;

                // Colorize the copy button icon to match text
                let btn = boxElement.querySelector('.copy-btn');
                if (btn) {
                    btn.style.color = contrastColor;
                }
            }
        }
    } else {
        // Fallback for original partial implementation just in case, though user added 5 boxes already
        const hexCode = hslToHex(baseHue, saturation, 50);
        document.getElementById("hex-code1").innerHTML = hexCode;
        document.getElementById("hex-code1").style.color = getContrastColor(hexCode);
        document.getElementById("hex-box1").style.backgroundColor = hexCode;
    }
});

// Dark Mode Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const body = document.body;

// Icons
const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
const sunIcon = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;

function updateIcon(isDark) {
    themeIcon.innerHTML = isDark ? sunIcon : moonIcon;
}

function applyTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
    } else {
        body.classList.remove('dark-mode');
    }
    updateIcon(isDark);
}

// Check saved preference or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

if (savedTheme) {
    applyTheme(savedTheme === 'dark');
} else {
    applyTheme(systemPrefersDark.matches);
}

// Toggle Event
themeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateIcon(isDark);
});

// System Preference Listener
systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        applyTheme(e.matches);
    }
});