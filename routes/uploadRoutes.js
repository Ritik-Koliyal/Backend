// const express = require("express");
// const router = express.Router();
// const multer = require("multer");
// const path = require("path");

// // File upload ke liye storage setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "../uploads/"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 1024 * 1024 * 23, // 23 MB limit
//   },
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only .jpeg, .jpg, and .png files are allowed"), false);
//     }
//   },
// });

// // POST route for file upload
// router.post("/uploadFile", upload.single("file"), (req, res) => {
//   res.json({ fileName: req.file.filename });
// });

// // Function to download file
// const downloadFile = (req, res) => {
//   const fileName = req.params.filename;
//   const filePath = path.join(__dirname, "../uploads/", fileName);

//   res.download(filePath, (error) => {
//     if (error) {
//       res.status(500).send({ message: "File cannot be downloaded: " + error });
//     }
//   });
// };

// // GET route for file download
// router.get("/files/:filename", downloadFile);

// module.exports = router;
