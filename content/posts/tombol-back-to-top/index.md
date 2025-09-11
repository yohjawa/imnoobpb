---
title: Tambahkan tombol back to top di hugo
date: 2025-09-09T11:59:12+08:00
thumbnail: img/placeholder.png
tags:
  - hugo
  - code
  - javascript
  - css
categories:
  - Hugo
slug: tombol-back-to-top
---

----------
Saya kan pake theme [Mainroad](https://github.com/Vimux/Mainroad/) di blog ini. Themenya menarik sih, cuma pas postingan agak panjang, jadi perlu scroll ke bawah buat baca. Pas mau scroll balik lagi paling atas, harus manual scroll. 

Jadi nya saya mau tambahin aja satu tombol biar sekali klik aja langsung balik ke paling atas
Langkah-langkahnya di bawah :
<!--more-->
1. Buat dulu satu javascript file di `static/js/back-to-top.js`. Isi filenya :
    ```javascript
    document.addEventListener('DOMContentLoaded', function() {
        // Create the back-to-top button
        const backToTopButton = document.createElement('button');
        backToTopButton.id = 'back-to-top';
        backToTopButton.className = 'back-to-top';
        backToTopButton.setAttribute('aria-label', 'Back to top');
        
        // Add SVG icon
        
        backToTopButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
        `;

        // Add the button to the body
        document.body.appendChild(backToTopButton);
        
        const scrollThreshold = 300;
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > scrollThreshold) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });

        // Smooth scroll to top when clicked
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    ```
2. Buat juga satu css file di `static/css/back-to-top.cs`. Isi filenya :
    ```css
    .back-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #2c3e50;
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .back-to-top.visible {
        opacity: 1;
        visibility: visible;
    }

    .back-to-top:hover {
        background-color: #34495e;
        transform: translateY(-2px);
    }

    .back-to-top:active {
        transform: translateY(0);
    }
    ```
3. Update config hugonya bagian `customCSS` sama `customJS` buat tambahin file javascript dan css yang di buat sebelumnya
    ```toml
    [Param]
        ----
        customCSS = [
            ------,
            "css/back-to-top.css"
            ]
        customJS = [
            ----,
            "js/back-to-top.js"
            ]
        ----
    ```
4. Udah selesai, sekarang kalau pagenya di scroll ke bawah, nanti otomatis muncul tombol yang di pojok kanan bawah kayak contoh di halaman ini. Klik tombol itu dan halamannya otomatis ke scroll ke paling atas deh.
----------

Silahkan tinggalin komentar kalau ada yang mau ditanyain atau didiskusikan yah. Terima kasih