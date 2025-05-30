import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect"; 
import Course from "@/app/models/Course"; 
import Publisher from "@/app/models/Publisher";
import { auth } from "../../../../auth";

export async function POST(req: Request) {
  const session = await auth();
  try {
    await connectDB();

    // calculating the last entered course id in continuation with saveCardTemplate;

    const data = await req.json();

    const courseId = await data["courseId"];
    const tags = data["tags"];
    const prerequisite = data["prerequisite"];
    const requirement = data["requirement"];
    const subPoints = data["subPoints"];
    const category = data["category"];
    const longDescription = data["longDescription"];
    const courseHeading = data["courseHeading"];
    const level = data["level"];
    const certificateProvider = data["certificateProvider"];
    const lifetimeAccess = data["lifetimeAccess"];
    const subtitles = data["subtitles"];
    const subtitlesLanguage = data["subtitlesLanguage"];
    const demo = data["demo"];
    const syllabus = data["syllabus"];
    const publisherName = data["publisherName"];
    const publisherBio = data["publisherBio"];
    const publisherDescription = data["publisherDescription"];
    const publisherProfileImage = data["publisherProfileImage"]; // Now expecting URL directly
    const numberOfAssignments = data["numberOfAssignments"];
    const numberOfVideoLectures = data["numberOfVideoLectures"];

    let publisher = await Publisher.findOne({ email: session?.user?.email });    

    if (publisher) {
      // Update the publisher's coursesPublished
      publisher.coursesPublished.publishedCourses.push(courseId);
      publisher.coursesPublished.totalPublishedCourses += 1;
      await publisher.save();
    } else {
      
      publisher = new Publisher({
        name: publisherName,
        email: session?.user?.email,
        bio: publisherBio,
        description: publisherDescription,
        coursesPublished: {
          publishedCourses: [courseId],
          totalPublishedCourses: 1,
        },
        studentsTaught: 0,
        image: publisherProfileImage,
      });
      await publisher.save();
    }

    const course = await Course.findOneAndUpdate(
      { courseId: courseId },
      {
        category: category,
        level: level,
        courseHeading: courseHeading,
        certificate: certificateProvider,
        lifeTimeAccess: lifetimeAccess,
        authors: [
          {
            name: publisherName,
            bio: publisherBio,
            description: publisherDescription,
            profileImage: publisherProfileImage,
          },
        ],
        largeDescription: {
          intro: longDescription,
          subPoints: subPoints || [],
        },
        requirements: requirement || [],
        prerequisites: prerequisite || [],
        subtitles: [
          {
            available: subtitles,
            language: subtitles ? subtitlesLanguage : "",
          },
        ],
        totalAssignments: numberOfAssignments || 0,
        totalVideoLectures: numberOfVideoLectures || 0,
        tags: tags || [],
        syllabus: syllabus,
        mediaContent: [
          {
            type: "video",
            url: demo,
          },
        ],
        ratings: {
          average: 0,
          totalRatings: 0,
        },
        lastUpdated: new Date(),
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ message: "Course created successfully", course: course }, { status: 201 });
  } catch (error) {
    console.log("Error creating course:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const session = await auth();
  try {
    await connectDB();

    const data = await req.json();
    const courseId = data["courseId"]; 

    if (!courseId) {
      return NextResponse.json({ error: "Course ID is required for updates" }, { status: 400 });
    }

    const tags = data["tags"];
    const prerequisite = data["prerequisite"];
    const requirement = data["requirement"];
    const subPoints = data["subPoints"];
    const category = data["category"];
    const longDescription = data["longDescription"];
    const courseHeading = data["courseHeading"];
    const level = data["level"];
    const certificateProvider = data["certificateProvider"];
    const lifetimeAccess = data["lifetimeAccess"];
    const subtitles = data["subtitles"];
    const subtitlesLanguage = data["subtitlesLanguage"];
    const demo = data["demo"];
    const syllabus = data["syllabus"];
    const publisherName = data["publisherName"];
    const publisherBio = data["publisherBio"];
    const publisherDescription = data["publisherDescription"];
    const publisherProfileImage = data["publisherProfileImage"];
    const numberOfAssignments = data["numberOfAssignments"];
    const numberOfVideoLectures = data["numberOfVideoLectures"];

    // Check if course exists
    const existingCourse = await Course.findOne({ courseId: courseId });
    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Update publisher if needed
    const publisher = await Publisher.findOne({ email: session?.user?.email });
    if (publisher) {
      // Update publisher details
      publisher.name = publisherName || publisher.name;
      publisher.bio = publisherBio || publisher.bio;
      publisher.description = publisherDescription || publisher.description;
      publisher.image = publisherProfileImage || publisher.image;
      await publisher.save();
    }

    const updatedCourse = await Course.findOneAndUpdate(
      { courseId: courseId },
      {
        category: category,
        level: level,
        courseHeading: courseHeading,
        certificate: certificateProvider,
        lifeTimeAccess: lifetimeAccess,
        authors: [
          {
            name: publisherName,
            bio: publisherBio,
            description: publisherDescription,
            profileImage: publisherProfileImage,
          },
        ],
        largeDescription: {
          intro: longDescription,
          subPoints: subPoints || [],
        },
        requirements: requirement || [],
        prerequisites: prerequisite || [],
        subtitles: [
          {
            available: subtitles,
            language: subtitles ? subtitlesLanguage : "",
          },
        ],
        totalAssignments: numberOfAssignments || 0,
        totalVideoLectures: numberOfVideoLectures || 0,
        tags: tags || [],
        syllabus: syllabus,
        mediaContent: [
          {
            type: "video",
            url: demo,
          },
        ],
        lastUpdated: new Date(),
      },
      { new: true }
    );

    return NextResponse.json({ message: "Course updated successfully", course: updatedCourse }, { status: 200 });
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}