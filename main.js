const test = document.getElementById("test");
const resultPage = document.querySelector(".results");


const getDetails = () => {
  
   const spinner = document.createElement('div');
   spinner.className = 'spinner';
   resultPage.innerHTML = '';  // clear previous content
   resultPage.appendChild(spinner);

   const link = document.getElementById('link').value;

   if (!link) {
  alert("Please enter a valid video URL.");
  resultPage.removeChild(spinner);
  return;
}
  
  const apiUrl = `https://tokfetch-backend.onrender.com/api/tiktok?url=${encodeURIComponent(link)}`;
	
	fetch(apiUrl)
	.then(res => res.json())
	.then(data => {
	 
	  console.log(data);

    setTimeout(() => {
    resultPage.removeChild(spinner);
  }, 2000);

    if (!data || data.message?.includes("exceeded the DAILY quota")) {
    alert("Service inactive at the moment. Please try again tomorrow!");
    return;
  }

    if (res.status === 429) {
  alert("Daily limit exceeded. Try again tomorrow.");
    }

    if (!data.data) {
    alert("Invalid response from TikTok. Please check the video link.");
    return;
  }
  
    resultPage.innerHTML = `<img data-aos="fade-up" height="100px" width="100px" style="border-radius: 50%;border: solid 0.7px #929292;" src="${data.data.author.avatar}"/>
      <p data-aos="fade-up" class="username">${data.data.author.nickname}<br>@${data.data.author.unique_id}</p>
      <video data-aos="fade-up" id="vidplayer" controls poster="${data.data.origin_cover}">
        <source src="${data.data.play}" type=video/mp4>
        </video>
        <div data-aos="fade-up" id="caption">
          <h2 style="text-align: center;color: white;font-family: Montserrat;"><i class="fa-solid fa-closed-captioning"></i> Caption</h2>
          <div data-aos="fade-up" class="title">
              <p id="titlecontent"> ${data.data.title}
              </p>
          </div>
          
          <div data-aos="fade-up" class="music">
            <img src="${data.data.music_info.cover}" alt="audio cover" class="cover-image">
            <audio data-aos="fade-up" controls >
              <source src="${data.data.music_info.play}" type="audio/mpeg">
            </audio>
            
            <h3 style="color: #7E7E7E;font-family: Montserrat;">${data.data.music_info.title}</h3>
            
            <button onclick="downloadFile('${data.data.music_info.play}', 'tokAudio.mp3')"> <i class="fa-solid fa-music"></i> Download Music</button>
          </div>
        </div>
      
        <div data-aos="fade-up" class="social">
           <h2 data-aos="fade-left" class="welcome"><span class="tok"><i class="fa-solid fa-chart-simple"></i> Video</span> <span class="fetch">Analytics</span></h2><br>
           <div class="reactions">
            <p><i class="fa-solid fa-heart"></i> ${data.data.digg_count}</p>
            <p><i class="fa-solid fa-comment"></i> ${data.data.comment_count}</p>
            <p><i class="fa-solid fa-eye"></i> ${data.data.play_count}</p>
            <p><i class="fa-solid fa-share"></i> ${data.data.share_count}</p>
            <p><i class="fa-solid fa-bookmark"></i> ${data.data.collect_count}</p>
            <p><i class="fa-solid fa-file-arrow-down"></i> ${data.data.download_count}</p>
            <p><i class="fa-solid fa-location-dot"></i> ${data.data.region}</p>
           </div>
       </div>
       
       <div data-aos="fade-up" class="downloads">
         <button onclick="downloadFile('${data.data.wmplay}', 'tokVideo.mp4')"  data-aos="fade-up" id="mark"><i class="fa-solid fa-file-video"></i> Download Video With Watermark </button>
         <button onclick="downloadFile( '${data.data.play}','WtokVideo.mp4')" data-aos="fade-up" id="wmark"><i class="fa-solid fa-video"></i> Download Video Without Watermark</button>
       </div>
       <div><p id="process"><i class="fa-solid fa-gauge-high"></i> Processing Time: ${Math.round(data.processed_time)} seconds</p></div>
      <div>
        
      </div>
    </div>`
  
	})
	.catch(err => {
  console.error("Error", err);
  alert("Something went wrong. Try again.");
  if (resultPage.contains(spinner)) {
    resultPage.removeChild(spinner);
  }
})
  
  };
  
  
