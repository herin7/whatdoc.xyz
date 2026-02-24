const { Queue, Worker } = require('bullmq');
const Redis = require('ioredis');
const { runGenerationPipeline } = require('./engine');
const Project = require('../models/Project');

// Use typical Redis connection (could be parsed from ENV)
const connection = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
    maxRetriesPerRequest: null,
});

// Configure BullMQ
const queueName = 'docGenerationQueue';

const docGenerationQueue = new Queue(queueName, { connection });

// Initialize the Worker
// 15 requests per minute = max 1 request every 4 seconds. Let's use 4.5s (4500ms) to be safe.
const worker = new Worker(
    queueName,
    async (job) => {
        const { projectId, repoUrl, commitHash, llmProvider, byokOptions } = job.data;
        const safeLogUrl = repoUrl.replace(/https:\/\/.*@github\.com/, 'https://github.com');
        console.log(`[Worker] Started processing project ${projectId} for repo ${safeLogUrl} @ hash ${commitHash}`);

        try {
            // Save the commitHash we are generating for
            await Project.findByIdAndUpdate(projectId, { commitHash });

            // Execute the heavily restricted RAG/LLM process
            await runGenerationPipeline(projectId, repoUrl, llmProvider, byokOptions);

            console.log(`[Worker] Finished processing project ${projectId}`);
        } catch (error) {
            console.error(`[Worker] Error processing project ${projectId}:`, error);
            throw error; // Let BullMQ handle failure/retries 
        }
    },
    {
        connection,
        concurrency: 1, // Strictly one job at a time globally for this worker
        limiter: {
            max: 1,
            duration: 4500, // 4.5 seconds
        },
    }
);

worker.on('completed', (job) => {
    console.log(`[BullMQ] Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
    console.log(`[BullMQ] Job ${job.id} has failed with ${err.message}`);
});

module.exports = { docGenerationQueue };
