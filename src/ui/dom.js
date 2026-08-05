/**
 * dom.js — Generic DOM helpers
 */

export const $ = (selector) => document.querySelector(selector);
export const $$ = (selector) => document.querySelectorAll(selector);

export const on = (element, event, handler) => {
    if (element) {
        element.addEventListener(event, handler);
    }
};

export const show = (element) => {
    if (element) element.classList.remove('hidden');
};

export const hide = (element) => {
    if (element) element.classList.add('hidden');
};
