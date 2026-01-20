const myImages = [
    'assets/emojis/emoji4080.png', 'assets/emojis/emoji4081.png', 'assets/emojis/emoji4082.png', 'assets/emojis/emoji4083.png',
    'assets/emojis/emoji4084.png', 'assets/emojis/emoji4085.png', 'assets/emojis/emoji4086.png', 'assets/emojis/emoji4087.png',
    'assets/emojis/emoji4088.png', 'assets/emojis/emoji4089.png', 'assets/emojis/emoji4090.png', 'assets/emojis/emoji4091.png'
];

function runImageGlitch(imgElement) {
    if (myImages.length <= 1 || !imgElement) return; 
    let duration = 0; const maxDuration = 10; 
    if (imgElement.dataset.interval) clearInterval(parseInt(imgElement.dataset.interval));
    const interval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * myImages.length);
        imgElement.src = myImages[randomIndex];
        duration++;
        if (duration >= maxDuration) clearInterval(interval);
    }, 80); 
    imgElement.dataset.interval = interval;
}

const navAvatar = document.getElementById('nav-avatar');
if(navAvatar) runImageGlitch(navAvatar);

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|<>?";
function runHackerEffect(element) {
    const targetText = element.dataset.value || element.innerText;
    
    let iterations = 0; 
    const maxIterations = 10; 
    const stopMap = targetText.split('').map(() => Math.floor(Math.random() * (maxIterations - 2)) + 2);
    
    if (element.dataset.interval) clearInterval(parseInt(element.dataset.interval));
    
    const interval = setInterval(() => {
        element.innerText = targetText.split("").map((letter, index) => {
            if (/[ \.,;:\-!?&()\[\]{}'"\/]/.test(letter)) return letter;
            if (iterations < stopMap[index]) return letters[Math.floor(Math.random() * letters.length)];
            return letter;
        }).join("");

        if(iterations >= maxIterations){ 
            clearInterval(interval);
            element.innerText = targetText; 
        }
        iterations += 1;
    }, 80); 
    element.dataset.interval = interval;
}

const repoBox = document.getElementById('repo-box');
const urlToCopy = "https://tinyurl.com/dansaltsource";

async function handleCopy() {
    try {
        await navigator.clipboard.writeText(urlToCopy);
        triggerCopyAnimation();
    } catch (err) {
        const textArea = document.createElement("textarea");
        textArea.value = urlToCopy;
        textArea.style.position = "fixed"; 
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            triggerCopyAnimation();
        } catch (err2) {
            repoBox.dataset.value = "COPY FAILED :(";
            runHackerEffect(repoBox);
        }
        document.body.removeChild(textArea);
    }
}

function triggerCopyAnimation() {
    const rect = repoBox.getBoundingClientRect();
    repoBox.style.width = `${rect.width}px`;
    repoBox.style.height = `${rect.height}px`;
    repoBox.style.flex = "none";
    repoBox.classList.add('no-magnet'); 
    
    repoBox.dataset.value = "URL COPIED!";
    runHackerEffect(repoBox);
    repoBox.style.borderColor = "#22c55e"; 
    repoBox.style.color = "#22c55e";
    repoBox.style.backgroundColor = "rgba(34, 197, 94, 0.1)";

    setTimeout(() => {
        repoBox.dataset.value = urlToCopy;
        runHackerEffect(repoBox);
        repoBox.style.borderColor = "";
        repoBox.style.backgroundColor = "";
        repoBox.style.color = "";
        
        setTimeout(() => {
            repoBox.style.width = "";
            repoBox.style.height = "";
            repoBox.style.flex = "";
            repoBox.classList.remove('no-magnet'); 
        }, 800); 
    }, 2000);
}

if(repoBox) {
    repoBox.addEventListener('click', handleCopy);
    repoBox.addEventListener('touchend', (e) => {
        e.preventDefault(); 
        handleCopy();
    });
}

const title = document.getElementById('page-title');
const navLogo = document.getElementById('nav-logo');
if(title) runHackerEffect(title);
if(navLogo) runHackerEffect(navLogo);

document.querySelectorAll('.hacker-hover').forEach(el => {
    el.addEventListener('mouseenter', () => runHackerEffect(el));
});

const config = { cursorLerp: 0.25, buttonLerp: 0.1, magnetStrength: 0.1, maxDistanceInput: 50, scaleAmount: 1.05, baseSize: 18, textWidth: 3 };
const cursor = document.getElementById('cursor-smooth');
const textTags = ['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'LI', 'STRONG', 'B', 'EM', 'I', 'CODE', 'PRE', 'SMALL', 'SUB', 'SUP', 'BLOCKQUOTE', 'LABEL']; 

let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
let currentState = { x: mouseX, y: mouseY, width: config.baseSize, height: config.baseSize, radius: config.baseSize/2 };
let targetState = { x: mouseX, y: mouseY, width: config.baseSize, height: config.baseSize, radius: config.baseSize/2 };
let isHovering = false, hoverEl = null, hoverRect = null;
let buttonX = 0, buttonY = 0;
let fixedWidth = 0, fixedHeight = 0, fixedRadius = 0;

function activateMagnet(el) {
    if (el.classList.contains('no-magnet')) return;

    if (isHovering && hoverEl === el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    if (isHovering && hoverEl) deactivateMagnet(hoverEl);
    isHovering = true; hoverEl = el;
    
    const rect = el.getBoundingClientRect();
    hoverRect = rect; 
    fixedWidth = rect.width; 
    fixedHeight = rect.height;
    
    const style = window.getComputedStyle(el);
    const rawRadius = style.borderRadius.split(' ')[0];
    let radiusPx = parseFloat(rawRadius);
    if(rawRadius.includes('%')) radiusPx = Math.min(fixedWidth, fixedHeight)/2;
    if(isNaN(radiusPx)) radiusPx = 0;

    if (el.classList.contains('magnetic-text')) {
            radiusPx = 2; 
    }
    fixedRadius = radiusPx;

    if (el.classList.contains('btn-outline')) fixedRadius = 9999;
    if (el.id === 'repo-box') fixedRadius = 12;

    buttonX = 0; buttonY = 0;
    el.classList.add('is-magnetized');
    
    if (!el.classList.contains('no-cursor-snap')) {
        if (el.classList.contains('magnetic-text')) {
            cursor.classList.add('cursor-underline-mode');
        } else {
            cursor.classList.add('cursor-locked'); 
        }
        cursor.style.backgroundColor = ''; 
        cursor.style.mixBlendMode = ''; 
    }
    
    if (!el.classList.contains('magnetic-text')) el.style.transition = 'none';
}

function deactivateMagnet(el) {
    if (!el) return;
    isHovering = false;
    el.classList.remove('is-magnetized');
    cursor.classList.remove('cursor-locked');
    cursor.classList.remove('cursor-underline-mode');
    cursor.style.mixBlendMode = '';

    if(!el.classList.contains('magnetic-text')) { 
        el.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease, background-color 0.3s ease'; 
        el.style.transform = 'translate3d(0px, 0px, 0px) scale(1)'; 
    }
    hoverEl = null; hoverRect = null;
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    
    cursor.style.opacity = '1';

    const elUnderMouse = document.elementFromPoint(mouseX, mouseY);
    
    if (!elUnderMouse) return;

    let magnetParent = elUnderMouse.closest('.magnet-target');
    if (magnetParent && !magnetParent.classList.contains('no-magnet')) { 
        if (hoverEl !== magnetParent) activateMagnet(magnetParent); 
    } else { 
        if (isHovering) deactivateMagnet(hoverEl); 
    }

    if (!isHovering) {
        targetState.x = mouseX; targetState.y = mouseY;
        
        const isTextTag = textTags.includes(elUnderMouse.tagName);
        const isParentTextTag = elUnderMouse.parentElement && textTags.includes(elUnderMouse.parentElement.tagName);
        
        if ((isTextTag || isParentTextTag) && elUnderMouse.textContent.trim() !== '') {
            const targetEl = isTextTag ? elUnderMouse : elUnderMouse.parentElement;
            const style = window.getComputedStyle(targetEl);
            const fontSize = parseFloat(style.fontSize); 
            
            targetState.width = config.textWidth; 
            targetState.height = fontSize * 1.2; 
            targetState.radius = 2;
            cursor.classList.add('cursor-underline-mode'); 
            cursor.classList.remove('cursor-locked');
        } else {
            targetState.width = config.baseSize; 
            targetState.height = config.baseSize; 
            targetState.radius = config.baseSize/2;
            cursor.classList.remove('cursor-locked');
            cursor.classList.remove('cursor-underline-mode');
            cursor.style.mixBlendMode = 'normal';
        }
    }
});

document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; });

