// Copy function
function copyCode(button) {
  const codeBlock = button.previousElementSibling;
  const codeText = codeBlock.querySelector('code').textContent;
  
  navigator.clipboard.writeText(codeText).then(() => {
    // Visual feedback - success
    button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"></path></svg>';
    button.title = 'Copied!';
    
    // Reset after 2 seconds
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

// Auto-add copy buttons to all code blocks
document.addEventListener('DOMContentLoaded', function() {
  // Target only pre>code blocks (not inline code)
  document.querySelectorAll('pre > code').forEach(codeBlock => {
    const pre = codeBlock.parentElement;
    
    // Skip if already has a copy button
    if (pre.parentElement.classList.contains('code-block-wrapper')) {
      return;
    }
    
    // Create copy button
    const button = document.createElement('button');
    button.className = 'copy-code-button';
    button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>';
    button.title = 'Copy code';
    button.setAttribute('aria-label', 'Copy code to clipboard');
    button.onclick = () => copyCode(button);
    
    // Create wrapper div
    const wrapper = document.createElement('div');
    wrapper.className = 'code-block-wrapper';
    
    // Insert wrapper and move pre into it
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);
    wrapper.appendChild(button);
  });
});