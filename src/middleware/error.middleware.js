import app from "../app";
app.use((err, req, res, next) => {
    console.log("ERROR MIDDLEWARE:", err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong"
    });
});