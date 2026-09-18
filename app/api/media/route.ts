import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const media = (data || []).map((m: any) => ({
      ...m,
      storage_path: m.r2_key || m.storage_path,
      bucket_name: 'newsroom-media',
      usage_count: 0
    }));

    return NextResponse.json(media);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const alt_text = (formData.get('alt_text') as string) || '';
    const caption = (formData.get('caption') as string) || '';
    const credit = (formData.get('credit') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'newsroom-media';
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const path = `uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${Date.now()}-${cleanFilename}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Upload to Supabase Storage
    const { error: uploadError } = await supabaseServer.storage
      .from(bucketName)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    // 2. Get Public URL
    const { data: publicUrlData } = supabaseServer.storage
      .from(bucketName)
      .getPublicUrl(path);

    const publicUrl = publicUrlData.publicUrl;

    // 3. Insert into media table
    const { data: mediaRow, error: dbError } = await supabaseServer
      .from('media')
      .insert({
        filename: cleanFilename,
        mime_type: file.type,
        file_size: file.size,
        r2_key: path,
        url: publicUrl,
        alt_text,
        caption,
        credit,
        focal_x: 50,
        focal_y: 50
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      ...mediaRow,
      storage_path: path,
      bucket_name: bucketName,
      usage_count: 0
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    const { data: item } = await supabaseServer.from('media').select('*').eq('id', id).maybeSingle();
    if (item && item.r2_key) {
      const bucketName = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || 'newsroom-media';
      await supabaseServer.storage.from(bucketName).remove([item.r2_key]);
    }

    const { error } = await supabaseServer.from('media').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
