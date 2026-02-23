const Project = require('../models/Project');
const { UserModel } = require('../models/User');
const { docGenerationQueue } = require('../services/queue');

// Helper to fetch the latest commit SHA for a GitHub repo (default branch usually)
async function fetchLatestCommitHash(repoName, accessToken) {
  try {
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

    const response = await fetch(`https://api.github.com/repos/${repoName}/commits`, { headers });
    if (!response.ok) return null;
    const commits = await response.json();
    return commits.length > 0 ? commits[0].sha : null;
  } catch (error) {
    console.error('Failed to fetch commit hash:', error);
    return null;
  }
}

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

    const existingSlug = await Project.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ error: 'This URL slug is already taken.' });
    }

    // Smart Caching Logic: Fetch latest commit SHA
    const commitHash = await fetchLatestCommitHash(repoName, user.githubAccessToken);
    const repoUrl = `https://github.com/${repoName}`;

    if (commitHash) {
      // Check if we've already generated docs for this exact commit across the platform
      const cachedProject = await Project.findOne({ repoName, commitHash, generatedDocs: { $ne: '' } });

      if (cachedProject) {
        console.log(`[Cache Hit] Serving cached docs for ${repoName}@${commitHash.substring(0, 7)}`);

        const project = await Project.create({
          userId: req.userId,
          repoName,
          slug,
          techstack,
          commitHash,
          llmProvider: cachedProject.llmProvider, // Inherit
          template: template || 'modern',
          generatedDocs: cachedProject.generatedDocs,
          status: 'ready' // Instantly ready!
        });

        return res.status(201).json({ message: 'Project configured successfully', project, cached: true });
      }
    }

    // Cache Miss: Create Project and Queue Job
    const project = await Project.create({
      userId: req.userId,
      repoName,
      slug,
      techstack,
      llmProvider: llmProvider || 'gemini',
      template: template || 'modern',
      commitHash: commitHash || '', // Store what we found (if any)
      status: 'queued' // Mark as queued
    });

    const rawCustomKey = (req.headers['x-custom-gemini-key'] || '').trim();
    const isCustomKeyValid = rawCustomKey && rawCustomKey !== 'null' && rawCustomKey.length > 30;
    const byokOptions = {
      customKey: isCustomKeyValid ? rawCustomKey : '',
      targetModel: req.headers['x-target-model'] || 'gemini-2.5-flash-lite',
    };

    // Add to BullMQ Queue (Async)
    const job = await docGenerationQueue.add('generateDocs', {
      projectId: project._id.toString(),
      repoUrl,
      commitHash,
      llmProvider: project.llmProvider,
      byokOptions,
    });

    console.log(`[Queue] Added job ${job.id} for project ${project._id}`);

    res.status(201).json({
      message: 'Project queued for documentation generation',
      project,
      jobId: job.id,
      status: 'queued'
    });

  } catch (error) {
    console.error('Error in createProject:', error);
    res.status(500).json({ error: 'Failed to create project.' });
  }
};

const getJobStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await docGenerationQueue.getJob(id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const state = await job.getState();
    const progress = job.progress;
    const failedReason = job.failedReason;

    return res.json({
      jobId: id,
      state, // e.g., 'waiting', 'active', 'completed', 'failed'
      progress,
      failedReason
    });
  } catch (error) {
    console.error('Error fetching job status:', error);
    res.status(500).json({ error: 'Failed to fetch job status.' });
  }
};

module.exports = { createProject, getJobStatus };