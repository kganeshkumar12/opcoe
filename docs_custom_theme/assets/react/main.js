import React from "react";
import ReactDOM from "react-dom";
import MigrDash from './migr-dash';
import { createRoot } from 'react-dom/client';

function imgZoomInit() {
  const zoomistElements = document.querySelectorAll('.zoomist-container');
  zoomistElements.forEach((el) => {
    if (el.offsetWidth > 0) {
      new Zoomist(el, {
        maxScale: 4,
        bounds: true,
        slider: true,
        zoomer: true
      });
    }
  });
}

function dgrmTabInit() {
  let tabNav = document.querySelectorAll(".dgrm-tab-nav-item");
  for (let i = 0; i < tabNav.length; i++) {
    if (tabNav[i]) {
      tabNav[i].addEventListener("click", function(el) {
        let parentEl = el.target.closest('.dgrm-body');
        let childNav = parentEl.querySelectorAll(".dgrm-tab-nav-item");
        let childBody = parentEl.querySelectorAll(".dgrm-tab-body");
        childNav.forEach(item => {
          item.classList.remove("active");
        });
        childBody.forEach(item => {
          item.classList.remove("active");
        });
        el.target.classList.add("active");
        let childBodyActive = parentEl.querySelector(`.${el.target.getAttribute('data-tab-body')}`);
        childBodyActive.classList.add("active");
        imgZoomInit();
      });
    }
  }
}

function tocScrollOffsetInit() {
  const headerHeight = document.querySelector(".md-header").offsetHeight || 160;
  document.querySelectorAll(".md-sidebar__inner .md-nav__link").forEach(link => {
    link.addEventListener("click", function (event) {
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        event.preventDefault();
        const offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight - 10;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // dashboard init
  const migrDashRoot = document.getElementById('migrDashRoot');
  if (migrDashRoot) {
    const root = createRoot(migrDashRoot);
    root.render(<MigrDash />);
  }

  // diagram tab init
  const dgrmTabNav = document.querySelectorAll('.dgrm-tab-nav-item');
  const dgrmTabBody = document.querySelectorAll('.dgrm-tab-body');
  if (dgrmTabNav.length > 1 && dgrmTabBody.length > 1) {
    dgrmTabInit();
  }
  
  // img zoom init
  imgZoomInit();

  // toc scroll offset init
  tocScrollOffsetInit();
});
