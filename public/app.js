const presetGrid = document.getElementById('presetGrid');
const setupForm = document.getElementById('setupForm');
const presetInput = document.getElementById('presetInput');

async function loadPresets() {
  const presets = await fetch('/api/presets').then(r => r.json());
  presetGrid.innerHTML = '';
  presets.forEach((p, i) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'preset' + (i === 0 ? ' active' : '');
    card.innerHTML = `<strong>${p.name}</strong><p>${p.desc}</p><small>${p.tags.join(' • ')}</small>`;
    card.onclick = () => {
      document.querySelectorAll('.preset').forEach(el => el.classList.remove('active'));
      card.classList.add('active');
      presetInput.value = p.id;
      document.getElementById('previewPreset').textContent = `Preset: ${p.id}`;
    };
    presetGrid.appendChild(card);
  });
}

setupForm.addEventListener('input', () => {
  const fd = new FormData(setupForm);
  document.getElementById('previewName').textContent = fd.get('name') || 'Your Name';
  document.getElementById('previewTitle').textContent = fd.get('title') || 'Your Title';
  document.getElementById('previewBio').textContent = fd.get('bio') || 'Your bio appears here.';
});

setupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(setupForm);
  const data = await fetch('/api/export-prompt', { method:'POST', body:fd }).then(r => r.json());
  document.getElementById('promptOutput').textContent = data.prompt;
  await navigator.clipboard.writeText(data.prompt);
  alert('AI prompt copied to clipboard.');
});

document.getElementById('deployBtn').addEventListener('click', async () => {
  const fd = new FormData(setupForm);
  const name = (fd.get('name') || 'my-portfolio').toString();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const res = await fetch('/api/deploy', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ slug }) }).then(r => r.json());
  document.getElementById('deployOutput').textContent = `${res.message} URL: ${res.url}`;
});

loadPresets();
