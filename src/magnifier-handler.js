var evt = new Event(),
    magnifier = new Magnifier(evt);

function setMagnifier(coverImage) {
  magnifier.attach({
    thumb: '#painting',
    large: coverImage.getAttribute('data-large'),
    mode: 'inside', // or 'outside' if you want the zoomed image outside of the original image
    zoom: 3, // Adjust the zoom level based on your preference
    zoomable: true // Enable mouse wheel zooming
  });
}

document.addEventListener('DOMContentLoaded', function () {
  // Attach magnifier to the initial cover image
  var coverImage = document.querySelector("#cover-image img");
  setMagnifier(coverImage);
});

// Expose function to update magnifier for external usage
function updateMagnifier(newCoverImage) {
  setMagnifier(newCoverImage);
}
