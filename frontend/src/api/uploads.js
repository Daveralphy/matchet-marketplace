const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export function fileToDataUrl(file) {
  if (!(file instanceof File)) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read the selected file."));
    reader.readAsDataURL(file);
  });
}

export async function uploadFiles(files, folder) {
  const selected = (Array.isArray(files) ? files : [files]).filter((file) => file instanceof File);
  if (!selected.length) return [];

  const uploaded = [];
  for (const file of selected) {
    const dataUrl = await fileToDataUrl(file);
    const response = await fetch(`${API_BASE_URL}/api/uploads`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files: [{ name: file.name, folder, dataUrl }] }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(payload.message || "Unable to upload your file.");
      error.status = response.status;
      throw error;
    }
    uploaded.push(...(payload.files || []));
  }
  return uploaded;
}

export async function uploadFile(file, folder) {
  const [uploaded] = await uploadFiles([file], folder);
  return uploaded || null;
}

export async function deleteUploadedFile(asset) {
  if (!asset?.publicId) return;
  const response = await fetch(`${API_BASE_URL}/api/uploads`, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      publicId: asset.publicId,
      resourceType: asset.resourceType || "image",
      accessType: asset.type || "upload",
    }),
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Unable to remove the uploaded file.");
  }
}
