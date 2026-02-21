const Project = require('../models/Project');
const { runGenerationPipeline } = require('../services/engine');

const createProject = async (req, res) => {
  try {
    const { repoName, slug, techstack } = req.body;

    const existingProject = await Project.findOne({ slug });
    if (existingProject) {
      return res.status(400).json({ error: 'This URL slug is already taken.' });
    }

    const project = await Project.create({
      userId: req.userId,
      repoName,
      slug,
      techstack
    });

    // Fire the generation pipeline in the background (don't await)
    const repoUrl = `https://github.com/${repoName}`;
    runGenerationPipeline(project._id.toString(), repoUrl).catch((err) =>
      console.error('Pipeline failed for', project._id, err)
    );

    res.status(201).json({ message: 'Project configured successfully', project });

  } catch (error) {
    res.status(500).json({ error: 'Failed to create project.' });
  }
};

module.exports = { createProject };