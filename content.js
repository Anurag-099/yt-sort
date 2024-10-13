console.log('Content script is loaded!');

// Function to get the video duration in seconds
function getVideoDurationInSeconds(videoElement) {
  const durationText = videoElement.querySelector('span.ytd-thumbnail-overlay-time-status-renderer').innerText.trim();
  const timeParts = durationText.split(':').map(Number);
  if (timeParts.length === 2) {
    return timeParts[0] * 60 + timeParts[1]; // MM:SS
  } else if (timeParts.length === 3) {
    return timeParts[0] * 3600 + timeParts[1] * 60 + timeParts[2]; // HH:MM:SS
  }
  return 0; // In case of invalid format
}

// Function to sort the videos based on the order (asc/desc)
function sortVideos(order) {
  try {
    const videos = [...document.querySelectorAll('ytd-video-renderer')]; // Get all video elements

    if (!videos.length) {
      console.error("No videos found!");
      return;
    }

    console.log(`Found ${videos.length} videos. Sorting in ${order} order.`);

    // Sorting logic
    videos.sort((a, b) => {
      const aTime = getVideoDurationInSeconds(a); // Get video duration for video a
      const bTime = getVideoDurationInSeconds(b); // Get video duration for video b
      return order === "asc" ? aTime - bTime : bTime - aTime; // Ascending or Descending
    });

    const container = document.querySelector('#contents'); // The video container
    container.innerHTML = ''; // Clear the container to allow reordering
    videos.forEach((video) => container.appendChild(video)); // Append videos in sorted order

    console.log("Videos sorted successfully!");
  } catch (error) {
    console.error("Error sorting videos:", error);
  }
}

// Function to scroll the page and load more videos
function scrollAndLoadVideos(callback) {
  const initialVideoCount = document.querySelectorAll('ytd-video-renderer').length; // Initial video count
  let currentVideoCount = initialVideoCount;

  const scrollInterval = setInterval(() => {
    window.scrollTo(0, document.body.scrollHeight); // Scroll down
    setTimeout(() => {
      const newVideoCount = document.querySelectorAll('ytd-video-renderer').length; // New video count after scrolling
      console.log(`Current video count: ${newVideoCount}`);
      
      // If new videos are loaded, update the count
      if (newVideoCount > currentVideoCount) {
        currentVideoCount = newVideoCount;
      } else {
        // No new videos loaded, stop scrolling
        clearInterval(scrollInterval);
        callback(); // Once all videos are loaded, call the sorting function
      }
    }, 1000); // Wait 1 second before checking again
  }, 1500); // Scroll every 1.5 seconds
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.command === "sortVideos") {
    scrollAndLoadVideos(() => {
      sortVideos(message.order); // Sort videos after all have loaded
    });
  }
});
