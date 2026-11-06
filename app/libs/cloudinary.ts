// libs/cloudinary.ts (front)
export const cloudinaryUrl = (
  publicId?: string,
  size = 200,
  crop: "fill" | "fit" | "face" | "pad" = "fill",
) => {
  const base = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
  const t =
    crop === "face"
      ? `c_thumb,g_face,z_0.7,w_${size},h_${size}`
      : crop === "pad"
        ? `e_trim/c_pad,b_transparent,w_${size},h_${size}`
        : `c_${crop},w_${size},h_${size}`;
  return publicId ? `${base}/${t},f_auto,q_auto/${publicId}` : undefined;
};
