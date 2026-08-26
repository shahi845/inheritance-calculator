/**
 * touchSteppers.js — Touch-friendly +/- stepper buttons for mobile & desktop heir inputs.
 * Enhances standard number inputs with tactile increment/decrement controls.
 */

export function initTouchSteppers() {
    const heirGroups = document.querySelectorAll('.heirs-container .input-group');

    heirGroups.forEach(group => {
        const input = group.querySelector('input[type="number"]');
        if (!input || input.dataset.stepperInitialized) return;

        input.dataset.stepperInitialized = 'true';

        // Check bounds
        const min = input.hasAttribute('min') ? parseInt(input.getAttribute('min')) : 0;
        const max = input.hasAttribute('max') ? parseInt(input.getAttribute('max')) : Infinity;

        // Create stepper wrapper
        const stepperWrap = document.createElement('div');
        stepperWrap.className = 'stepper-container';

        // Decrement button
        const decBtn = document.createElement('button');
        decBtn.type = 'button';
        decBtn.className = 'stepper-btn stepper-btn-dec';
        decBtn.innerHTML = '−';
        decBtn.setAttribute('aria-label', `Decrease ${input.id}`);

        // Increment button
        const incBtn = document.createElement('button');
        incBtn.type = 'button';
        incBtn.className = 'stepper-btn stepper-btn-inc';
        incBtn.innerHTML = '+';
        incBtn.setAttribute('aria-label', `Increase ${input.id}`);

        // Handle decrement
        const decrement = (e) => {
            e.preventDefault();
            const currentVal = parseInt(input.value) || 0;
            if (currentVal > min) {
                input.value = currentVal - 1;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        };

        // Handle increment
        const increment = (e) => {
            e.preventDefault();
            const currentVal = parseInt(input.value) || 0;
            if (currentVal < max) {
                input.value = currentVal + 1;
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }
        };

        decBtn.addEventListener('click', decrement);
        incBtn.addEventListener('click', increment);

        // Replace input in DOM with wrapped stepper
        input.parentNode.insertBefore(stepperWrap, input);
        stepperWrap.appendChild(decBtn);
        stepperWrap.appendChild(input);
        stepperWrap.appendChild(incBtn);
    });
}
