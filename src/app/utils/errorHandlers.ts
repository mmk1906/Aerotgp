// Global error handlers to prevent error cascades

let errorCount = 0;
let lastErrorTime = 0;
const ERROR_THRESHOLD = 5;
const ERROR_WINDOW = 1000; // 1 second

export function initializeErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Prevent default to avoid cascading errors
    event.preventDefault();
    
    // Check for error flooding
    const now = Date.now();
    if (now - lastErrorTime < ERROR_WINDOW) {
      errorCount++;
    } else {
      errorCount = 1;
    }
    lastErrorTime = now;

    // If too many errors in a short time, stop propagation
    if (errorCount > ERROR_THRESHOLD) {
      console.warn('Too many errors detected. Suppressing further errors.');
      return false;
    }
  });

  // Handle global errors
  window.addEventListener('error', (event) => {
    // Ignore ResizeObserver errors (common in dev environments)
    if (event.message?.includes('ResizeObserver')) {
      event.preventDefault();
      return false;
    }

    // Check for error flooding
    const now = Date.now();
    if (now - lastErrorTime < ERROR_WINDOW) {
      errorCount++;
    } else {
      errorCount = 1;
    }
    lastErrorTime = now;

    // If too many errors in a short time, suppress
    if (errorCount > ERROR_THRESHOLD) {
      event.preventDefault();
      return false;
    }

    console.error('Global error:', event.error || event.message);
  }, true);
}

// Cleanup function
export function cleanupErrorHandlers() {
  errorCount = 0;
  lastErrorTime = 0;
}
