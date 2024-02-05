document.addEventListener("DOMContentLoaded", function () {
  var paintingsContainer = document.querySelector("#paintings");
  var coverImage = document.querySelector("#cover-image img");
  var listItems = Array.from(paintingsContainer.querySelectorAll("li"));
  var batchSize = listItems.length; // This should match the original number of list items

  function updateCoverImage(item) {
    if (!item.classList.contains("active")) {
      listItems.forEach(function (elem) {
        elem.classList.remove("active");
      });
      item.classList.add("active");
      coverImage.src = item.getAttribute("data-cover");
      // Update Magnifier.js with the new image
      updateMagnifier(coverImage);
    }
  }

  function cloneListItems() {
    var list = paintingsContainer.querySelector("ul");
    listItems.slice(0, batchSize).forEach(function (item) {
      if (!item.classList.contains("cloned")) {
        var clone = item.cloneNode(true);
        clone.classList.remove("active");
        clone.classList.add("cloned");
        list.appendChild(clone);
        listItems.push(clone);
      }
    });
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  var updateActiveItemOnScroll = debounce(function () {
    var containerMidpoint =
      paintingsContainer.clientHeight / 2 + paintingsContainer.scrollTop;
    var closestItem = null;
    var closestDistance = Infinity;

    listItems.forEach(function (item) {
      var itemRect = item.getBoundingClientRect();
      var itemMidpoint =
        itemRect.top + itemRect.height / 2 + paintingsContainer.scrollTop;
      var distance = Math.abs(containerMidpoint - itemMidpoint);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestItem = item;
      }
    });

    if (closestItem) {
      updateCoverImage(closestItem);
    }
  }, 10);

  // Scroll event to update active item based on scroll position
  function onScroll() {
    requestAnimationFrame(updateActiveItemOnScroll);
    // Check if the user is close to the bottom of the container, then clone more items
    if (
      paintingsContainer.scrollTop + paintingsContainer.clientHeight >=
      paintingsContainer.scrollHeight - 100
    ) {
      cloneListItems();
    }
  }
  paintingsContainer.addEventListener("scroll", onScroll);

  // Initial cloning to fill the viewport
  while (paintingsContainer.scrollHeight <= paintingsContainer.clientHeight) {
    cloneListItems();
  }

  // Initial active item update
  requestAnimationFrame(updateActiveItemOnScroll);
});