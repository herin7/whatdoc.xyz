const { runGenerationPipeline } = require('./engine');
const Project = require('../models/Project');

// In-memory job tracking (replaces Redis/BullMQ)
const jobs = new Map();
let jobCounter = 0;

const docGenerationQueue = {
    async add(_name, data, _opts) {
        const jobId = String(++jobCounter);
        const job = { id: jobId, data, status: 'active', progress: 0 };
        jobs.set(jobId, job);

        // Run generation async (fire-and-forget)
        (async () => {
            const { projectId, repoUrl, commitHash, llmProvider, byokOptions } = data;
            const safeLogUrl = repoUrl.replace(/https:\/\/.*@github\.com/, 'https://github.com');
            console.log(`[Queue] Started processing project ${projectId} for repo ${safeLogUrl} @ hash ${commitHash}`);

            try {
                await Project.findByIdAndUpdate(projectId, { commitHash });
                await runGenerationPipeline(projectId, repoUrl, llmProvider, byokOptions);
                job.status = 'completed';
                console.log(`[Queue] Finished processing project ${projectId}`);
            } catch (error) {
                job.status = 'failed';
                job.error = error.message;
                console.error(`[Queue] Error processing project ${projectId}:`, error);
            }
        })();

        return job;
    },

    async getJob(jobId) {
        return jobs.get(jobId) || null;
    },
};

module.exports = { docGenerationQueue };
