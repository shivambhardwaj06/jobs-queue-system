import { asyncHandler } from "../utils/asyncHandler.js";

export const ServerHealth =asyncHandler(async(req,res)=>{
    res.status(200)
})