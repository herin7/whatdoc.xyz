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

    // Gatekeeper Logic
    if (user.isPro && user.proExpiryDate && new Date() > user.proExpiryDate) {
      user.isPro = false;
      user.planTier = 'free';
      await user.save();
    }

    if (!user.isPro) {
      const baseLimit = user.has5DocsLimit ? 5 : 2;
      const currentLimit = baseLimit + (user.promoGenerations || 0);
      if (user.generationCount >= currentLimit) {
        return res.status(403).json({ error: 'Free tier limit reached!', code: 'UPGRADE_REQUIRED' });
      }
    } else {
      // Pro user repo limit logic based on plan
      const repoCount = await Project.countDocuments({ userId: req.userId });
      const limit = user.planTier === '499' ? 10 : (user.planTier === '999' ? 25 : 0);

      if (limit > 0 && repoCount >= limit) {
        return res.status(403).json({ error: `Plan limit reached! Your plan allows up to ${limit} repos.`, code: 'UPGRADE_REQUIRED' });
      }
    }

    const { repoName, slug, techstack, llmProvider, template } = req.body;

    const existingSlug = await Project.findOne({ slug });
    if (existingSlug) {
      return res.status(400).json({ error: 'This URL slug is already taken.' });
    }

    // Smart Caching Logic: Fetch latest commit SHA
    const commitHash = await fetchLatestCommitHash(repoName, user.githubAccessToken);

    // Inject OAuth token into the Git URL for simpleGit to grab Private Repos perfectly!
    const repoUrl = user.githubAccessToken
      ? `https://x-access-token:${user.githubAccessToken}@github.com/${repoName}.git`
      : `https://github.com/${repoName}.git`;


    // Cache Miss: Create Project and Queue Job
    const project = await Project.create({
      userId: req.userId,
      repoName,
      slug,
      techstack,
      llmProvider: llmProvider || 'gemini',
      template: template || 'modern',
      isPremium: user.isPro || user.hasPremiumTemplates || false,
      commitHash: commitHash || '', // Store what we found (if any)
      status: 'queued' // Mark as queued
    });

    const rawCustomKey = (req.headers['x-custom-api-key'] || '').trim();
    const isCustomKeyValid = rawCustomKey && rawCustomKey !== 'null' && rawCustomKey.length > 20;
    if (!isCustomKeyValid) {
      return res.status(400).json({ error: 'API key is required. Provide your own key (BYOK) to generate docs.', code: 'API_KEY_REQUIRED' });
    }
    const byokOptions = {
      customKey: rawCustomKey,
      targetModel: req.headers['x-target-model'] || 'gemini-2.5-flash',
    };

    // Add to BullMQ Queue (Async)
    const jobOptions = user.isPro ? { priority: 1 } : { priority: 10 };

    const job = await docGenerationQueue.add('generateDocs', {
      projectId: project._id.toString(),
      repoUrl,
      commitHash,
      llmProvider: project.llmProvider,
      byokOptions,
    }, jobOptions);

    console.log(`[Queue] Added job ${job.id} for project ${project._id}`);

    if (!user.isPro) {
      user.generationCount += 1;
      await user.save();
    }

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

    return res.json({
      jobId: id,
      state: job.status,
      progress: job.progress || 0,
      failedReason: job.error || null
    });
  } catch (error) {
    console.error('Error fetching job status:', error);
    res.status(500).json({ error: 'Failed to fetch job status.' });
  }
};

module.exports = { createProject, getJobStatus };