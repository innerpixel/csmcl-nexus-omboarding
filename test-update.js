// Simple script to simulate a service worker update
console.log('Simulating service worker update...');
const event = new CustomEvent('swUpdate');
window.dispatchEvent(event);
console.log('Update event dispatched!');
