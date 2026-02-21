const Project = require('../models/Project');

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

    res.status(201).json({ message: 'Project configured successfully', project });


  } catch (error) {
    res.status(500).json({ error: 'Failed to create project.' });
  }
};

module.exports = { createProject };