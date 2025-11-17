import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_ACCESS_TOKEN || "";

export async function POST(request: NextRequest) {
  try {
    const { imageId } = await request.json();
    console.log("API route called with imageId:", imageId);

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Download image from external API
    const response = await fetch(
      `${API_BASE_URL}/api/v1/files/${imageId}/download`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get("content-type") || "image/png";

    // Determine file extension based on content type
    let extension = "png";
    if (contentType.includes("jpeg") || contentType.includes("jpg")) {
      extension = "jpg";
    } else if (contentType.includes("webp")) {
      extension = "webp";
    } else if (contentType.includes("gif")) {
      extension = "gif";
    }

    // Create public/ai-images directory if it doesn't exist
    const publicDir = path.join(process.cwd(), "public", "ai-images");
    await mkdir(publicDir, { recursive: true });

    // Save image to public/ai-images folder
    const fileName = `${imageId}.${extension}`;
    const filePath = path.join(publicDir, fileName);
    await writeFile(filePath, Buffer.from(imageBuffer));
    console.log("Saved image to:", filePath);

    // Return the public URL
    const publicUrl = `/ai-images/${fileName}`;
    console.log("Returning public URL:", publicUrl);

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Error downloading image:", error);
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 }
    );
  }
}
