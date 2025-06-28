import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

    // Fetch the image from the original URL
    const imageResponse = await fetch(imageUrl);

    if (!imageResponse.ok) {
      console.error(`Failed to fetch image from ${imageUrl}: ${imageResponse.statusText}`);
      return new Response(JSON.stringify({ error: `Failed to fetch image: ${imageResponse.statusText}` }), {
        status: imageResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get content type from the original response
    const contentType = imageResponse.headers.get('Content-Type') || 'application/octet-stream';

    // Return the image with appropriate headers
    return new Response(imageResponse.body, {
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