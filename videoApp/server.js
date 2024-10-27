const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

// הגדרת תיקיית העלאת סרטונים
const upload = multer({ dest: "public/videoUploads/" });

// יצירת קובץ JSON אם הוא לא קיים
if (!fs.existsSync("data.json")) {
    fs.writeFileSync("data.json", JSON.stringify([]));
}

// הגדרת כותרות רשות
app.use((req, res, next) => {
    res.setHeader("Permissions-Policy", "picture-in-picture=(self)");
    next();
});

// נתיב עבור דף הבית
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "index.html"));
});

// נתיב עבור דף האדמין
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "html", "admin.html"));
});

// העלאת סרטון מקומי
app.post("/upload", upload.single("videoFile"), (req, res) => {
    const { title, description, category } = req.body;
    const videoUrl = `/videoUploads/${req.file.filename}`;

    // קריאת קובץ JSON ושמירת פרטי הסרטון
    const videos = JSON.parse(fs.readFileSync("data.json"));
    videos.push({ title, description, category, videoUrl, type: "local" });
    fs.writeFileSync("data.json", JSON.stringify(videos));

    res.send("Video uploaded successfully!");
});

// הוספת סרטון YouTube
app.post("/upload-youtube", (req, res) => {
    const { title, description, category, youtubeUrl } = req.body;

    const videos = JSON.parse(fs.readFileSync("data.json"));
    videos.push({ title, description, category, videoUrl: youtubeUrl, type: "youtube" });
    fs.writeFileSync("data.json", JSON.stringify(videos));

    res.send("YouTube video added successfully!");
});

// החזרת רשימת סרטונים
app.get("/videos", (req, res) => {
    const videos = JSON.parse(fs.readFileSync("data.json"));
    res.json(videos);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
