import { handleBlobUpload, type HandleBlobUploadBody } from '@vercel/blob';

export const runtime = 'edge';

/**
 * https://vercel.com/docs/storage/vercel-blob
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleBlobUploadBody;

  try {
    const res = await handleBlobUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Generate a client token for the browser to upload the file

        // ⚠️ Authenticate users before reaching this point.
        // Otherwise, you're allowing anonymous uploads.
        // const { user, userCanUpload } = await auth(request, pathname);
        // if (!userCanUpload) {
        //   throw new Error('not authenticated or bad pathname');
        // }

        console.log('pathname', pathname);

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
          metadata: JSON.stringify({
            // optional, sent to your server on upload completion
            // userId: user.id,
            userId: 'user.foobar',
          }),
        };
      },
      onUploadCompleted: async ({ blob, metadata }) => {
        // Get notified of browser upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        console.log('blob upload completed', blob, metadata);

        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(metadata);
          // await db.update({ avatar: blob.url, userId });
        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });

    // return NextResponse.json(jsonResponse);
    console.log('POST', res);

    return Response.json(res);
  } catch (error) {
    const res = { error: (error as Error).message };
    console.log('error', res);
    return new Response(JSON.stringify(res), {
      headers: { 'Content-Type': 'application/json' },
      status: 400, // The webhook will retry 5 times waiting for a 200
    });

    // return NextResponse.json(
    //   { error: (error as Error).message },
    //   { status: 400 }, // The webhook will retry 5 times waiting for a 200
    // );
  }
}