function animate() {
    if (isHovering && hoverEl && hoverRect) {
        if(window.matchMedia("(pointer: fine)").matches) {
            const noSnap = hoverEl.classList.contains('no-cursor-snap');
            const isMagneticText = hoverEl.classList.contains('magnetic-text');
            const isInline = hoverEl.tagName === 'A' && !hoverEl.classList.contains('btn-outline');
            const isImage = hoverEl.classList.contains('image-magnet');

            if (!isMagneticText && !isInline) {
                const centerX = hoverRect.left + hoverRect.width / 2;
                const centerY = hoverRect.top + hoverRect.height / 2;
                const rawDistX = mouseX - centerX; 
                const rawDistY = mouseY - centerY;
                
                const clampedDistX = Math.max(-config.maxDistanceInput, Math.min(config.maxDistanceInput, rawDistX));
                const clampedDistY = Math.max(-config.maxDistanceInput, Math.min(config.maxDistanceInput, rawDistY));
                const targetBX = clampedDistX * config.magnetStrength; 
                const targetBY = clampedDistY * config.magnetStrength;
                
                buttonX += (targetBX - buttonX) * config.buttonLerp; 
                buttonY += (targetBY - buttonY) * config.buttonLerp;
                
                hoverEl.style.transform = `translate3d(${buttonX}px, ${buttonY}px, 0) scale(${config.scaleAmount})`;
            } else { 
                buttonX = 0; buttonY = 0; 
            }
            
            if (noSnap) {
                targetState.x = mouseX; targetState.y = mouseY; 
                targetState.width = config.baseSize; targetState.height = config.baseSize; 
                targetState.radius = config.baseSize/2;
            
            } else if (isMagneticText) {
                targetState.width = fixedWidth;
                targetState.height = 3; 
                targetState.radius = 10; 
                const verticalOffset = (hoverRect.height / 2) + 3;
                targetState.x = (hoverRect.left + hoverRect.width / 2) + buttonX; 
                targetState.y = (hoverRect.top + hoverRect.height / 2) + buttonY + verticalOffset;

            } else if (isImage) {
                    targetState.width = config.baseSize; 
                    targetState.height = config.baseSize; 
                    targetState.radius = config.baseSize/2;
                    targetState.x = mouseX;
                    targetState.y = mouseY;
            } else {
                const currentScale = config.scaleAmount;
                targetState.width = fixedWidth * currentScale; 
                targetState.height = fixedHeight * currentScale; 
                targetState.radius = fixedRadius * currentScale;
                
                targetState.x = (hoverRect.left + hoverRect.width / 2) + buttonX; 
                targetState.y = (hoverRect.top + hoverRect.height / 2) + buttonY;
            }
        }
    }

    currentState.x += (targetState.x - currentState.x) * config.cursorLerp;
    currentState.y += (targetState.y - currentState.y) * config.cursorLerp;
    currentState.width += (targetState.width - currentState.width) * config.cursorLerp;
    currentState.height += (targetState.height - currentState.height) * config.cursorLerp;
    currentState.radius += (targetState.radius - currentState.radius) * config.cursorLerp;

    cursor.style.transform = `translate3d(${currentState.x - currentState.width/2}px, ${currentState.y - currentState.height/2}px, 0)`;
    cursor.style.width = `${currentState.width}px`; 
    cursor.style.height = `${currentState.height}px`; 
    cursor.style.borderRadius = `${currentState.radius}px`;
    
    requestAnimationFrame(animate);
}

if (window.matchMedia("(pointer: fine)").matches) {
    animate();
}