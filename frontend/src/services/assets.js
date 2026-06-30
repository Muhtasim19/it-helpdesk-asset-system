import api from "./api";

export async function getAssets() {
  const response = await api.get("/assets");
  return response.data;
}

export async function createAsset(assetData) {
  const response = await api.post("/assets", assetData);
  return response.data;
}