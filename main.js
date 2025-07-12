const test = document.getElementById("test");
const resultPage = document.querySelector(".results");

const getDetails = () => {
  const link = document.getElementById('link').value;

  if (!link) {
    alert("Please enter a valid video URL.");
    return;
  }

  // Create and show spinner
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  resultPage.innerHTML = '';
  resultPage.appendChild(spinner);

  const apiUrl = `https://tokfetch-backend.onrender.com/api/tiktok?url=${encodeURIComponent(link)}`;

  fetch(apiUrl)
    .then(res => {
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error("Daily quota exceeded. Try again tomorrow.");
        } else {
          throw new Error("Server error: " + res.status);
        }
      }
      return res.json();
    })
    .then(data => {
      resultPage.removeChild(spinner); // remove spinner as early as possible

      if (!data.data) {
        alert("Invalid response from TikTok. Please check the video link.");
        return;
      }

      const videoData = data.data;

      resultPage.innerHTML = `
        <img data-aos="fade-up" height="100px" width="100px" style="border-radius: 50%; border: solid 0.7px #929292;" src="${videoData.author.avatar}" />
        <p data-aos="fade-up" class="username">${videoData.author.nickname}<br>@${videoData.author.unique_id}</p>

        <video data-aos="fade-up" id="vidplayer" controls poster="${videoData.origin_cover}">
          <source src="${videoData.play}" type="video/mp4">
        </video>

        <div data-aos="fade-up" id="caption">
          <h2 style="text-align: center; color: white; font-family: Montserrat;">
            <i class="fa-solid fa-closed-captioning"></i> Caption
          </h2>
          <div class="title">
            <p id="titlecontent">${videoData.title}</p>
          </div>

          <div class="music">
            <img src="${videoData.music_info.cover}" alt="audio cover" class="cover-image">
            <audio data-aos="fade-up" controls>
              <source src="${videoData.music_info.play}" type="audio/mpeg">
            </audio>
            <h3 style="color: #7E7E7E; font-family: Montserrat;">${videoData.music_info.title}</h3>
            <button onclick="downloadFile('${videoData.music_info.play}', 'tokAudio.mp3')">
              <i class="fa-solid fa-music"></i> Download Music
            </button>
          </div>
        </div>

        <div data-aos="fade-up" class="social">
          <h2 class="welcome">
            <span class="tok"><i class="fa-solid fa-chart-simple"></i> Video</span>
            <span class="fetch">Analytics</span>
          </h2>
          <div class="reactions">
            <p><i class="fa-solid fa-heart"></i> ${videoData.digg_count}</p>
            <p><i class="fa-solid fa-comment"></i> ${videoData.comment_count}</p>
            <p><i class="fa-solid fa-eye"></i> ${videoData.play_count}</p>
            <p><i class="fa-solid fa-share"></i> ${videoData.share_count}</p>
            <p><i class="fa-solid fa-bookmark"></i> ${videoData.collect_count}</p>
            <p><i class="fa-solid fa-file-arrow-down"></i> ${videoData.download_count}</p>
            <p><i class="fa-solid fa-location-dot"></i> ${videoData.region}</p>
          </div>
        </div>

        <div data-aos="fade-up" class="downloads">
          <button onclick="downloadFile('${videoData.wmplay}', 'tokVideo_watermark.mp4')" id="mark">
            <i class="fa-solid fa-file-video"></i> Download Video With Watermark
          </button>
          <button onclick="downloadFile('${videoData.play}', 'tokVideo_no_watermark.mp4')" id="wmark">
            <i class="fa-solid fa-video"></i> Download Video Without Watermark
          </button>
        </div>

        <div data-aos="fade-up">
          <p id="process">
            <i class="fa-solid fa-gauge-high"></i> Processing Time: ${Math.round(data.processed_time)} seconds
          </p>
        </div>
      `;
    })
    .catch(err => {
      console.error("Error:", err.message);
      alert(err.message);
      if (resultPage.contains(spinner)) {
        resultPage.removeChild(spinner);
      }
    });
};

// Helper: Download file from URL
function downloadFile(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
