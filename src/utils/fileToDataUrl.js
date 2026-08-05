// Thin FileReader wrapper — used by the dashboard's image-upload field and per-download
// row "Upload file" button. Base64 data-URIs are stored directly in Mongo as plain
// strings (see server/src/models/Project.js); no server upload endpoint or object
// storage exists for this app, which is fine at personal-portfolio scale.
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
