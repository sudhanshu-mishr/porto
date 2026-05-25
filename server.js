const express = require('express');
const path = require('path');
const multer = require('multer');

const app = express();
const upload = multer({ dest: path.join(__dirname, 'tmp') });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/presets', (_req, res) => {
  res.json([
    { id: 'minimal-editorial', name: 'Minimal Editorial', desc: 'Elegant and spacious for design-focused profiles', tags: ['Minimal', 'Editorial', 'Designer'] },
    { id: 'product-case', name: 'Product Case', desc: 'Structured layout for case studies and impact metrics', tags: ['Product', 'Case Study'] },
    { id: 'developer-clean', name: 'Developer Clean', desc: 'Lean technical portfolio with project-first hierarchy', tags: ['Developer', 'Clean'] },
    { id: 'creative-grid', name: 'Creative Grid', desc: 'Visual-first grid layout for creative work', tags: ['Creative', 'Grid'] }
  ]);
});

app.post('/api/export-prompt', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'portfolio', maxCount: 1 }]), (req, res) => {
  const body = req.body;
  const preset = body.preset || 'minimal-editorial';
  const prompt = `You are a senior web designer and front-end engineer.\n\nBuild a production-ready portfolio website.\n\n[PRESET]\n- ID: ${preset}\n- Style: premium minimal, clean typography, subtle animation\n\n[USER]\n- Name: ${body.name || ''}\n- Title: ${body.title || ''}\n- Bio: ${body.bio || ''}\n- Links: ${body.links || ''}\n\n[REQUIREMENTS]\n- Responsive on mobile + desktop\n- Include Hero, About, Projects, Experience, Contact\n- Keep visual language minimal and polished\n- Avoid generic AI visuals\n\n[OUTPUT]\nProvide complete code and structure.`;

  res.json({ prompt, deployDraft: { slug: (body.name || 'my-portfolio').toLowerCase().replace(/[^a-z0-9]+/g, '-'), preset } });
});

app.post('/api/deploy', (req, res) => {
  const slug = req.body.slug || 'my-portfolio';
  const fakeUrl = `https://${slug}.onrender.com`;
  res.json({ status: 'live', url: fakeUrl, message: 'Deployment simulated for MVP. Wire this route to Render Deploy Hook/API for production.' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`PresetFolio running on port ${port}`);
});
