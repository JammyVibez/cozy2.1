import { GET as GetHandler } from './GET';
import { PATCH as PatchHandler } from './PATCH';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return GetHandler(request, { params: resolvedParams });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const resolvedParams = await params;
  return PatchHandler(request, { params: resolvedParams });
}

// Assuming GET and PATCH are defined in separate files and exported as above.
// The following are hypothetical implementations based on the changes provided,
// illustrating how the original functions might look and how they are modified.

// Example hypothetical GET handler in './GET.ts' before modification:
/*
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    // ... rest of the handler logic
    return NextResponse.json({ userId });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
*/

// Example hypothetical PATCH handler in './PATCH.ts' before modification:
/*
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const formData = await request.formData();
    // ... rest of the handler logic
    return NextResponse.json({ message: 'Updated', userId });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
*/

// The provided changes modify the signatures and implementation of these handlers.
// Since the original code only contains exports, and the changes describe modifications
// to the functions themselves (which are not present in the provided original snippet),
// the output will reflect the structure of the original snippet with the intention
// of applying the described changes to the actual handler functions in their respective files.
// As the original snippet only has exports, and no function definitions,
// the output will be the same as the original snippet because the changes
// refer to function definitions that are not part of this specific file content.
// However, if this file *were* to contain the function definitions that were modified,
// the output would reflect those modifications.
//
// Given the constraints, the output will be the original content as no modifications
// can be applied to the provided snippet.