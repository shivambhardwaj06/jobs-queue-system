import { Worker } from "bullmq";
import redisConnection from "../config/redis.js";
import pool from "../config/db.js";
import { ApiError } from "../utils/apiError.js";

const worker = new Worker(
  "job-queue",
  async (job) => {
    const { jobId } = job.data;

    // 1. Status ko 'processing' set karein
    await pool.query(
      `UPDATE jobs
       SET status = 'processing',
           updated_at = NOW()
       WHERE id = $1`,
      [jobId]
    );

    // 2. Failure test condition
    if (job.name === "fail_test") {
      throw new ApiError("Simulated job failure");
    }

    // 3. Task execution simulation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 4. Status ko 'completed' set karein
    await pool.query(
      `UPDATE jobs
       SET status = 'completed',
           result = $1,
           completed_at = NOW(),
           updated_at = NOW()
       WHERE id = $2`,
      [
        JSON.stringify({ message: "Job processed successfully" }),
        jobId,
      ]
    );

    console.log("Job completed:", job.id);
  },
  {
    connection: redisConnection,
  }
);

worker.on("failed", async (job, error) => {
    if (!job) return;

    console.log("Job failed:", job.id);
    console.log("Reason:", error.message);
    console.log("Attempt:", job.attemptsMade);

    const isFinalFailure =
        job.attemptsMade >= job.opts.attempts;

    try {
        await pool.query(
            `UPDATE jobs
             SET attempts = $1,
                 status = $2,
                 error = $3,
                 updated_at = NOW()
             WHERE id = $4`,
            [
                job.attemptsMade,
                isFinalFailure ? "failed" : "processing",
                error.message,
                job.data.jobId
            ]
        );

        console.log(
            isFinalFailure
                ? "Job permanently failed"
                : "Job will be retried"
        );

    } catch (dbError) {
        console.error(
            "Failed to update job in database:",
            dbError.message
        );
    }
});

export default worker;