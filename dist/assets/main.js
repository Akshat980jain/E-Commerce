// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
  console.log('QuickKart API Server is running');
  
  // Add current date to the page
  const dateElement = document.createElement('p');
  dateElement.textContent = `Current server date: ${new Date().toLocaleDateString()}`;
  document.querySelector('.container').appendChild(dateElement);
  
  // Add event listener to API links
  const apiLinks = document.querySelectorAll('a[href^="/api"]');
  apiLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      alert('This is a static demo. The API endpoint would be: ' + this.getAttribute('href'));
    });
  });
}); 