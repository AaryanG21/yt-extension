function updateUI() {
  const today = new Date().toDateString();
  const limitInput = document.getElementById('limit-input');
  const bar = document.getElementById('progress-bar');
  const timeText = document.getElementById('time-display');

  chrome.storage.local.get([today, 'limit'], (data) => {
    if (chrome.runtime.lastError) return;

    const secondsSpent = data[today] || 0;
    const limitMins = data['limit'] || 60;
    const limitSeconds = limitMins * 60;

    // 1. Update text display (Minutes)
    timeText.textContent = Math.floor(secondsSpent / 60);

    // 2. Prevent input-overwrite while typing
    if (document.activeElement !== limitInput) {
      limitInput.value = limitMins;
    }

    // 3. Calculate width using seconds for precision
    let percent = (secondsSpent / limitSeconds) * 100;
    if (percent > 100) percent = 100;
    
    bar.style.width = percent + '%';

    // 4. Color Change Logic
    if (secondsSpent >= limitSeconds) {
      bar.classList.add('over-limit');
      timeText.style.color = '#f44336'; // Turn text red too
    } else {
      bar.classList.remove('over-limit');
      timeText.style.color = '#4caf50'; // Back to green
    }
  });
}

// Event Listeners
document.getElementById('limit-input').addEventListener('change', (e) => {
  const val = parseInt(e.target.value);
  if (val > 0) chrome.storage.local.set({ 'limit': val }, updateUI);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  const today = new Date().toDateString();
  chrome.storage.local.set({ [today]: 0 }, updateUI);
});

setInterval(updateUI, 1000);
updateUI();