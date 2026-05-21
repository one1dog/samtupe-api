const express = require("express");
const { exec } = require("child_process");

const app = express();

app.get("/", (req, res) => {

  res.send("SamTupe API Running");

});

app.get("/info", (req, res) => {

  const videoUrl = req.query.url;

  if (!videoUrl) {

    return res.json({
      status: false,
      message: "ضع رابط الفيديو"
    });

  }

  exec(`yt-dlp -j "${videoUrl}"`, (error, stdout, stderr) => {

    if (error) {

      return res.json({
        status: false,
        message: "فشل استخراج الفيديو"
      });

    }

    try {

      const data = JSON.parse(stdout);

      const formats = [];

      data.formats.forEach((f) => {

        if (f.url && f.ext) {

          formats.push({
            quality: f.format_note || "unknown",
            ext: f.ext,
            url: f.url
          });

        }

      });

      res.json({
        status: true,
        title: data.title,
        thumbnail: data.thumbnail,
        duration: data.duration,
        uploader: data.uploader,
        formats: formats
      });

    } catch(e) {

      res.json({
        status: false,
        message: "خطأ أثناء التحليل"
      });

    }

  });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Server Started");

});
