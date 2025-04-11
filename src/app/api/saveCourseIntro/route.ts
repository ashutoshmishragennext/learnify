import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect"; 
import Course from "@/app/models/Course"; 
import cloudinary from "@/lib/cloudinary";
import Publisher from "@/app/models/Publisher";
import { auth } from "../../../../auth";

export async function POST(req: Request) {
  const session = await auth();
  try {
    await connectDB();

    // calculating the last entered course id in continuation with saveCardTemplate;
    const courseId: number = await Course.countDocuments();

    const data = await req.json();

    const TagsArray = data["TagsArray"];
    const PrerequisiteArray = data["PrerequisiteArray"];
    const RequirementArray = data["RequirementArray"];
    const SubPointsArray = data["SubPointsArray"];
    const Category = data["Category"];
    const LargeDescription = data["Long Description"];
    const CourseHeading = data["Course Heading"];
    const SelectLevel = data["Select Level"];
    const CertificateProvider = data["Certificate Provider"];
    const LifetimeAccess = data["Lifetime Access"];
    const Subtitles = data["Subtitles"];
    const SubtitlesLanguage = data["Subtitles Language"];
    const Demo = data["Demo"];
    const Syllabus = data["Syllabus"];
    const PublisherName = data["Publisher Name"];
    const PublisherBio = data["Publisher Bio"];
    const PublisherDescription = data["Publisher Description"];
    const file = data["Publisher Profile Image"];
    const NoOfAssignment = data["No. of Assignment"];
    const NoOfVideoLectures = data["No. of Video Lectures"];

    const uploadResponse = await cloudinary.uploader.upload(file);
    const imageUrl = uploadResponse.secure_url;

    // console.log("Subtitles value: ", Subtitles);
    // console.log("Subtiles Language: ", SubtitlesLanguage);

    let publisher = await Publisher.findOne({ email: session?.user?.email });

    if (publisher) {
      // Update the publisher's coursesPublished
      publisher.coursesPublished.publishedCourses.push(courseId);
      publisher.coursesPublished.totalPublishedCourses += 1;
      await publisher.save();
    } else {
      // Create a new publisher
      publisher = new Publisher({
        name: PublisherName,
        email: session?.user?.email,
        bio: PublisherBio,
        description: PublisherDescription,
        coursesPublished: {
          publishedCourses: [courseId],
          totalPublishedCourses: 1,
        },
        studentsTaught: 0,
        image: imageUrl,
      });
      await publisher.save();
    }

    const course = await Course.findOneAndUpdate(
      { courseId: courseId },
      {
        category: Category,
        level: SelectLevel,
        courseHeading: CourseHeading,
        certificate: CertificateProvider,
        lifeTimeAccess: LifetimeAccess,
        authors: [
          {
            name: PublisherName,
            bio: PublisherBio,
            description: PublisherDescription,
            profileImage: imageUrl,
          },
        ],
        largeDescription: {
          intro: LargeDescription,
          subPoints: SubPointsArray || [],
        },
        requirements: RequirementArray || [],
        prerequisites: PrerequisiteArray || [],
        subtitles: [
          {
            available: Subtitles,
            language: Subtitles === "yes" ? SubtitlesLanguage : "",
          },
        ],
        totalAssignments: NoOfAssignment || 0,
        totalVideoLectures: NoOfVideoLectures || 0,
        tags: TagsArray || [],
        syllabus: Syllabus,
        mediaContent: [
          {
            type: "video",
            url: Demo,
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

    return NextResponse.json({ message: "Course details updated successfully", course: course }, { status: 201 });
  } catch (error) {
    console.error("Error saving course:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}