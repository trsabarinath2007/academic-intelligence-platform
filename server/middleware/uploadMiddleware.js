const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(
  __dirname,
  "../uploads"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename =
      `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extension}`;

    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".pdf",
    ".doc",
    ".docx",
    ".ppt",
    ".pptx",
    ".txt",
    ".jpg",
    ".jpeg",
    ".png",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (allowedTypes.includes(extension)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only PDF, DOC, DOCX, PPT, PPTX, TXT, JPG, JPEG and PNG files are allowed"
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = upload;