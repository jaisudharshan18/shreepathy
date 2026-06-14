export async function uploadFile(bucket, file, pathPrefix) {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${pathPrefix}/${Date.now()}-${sanitizedName}`;
  console.warn("Storage upload bypassed (static site mode). Returning mock URL.");
  return `/mock-storage/${bucket}/${key}`;
}
export async function deleteFile(bucket, publicUrl) {
  console.warn("Storage delete bypassed (static site mode).");
}
