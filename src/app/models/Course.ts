import mongoose, { Schema, Document } from 'mongoose';

// Interfaces for nested objects
interface IAuthor {
  name: string;
  bio: string;
  description: string;
  profileImage: string;
}

interface ILargeDescription {
  intro: string;
  subPoints: string[];
}

interface IPrice {
  current: number;
  original: number;
  discountPercentage: number;
}

interface ISubmodule {
  sModuleNumber: number;
  sModuleTitle: string;
  sModuleDuration: number;
  videoLecture: string;
}

interface IModule {
  moduleNumber: number;
  moduleTitle: string;
  moduleDuration: number;
  subModulePart: number;
  reward: number;
  subModules: ISubmodule;
}

interface IRating {
  average: number;
  totalRatings: number;
}

interface IReview {
  user: string;
  comment: string;
  rating: number;
}

interface IReward {
  totalReward: number;
  moduleRewards: number[];
}

interface IMediaContent {
  type: string;
  url: string;
}

interface ISubtitles {
  available: string;
  language: string ;
}

// Main interface for the Course document
export interface ICourse extends Document {
  courseId: number;
  name: string;
  image: string;
  courseHeading: string;
  studentsEnrolled?: number;
  shortDescription?: string;
  authors: IAuthor[];
  largeDescription: ILargeDescription;
  price: IPrice;
  duration: number;
  modules: IModule[];
  requirements?: string[];
  prerequisites?: string[];
  ratings: IRating;
  reviews: IReview[];
  rewards: IReward;
  category: string;
  certificate: string;
  lifeTimeAccess: string;
  level: string;
  subtitles: ISubtitles[];
  totalAssignments: number;
  totalVideoLectures: number;
  tags: string[];
  syllabus: string;
  lastUpdated: Date;
  mediaContent: IMediaContent[];
  progress: number;
}

// Schema definitions for nested objects
const AuthorSchema: Schema = new Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  description: {type: String, required: true},
  profileImage: { type: String, required: true },
});

const LargeDescriptionSchema: Schema = new Schema({
  intro: { type: String,  },
  subPoints: { type: [String], },
});

const RewardsSchema: Schema = new Schema({
  totalReward: { type: Number, default: 0 },
  moduleRewards: { type: [Number], default: [] }
});


const PriceSchema: Schema = new Schema({
  current: { type: Number, },
  original: { type: Number, },
  discountPercentage: { type: Number, default: 0 },
});

const SubmoduleSchema: Schema = new Schema({
  sModuleNumber: Number,
  sModuleTitle: String,
  sModuleDuration: Number,
  videoLecture: String,
})

const ModuleSchema: Schema = new Schema({
  moduleNumber: { type: Number,  },
  moduleTitle: { type: String, },
  moduleDuration: { type: Number,  },
  subModulePart: {type: Number},
  reward: { type: Number, },
  subModules: [SubmoduleSchema]
});

const RatingSchema: Schema = new Schema({
  average: { type: Number, default: 0 },
  totalRatings: { type: Number,  default: 0},
});

const ReviewSchema: Schema = new Schema({
  user: { type: String,},
  comment: { type: String,  },
  rating: { type: Number, },
});

const MediaContentSchema: Schema = new Schema({
  type: { type: String, },
  url: { type: String, },
});

const SubtitleSchema : Schema = new Schema({
  available: {type: String,},
  language: {type: String, }
})

// Main Course schema
export const CourseSchema: Schema = new Schema({
  courseId: { type: Number, unique: true },
  name: { type: String, },
  image: { type: String, },
  courseHeading: {type: String},
  studentsEnrolled: { type: Number, default: 0 },
  shortDescription: { type: String,  },
  authors: { type: [AuthorSchema], },
  largeDescription: { type: LargeDescriptionSchema, },
  price: { type: PriceSchema,  },
  duration: { type: Number,  },
  modules: { type: [ModuleSchema], },
  requirements: { type: [String], default: []  },
  prerequisites: { type: [String], default: []},
  ratings: { type: RatingSchema,  },
  reviews: { type: [ReviewSchema], default: [] },
  rewards: { type: RewardsSchema, },
  category: { type: String,},
  certificate: {type: String, required: false},
  lifeTimeAccess: {type: String, required: false},
  level: {type: String, required: false},
  subtitles: {type: [SubtitleSchema], required: false},
  totalAssignments: {type: Number, required: false},
  totalVideoLectures: {type: Number, required: false},
  tags: { type: [String],  },
  syllabus: {type: String},
  lastUpdated: { type: Date, default: Date.now },
  mediaContent: { type: [MediaContentSchema], default: [] },
});


// Export the model
export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);