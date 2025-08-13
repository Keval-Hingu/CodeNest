import { createUploadthing } from "uploadthing/express";

const f = createUploadthing();

// Define your File Router
export const ourFileRouter = f({
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 }
  })
    // The middleware now receives the user data from uploadRoutes.js
    .middleware(async ({ req, res, user }) => {
        // You can now directly use the 'user' object for authorization
        if (!user) {
            throw new Error("Unauthorized");
        }
        
        // This is what will be available in onUploadComplete
        return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
        // You can use metadata.userId here
        console.log("Upload complete for userId:", metadata.userId);
        console.log("File URL:", file.url);
    }),

  pdfUploader: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 }
  })
    .middleware(async ({ req, res, user }) => {
        if (!user) {
            throw new Error("Unauthorized");
        }
        return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
        console.log("PDF upload complete for userId:", metadata.userId);
        console.log("File URL:", file.url);
    }),
});