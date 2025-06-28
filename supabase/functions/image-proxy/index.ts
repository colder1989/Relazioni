import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Expose-Headers': 'Content-Length, Content-Type, ETag',
};

serve(async (req) => {
  console.log('Edge Function: Request received', req.method, req.url);

  if (req.method === 'OPTIONS') {
    console.log('Edge Function: Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const imageUrl = url.searchParams.get('url');
    console.log('Edge Function: Extracted imageUrl from query params:', imageUrl);

    if (!imageUrl) {
      console.error('Edge Function: Missing image URL parameter');
      return new Response(JSON.stringify({ error: 'Missing image URL parameter' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- IMPORTANT: Logging the secret value for debugging ---
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    console.log(`Edge Function: SUPABASE_SERVICE_ROLE_KEY status: ${serviceRoleKey ? 'FOUND' : 'NOT FOUND'}`);
    if (serviceRoleKey) {
      console.log(`Edge Function: SUPABASE_SERVICE_ROLE_KEY (first 10 chars): ${serviceRoleKey.substring(0, 10)}...`);
    }
    // --- End of logging ---

    if (!serviceRoleKey) {
      console.error('Edge Function: SUPABASE_SERVICE_ROLE_KEY not found in environment. Cannot access private buckets.');
      return new Response(JSON.stringify({ error: 'SUPABASE_SERVICE_ROLE_KEY not found in environment. Ensure it is set as a secret for this Edge Function.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      serviceRoleKey,
      {
        global: {
          headers: {
            Authorization: `Bearer ${serviceRoleKey}`,
          },
        },
      }
    );
    console.log('Edge Function: Supabase client created with service role key.');

    const urlParts = imageUrl.split('/storage/v1/object/public/');
    if (urlParts.length < 2) {
      console.error('Edge Function: Invalid Supabase Storage URL format:', imageUrl);
      return new Response(JSON.stringify({ error: 'Invalid Supabase Storage URL format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const bucketName = urlParts[1].split('/')[0];
    const filePath = urlParts[1].substring(bucketName.length + 1);
    console.log(`Edge Function: Extracted bucketName: ${bucketName}, filePath: ${filePath}`);

    const { data: blob, error: downloadError } = await supabase.storage
      .from(bucketName)
      .download(filePath);

    if (downloadError) {
      console.error(`Edge Function: Error downloading image from Supabase Storage: ${downloadError.message}`);
      return new Response(JSON.stringify({ error: `Failed to download image: ${downloadError.message}` }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!blob) {
      console.error('Edge Function: Image not found or empty blob received.');
      return new Response(JSON.stringify({ error: 'Image not found or empty' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const contentType = blob.type || 'application/octet-stream';
    console.log(`Edge Function: Image downloaded successfully. Content-Type: ${contentType}`);

    return new Response(blob, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
      },
    });
  } catch (error: any) {
    console.error('Edge Function: Uncaught error in image proxy function:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});