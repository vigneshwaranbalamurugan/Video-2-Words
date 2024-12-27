import multer from "multer";

// Multer configuration for file uploads
const upload = multer({ dest: "uploads/" });

export default upload;