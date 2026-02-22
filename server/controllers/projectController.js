const Project = require('../models/Project');
const { UserModel } = require('../models/User');
const { runGenerationPipeline } = require('../services/engine');

const createProject = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user.isPro) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const todayCount = await Project.countDocuments({ userId: req.userId, createdAt: { $gte: startOfDay } });

      if (todayCount >= 2) {
        return res.status(429).json({
          error: 'Daily limit reached. You can generate up to 2 docs per day. Redeem a Pro code for unlimited access.',
          code: 'DAILY_LIMIT'
        });
      }
    }

    const { repoName, slug, techstack, llmProvider, template } = req.body;

    const existingProject = await Project.findOne({ slug });
    if (existingProject) {
      return res.status(400).json({ error: 'This URL slug is already taken.' });
    }

    const project = await Project.create({
      userId: req.userId,
      repoName,
      slug,
      techstack,
      llmProvider: llmProvider || 'gemini',
      template: template || 'modern'
    });

    // Fire the generation pipeline in the background (don't await)
    const repoUrl = `https://github.com/${repoName}`;
    // Bulletproof BYOK validation: only trust the key if it's real
    const rawCustomKey = (req.headers['x-custom-gemini-key'] || '').trim();
    const isCustomKeyValid = rawCustomKey && rawCustomKey !== 'null' && rawCustomKey.length > 30;

    const byokOptions = {
      customKey: isCustomKeyValid ? rawCustomKey : '',
      targetModel: req.headers['x-target-model'] || 'gemini-2.5-flash-lite',
    };
    runGenerationPipeline(project._id.toString(), repoUrl, project.llmProvider, byokOptions).catch((err) =>
      console.error('Pipeline failed for', project._id, err)
    );

    res.status(201).json({ message: 'Project configured successfully', project });

  } catch (error) {
    res.status(500).json({ error: 'Failed to create project.' });
  }
};

module.exports = { createProject };