import pool from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { jobQueue } from "../queues/job.queue.js";

export const createJob = asyncHandler( async (req, res) => {
    try {
        const {
            type,
            payload,
            priority,
            maxAttempts
        } = req.body;

        // type is required field
        if (!type) {
            return res.status(400).json({
                success: false,
                message: "Job type is required",
            });
        }

        const result = await pool.query(
            `INSERT INTO jobs
            (type, payload, priority, max_attempts)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                type,
                payload || {},
                priority ?? 0,
                maxAttempts ?? 3,
            ]
        );
        const job = result.rows[0];
await jobQueue.add(
    job.type,
    {
        jobId: job.id,
        type: job.type,
        payload: job.payload
    },
    {
        attempts: job.max_attempts,
        backoff: {
            type: "exponential",
            delay: 2000
        }
    }
);

        return res.status(201).json({
            success: true,
            message: "Job created and added to queue",
            job: result.rows[0],
        });

    } catch (error) {
        console.error("Create job error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create job",
        });
    }
});


export const getJobById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const result = await pool.query(
        `SELECT
            id,
            type,
            payload,
            status,
            priority,
            attempts,
            max_attempts,
            result,
            error,
            created_at,
            updated_at,
            completed_at
         FROM jobs
         WHERE id = $1`,
        [id]
    );

    if (result.rows.length === 0) {
        return res.status(404).json({
            success: false,
            message: "Job not found"
        });
    }

    return res.status(200).json({
        success: true,
        job: result.rows[0]
    });
});