import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'; // Import Supabase client

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get('url');

    if (!imageUrl) {
      return new Response(JSON.stringify({ error: 'Missing image URL parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Use service role key for elevated permissions
    );

    // Extract bucket name and path from the imageUrl
    // Example: https://pdufmdtcuwbedrkzoeko.supabase.co/storage/v1/object/public/bucket-name/path/to/file.jpg
    const urlParts = imageUrl.split('/storage/v1/object/public/');
    if (urlParts.length < 2) {
      return new Response(JSON.stringify({ error: 'Invalid Supabase Storage URL format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const pathParts = urlParts[1].split('/');
    const bucketName = pathParts[0];
    const filePath = pathParts.slice(1).join('/');

    // Download the image using the Supabase client
    const { data: blob, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (downloadError) {
      console.error(`Error downloading image from Supabase Storage: ${downloadError.message}`);
      return new Response(JSON.stringify({ error: `Failed to download image: ${downloadError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!blob) {
      return new Response(JSON.stringify({ error: 'Image not found or empty' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine content type (can be improved by checking blob.type if available or inferring from fileExt)
    const contentType = blob.type || 'application/octet-stream';

    // Return the image blob
    return new Response(blob, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    console.error('Error in image proxy function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});