---
title: Tambahkan tombol copy di Hugo Code Block
date: 2025-09-09T09:12:12+08:00
thumbnail: img/placeholder.png
tags:
  - hugo
  - code
  - javascript
  - css
categories:
  - Hugo
slug: tombol-copy-di-code-block
---

----------
Tulisan-tulisan di sini kan beberapa di antaranya saya sertakan potongan code. Tapi block code bawaan theme ini, atau mungkin dari hugonya, hanya nampilin block codenya aja, kalau mau copy mesti di block lagi codenya baru copy.

Jadinya kepikiran buat tambahin tombol kecil di code block nya biar sekali di klik itu langsung copy codenya ke clipboard trus tinggal paste kemana saja sesuka hati. Modal google sama [Deepseek](https://chat.deepseek.com/) akhirnya bisa tambahin tombol copy code kayak yang ada di postingan ini
<!--more-->
Langsung mulai aja :
1. Bikin file javascript di `static/js/copycode.js` isinya ada dua bagian :
   - Fungsi atau metode untuk copynya :
     ```javascript
     function copyCode(button) {
        const codeBlock = button.previousElementSibling;
        const codeText = codeBlock.querySelector('code').textContent;
        
        navigator.clipboard.writeText(codeText).then(() => {
            button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>';
            button.title = 'Copied!';
            
            setTimeout(() => {
            button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>';
            button.title = 'Copy code';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            button.innerHTML = '❌ Error';
            setTimeout(() => {
            button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>';
            }, 2000);
        });
     }
     ```
   - Metode untuk tambahin tombol copy di semua block code dalam satu aplikasi hugo
     ```javascript
     document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('pre > code').forEach(codeBlock => {
            const pre = codeBlock.parentElement;
            
            if (pre.parentElement.classList.contains('code-block-wrapper')) {
            return;
            }
            
            const button = document.createElement('button');
            button.className = 'copy-code-button';
            button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>';
            button.title = 'Copy code';
            button.setAttribute('aria-label', 'Copy code to clipboard');
            button.onclick = () => copyCode(button);
            
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);
            wrapper.appendChild(button);
        });
     });
     ```
   Gak perlu lah dijelasin arti coddingan ini yah, saya juga gak bisa jelasin, soalnya copy sana-sini hehe.
2. Lanjut bikin css file di `static/css/copycode.css` untuk styling tombolnya nanti
   ```css
   .code-block-wrapper {
        position: relative;
        margin: 1.5rem 0;
        border-radius: 8px;
        overflow: hidden;
    }

    .copy-code-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.4rem 0.6rem;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid #e1e4e8;
        border-radius: 6px;
        cursor: pointer;
        opacity: 0.7;
        transition: all 0.2s ease;
        font-size: 12px;
        z-index: 10;
    }

    .copy-code-button:hover {
        opacity: 1;
        background: rgba(255, 255, 255, 1);
        border-color: #0366d6;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .copy-code-button:active {
        transform: translateY(0);
    }

    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
        .copy-code-button {
            background: rgba(36, 41, 46, 0.8);
            border-color: #444d56;
            color: #e1e4e8;
        }
        
        .copy-code-button:hover {
            background: rgba(47, 54, 61, 0.9);
            border-color: #0366d6;
        }
    }

    /* Ensure code blocks have proper spacing */
    pre {
        margin: 0;
        padding: 1rem;
        overflow-x: auto;
    }

    pre code {
        display: block;
        padding: 0;
    }

    /* Responsive design */
    @media (max-width: 768px) {
        .copy-code-button {
            padding: 0.3rem 0.5rem;
            font-size: 11px;
        }
        
        pre {
            padding: 0.8rem;
        }
    }
   ```
3. Edit file config hugonya `config/_default/hugo.toml` buat tambahin settingan di bawah:
    ```toml
    [Params]
        ---
        customCSS = ["css/copy-code.css"]
        customJS = ["js/copy-code.js"]
        ---
    ```    
4. Udah deh gitu aja, jalanin aja lagi perintah `hugo start` trus coba akses hugonya, nanti di block codenya akan muncul tombol kecil di pojok kanan atas dari block untuk copy. 

----------

Silahkan tinggalin komentar kalau ada yang mau ditanyain atau didiskusikan yah. Terima kasih