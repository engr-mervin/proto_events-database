import { NextRequest, NextResponse } from "next/server";
import supabase from "../../../../supabase/initialize";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const id = uuidv4();
  const image = body.get("image") as Blob;
  const metadata = {
    id,
    description: body.get("description"),
  };

  const { error } = await supabase.from("events").insert(metadata);

  if (error) {
    return NextResponse.json({
      message: "failed to upload metadata to database",
      status: 500,
    });
  }
  const upload = await supabase.storage.from("test").upload(`${id}`, image);

  if (upload.error) {
    return NextResponse.json({
      message: "failed to upload file",
      status: 500,
    });
  }

  return NextResponse.json({
    message: "ok",
    status: 200,
  });
}

export async function GET() {
  let metadata = await supabase.from("events").select();

  if (metadata.error) {
    return NextResponse.json({
      message: "Failed to get metadata from database",
      status: 500,
    });
  }

  for (let i = 0; i < metadata.data.length; i++) {
    const file = await supabase.storage
      .from("test")
      .download(metadata.data[i].id);

    if (file.error) {
      return NextResponse.json({
        message: "Failed to retrieve image from bucket",
        status: 500,
      });
    }
    const buffer: Buffer = await file.data.arrayBuffer();

    metadata.data[i].image = buffer;
  }

  console.log(metadata.data);
  return NextResponse.json({ message: "ok", status: 200, data: metadata.data });
}
