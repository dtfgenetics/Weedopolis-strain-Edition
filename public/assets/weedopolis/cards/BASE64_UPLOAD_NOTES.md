# Base64 Upload Notes

Binary card images are pushed to GitHub through the Git data API as base64 blobs, then attached to a tree and committed in batches.

This avoids treating PNG/WebP/JPG files as UTF-8 text files.

Batch plan:

1. Metadata and loader files
2. Thumbnails
3. Medium WebP gameplay images
4. Large WebP card images
5. Full PNG master images, if repository size remains acceptable

The game should use medium WebP files by default and reserve PNG masters for admin, print, or modal zoom views.
