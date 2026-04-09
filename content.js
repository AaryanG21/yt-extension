let alerted = false;

function track() {
  if (!chrome.runtime?.id) return; 

  const video = document.querySelector('video');
  const isPlaying = video && !video.paused && !video.ended && video.readyState > 2;

  if (isPlaying && !document.hidden) {
    const today = new Date().toDateString();

    chrome.storage.local.get([today, 'limit'], (data) => {
      if (chrome.runtime.lastError) return;

      let time = (data[today] || 0) + 1;
      let limitMins = data['limit'] || 60;

      chrome.storage.local.set({ [today]: time });

      // Alert once per session
      if (time >= limitMins * 60 && !alerted) {
        alert("Daily YouTube limit reached!");
        alerted = true;
      } else if (time < limitMins * 60) {
        alerted = false;
      }
    });
  }
}

setInterval(track, 1000);