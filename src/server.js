import app from "./app.js";
import pool from "./config/db.js";

app.listen(process.env.PORT || 8000,()=>{
    console.log(`server is running at http://localhost:${process.env.PORT}`)
})


pool.query("SELECT NOW()")
    .then((result) => {
        console.log("PostgreSQL connected:", result.rows[0]);
    })
    .catch((error) => {
        console.error("PostgreSQL connection failed:", error);
    });