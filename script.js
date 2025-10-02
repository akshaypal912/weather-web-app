// === CONFIG ===
    // API key you provided (you can replace it with your own)
    const apiKey = 'b5fe04f2b2044fe696e30326250210';
    const baseUrl = 'https://api.weatherapi.com/v1/current.json';

    // DOM
    const qInput = document.getElementById('q');
    const btn = document.getElementById('searchBtn');
    const status = document.getElementById('status');
    const icon = document.getElementById('icon');
    const locationEl = document.getElementById('location');
    const localtimeEl = document.getElementById('localtime');
    const tempEl = document.getElementById('temp');
    const conditionEl = document.getElementById('condition');
    const humidityEl = document.getElementById('humidity');
    const windEl = document.getElementById('wind');
    const feelsEl = document.getElementById('feelslike');
    const pressureEl = document.getElementById('pressure');
    const moreInfo = document.getElementById('moreInfo');
    const lastUpdated = document.getElementById('lastUpdated');
    const rawUrl = document.getElementById('rawUrl');

    function setStatus(text, isError=false){
      status.textContent = text;
      status.className = isError ? 'small error' : 'small loading';
    }





    async function fetchWeather(q){
      setStatus('Fetching weather...');
      try{
        const url = `${baseUrl}?key=${apiKey}&q=${encodeURIComponent(q)}&aqi=yes`;
        rawUrl.textContent = url;
        const res = await fetch(url);
        if(!res.ok){
          const errText = await res.text();
          throw new Error('API error: '+res.status+' '+errText);
        }
        const json = await res.json();
        render(json);
        setStatus('Updated');
      }catch(err){
        console.error(err);
        setStatus('Failed to fetch — check console / API key / network', true);
      }
    }

    function render(data){
      if(!data || !data.location) return setStatus('No data returned', true);

      const loc = `${data.location.name}, ${data.location.region || data.location.country}`;
      locationEl.textContent = loc;
      localtimeEl.textContent = 'Local: ' + data.location.localtime;

      const c = data.current;
      tempEl.textContent = `${Math.round(c.temp_c)}°C`;
      conditionEl.textContent = c.condition.text;
      icon.src = 'https:' + c.condition.icon.replace(/^\//, '');
      icon.alt = c.condition.text;

      humidityEl.textContent = c.humidity;
      windEl.textContent = c.wind_kph + ' kph';
      feelsEl.textContent = c.feelslike_c;
      pressureEl.textContent = c.pressure_mb;

      moreInfo.innerHTML = `
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <div class="small">UV index: <strong>${c.uv}</strong></div>
          <div class="small">Cloud: <strong>${c.cloud}%</strong></div>
          <div class="small">Visibility: <strong>${c.vis_km} km</strong></div>
          <div class="small">Precipitation: <strong>${c.precip_mm} mm</strong></div>
          <div class="small">Air Quality (PM2.5): <strong>${data.current.air_quality? Math.round(data.current.air_quality.pm2_5) : 'N/A'}</strong></div>
        </div>
      `;

      lastUpdated.textContent = 'Last update: ' + c.last_updated;
    }

    // Event
    btn.addEventListener('click', ()=> fetchWeather(qInput.value || 'London'));
    qInput.addEventListener('keyup', (e)=>{ if(e.key==='Enter') fetchWeather(qInput.value || 'London'); });

    // load default
    fetchWeather(qInput.value || 'London');