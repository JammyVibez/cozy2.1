<<<<<<< HEAD
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { auth } from "@/auth";
=======
<<<<<<< HEAD
import { ObjectId } from "mongodb";
import { db } from "../../../lib/db";
import { NextResponse } from "next/server";
=======
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import { auth } from "@/auth";
>>>>>>> d035233 (Recovered repo after re-init)
>>>>>>> f337386 (Fix chat messages route params type)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
<<<<<<< HEAD
=======
<<<<<<< HEAD
    const communityId = id;
>>>>>>> f337386 (Fix chat messages route params type)

    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profilePhoto: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    if (!community) {
      return NextResponse.json({ message: "Community not found" }, { status: 404 });
    }

    return NextResponse.json(community);
  } catch (error: any) {
    console.error("Error fetching community:", error);
<<<<<<< HEAD
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
=======
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
=======

    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profilePhoto: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    if (!community) {
      return NextResponse.json({ message: "Community not found" }, { status: 404 });
    }

    return NextResponse.json(community);
  } catch (error: any) {
    console.error("Error fetching community:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
>>>>>>> d035233 (Recovered repo after re-init)
>>>>>>> f337386 (Fix chat messages route params type)
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
<<<<<<< HEAD
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
=======
<<<<<<< HEAD
    const { id } = await params;
    const communityId = id;

    const body = await request.json();

    const updatedCommunity = await db.collection("communities").findOneAndUpdate(
      { _id: new ObjectId(communityId) },
      { $set: body },
      { returnDocument: "after" }
    );

    if (!updatedCommunity) {
      return new Response(JSON.stringify({ message: "Community not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
>>>>>>> f337386 (Fix chat messages route params type)
    }

    const { id } = await params;
    const body = await request.json();

    // Check if user has permission to update community
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: session.user.id,
          communityId: id,
        },
      },
    });

    if (!membership || membership.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can update community' }, { status: 403 });
    }

    const updatedCommunity = await prisma.community.update({
      where: { id },
      data: body,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profilePhoto: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCommunity);
  } catch (error: any) {
    console.error("Error updating community:", error);
<<<<<<< HEAD
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
=======
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
=======
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Check if user has permission to update community
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: session.user.id,
          communityId: id,
        },
      },
    });

    if (!membership || membership.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can update community' }, { status: 403 });
    }

    const updatedCommunity = await prisma.community.update({
      where: { id },
      data: body,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                profilePhoto: true,
              },
            },
          },
        },
        _count: {
          select: {
            members: true,
            posts: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCommunity);
  } catch (error: any) {
    console.error("Error updating community:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
>>>>>>> d035233 (Recovered repo after re-init)
>>>>>>> f337386 (Fix chat messages route params type)
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
<<<<<<< HEAD
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
=======
<<<<<<< HEAD
    const { id } = await params;
    const communityId = id;

    const deletedResult = await db.collection("communities").deleteOne({
      _id: new ObjectId(communityId),
    });

    if (deletedResult.deletedCount === 0) {
      return new Response(JSON.stringify({ message: "Community not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
>>>>>>> f337386 (Fix chat messages route params type)
    }

    const { id } = await params;

    // Check if user has permission to delete community
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: session.user.id,
          communityId: id,
        },
      },
    });

    if (!membership || membership.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can delete community' }, { status: 403 });
    }

    await prisma.community.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Community deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting community:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

<<<<<<< HEAD
=======
// Similar updates should be applied to other dynamic route handlers as needed.
// For example, for a route like /users/[id]/profile
// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ userId: string; profileId: string }> }
// ) {
//   try {
//     const { userId, profileId } = await params;

//     const userProfile = await db.collection("userProfiles").findOne({
//       _id: new ObjectId(profileId),
//       userId: userId, // Assuming you might want to filter by userId as well
//     });

//     if (!userProfile) {
//       return new Response(JSON.stringify({ message: "User profile not found" }), {
//         status: 404,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     return new Response(JSON.stringify(userProfile), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error: any) {
//     console.error("Error fetching user profile:", error);
//     return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();

    // Assuming you are creating a new profile for a user
    const newUserProfile = await db.collection("userProfiles").insertOne({
      ...body,
      userId: userId,
      createdAt: new Date(),
    });

    const insertedProfile = await db.collection("userProfiles").findOne({ _id: newUserProfile.insertedId });

    return new Response(JSON.stringify(insertedProfile), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error creating user profile:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error", error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
=======
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if user has permission to delete community
    const membership = await prisma.communityMember.findUnique({
      where: {
        userId_communityId: {
          userId: session.user.id,
          communityId: id,
        },
      },
    });

    if (!membership || membership.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can delete community' }, { status: 403 });
    }

    await prisma.community.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Community deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting community:", error);
    return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
  }
}

>>>>>>> d035233 (Recovered repo after re-init)
>>>>>>> f337386 (Fix chat messages route params type)
