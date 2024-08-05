const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Single image upload related code for multer ...
function singleFileUpload(uploadPath, allowedMimes, fileSize, name) {
  // Ensure the upload path exists or create it
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "-").toLowerCase());
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error("Invalid file type.");
      error.httpStatusCode = 422;
      error.errorMessage = "Invalid file type.";
      return cb(error);
    }
  };

  return multer({
    storage: storage,
    limits: {
      fileSize: fileSize,
    },
    fileFilter: fileFilter,
  }).single(name);
}

// Multi images upload related code for multer ...
function multiFileUpload(uploadPath, allowedMimes, fileSize, name) {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "-").toLowerCase());
    },
  });

  const fileFilter = (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error("Invalid file type.");
      error.httpStatusCode = 422;
      error.errorMessage = "Invalid file type.";
      return cb(error);
    }
  };

  return multer({
    storage: storage,
    limits: {
      fileSize: fileSize,
    },
    fileFilter: fileFilter,
  }).array(name);
}

function multiDiffFileUpload(uploadPath, fieldConfigurations) {
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "-").toLowerCase());
    },
  });

  const uploadFields = fieldConfigurations.map((fieldConfig) => {
    return {
      name: fieldConfig.name,
      maxCount: fieldConfig.maxCount,
    };
  });

  const fileFilter = (req, file, cb) => {
    const allowedMimes = fieldConfigurations.find((config) => config.name === file.fieldname).allowedMimes;
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error("Invalid file type.");
      error.httpStatusCode = 422;
      error.errorMessage = "Invalid file type.";
      return cb(error);
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields(uploadFields);
}

const multiDiffFileAndPathUpload = (fieldConfigurations) => {
  const baseUploadsPath = path.join(__dirname, "../public"); // Default base path

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const fieldConfig = fieldConfigurations.find((config) => config.name === file.fieldname);
      if (fieldConfig) {
        const dirPath = path.join(baseUploadsPath, fieldConfig.path); // Concatenate base path with specified path

        // Ensure the directory exists or create it
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true });
        }

        cb(null, dirPath); // Set the destination path for file uploads based on field configuration
      } else {
        const error = new Error("No path specified for this field");
        error.httpStatusCode = 400;
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "-").toLowerCase());
    },
  });

  const uploadFields = fieldConfigurations.map((fieldConfig) => ({
    name: fieldConfig.name,
    maxCount: fieldConfig.maxCount,
  }));

  const fileFilter = (req, file, cb) => {
    const allowedMimes = fieldConfigurations.find((config) => config.name === file.fieldname)?.allowedMimes;
    if (!allowedMimes || allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error("Invalid file type");
      error.httpStatusCode = 422;
      error.errorMessage = "Invalid file type";
      cb(error);
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields(uploadFields);
};

module.exports = { singleFileUpload, multiFileUpload, multiDiffFileUpload, multiDiffFileAndPathUpload };
