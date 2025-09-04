import 'server-only';
/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
ABOUT THIS NODE.JS EXAMPLE: This example works with the AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/ses-examples.html.

Purpose:
sesClient.js is a helper function that creates an Amazon Simple Email Services (Amazon SES) service client.

*/
// snippet-start:[ses.JavaScript.createclientv3]
import { SESClient } from '@aws-sdk/client-ses';

// Create SES service object only if credentials are properly configured
const sesClient = (() => {
  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.SES_ACCESS_KEY_ID;
  const secretAccessKey = process.env.SES_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey || 
      region === 'placeholder' || accessKeyId === 'placeholder' || secretAccessKey === 'placeholder') {
    console.warn('SES credentials not properly configured. Email functionality will be disabled.');
    return null;
  }

  try {
    return new SESClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  } catch (error) {
    console.warn('Failed to initialize SES client:', error);
    return null;
  }
})();

export { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
