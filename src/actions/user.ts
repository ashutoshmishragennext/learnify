import User, { UserRole } from "@/app/models/User";
import bcrypt from "bcryptjs";

interface UserData {
  email: string;
  name: string;
  password: string;
  phone?: number;
  role: UserRole;
}

export async function createUser(data: UserData) {
  try {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new User({
      email: data.email,
      name: data.name,
      password: hashedPassword,
      phone: data.phone,
      role: data.role,
      verified: false,
    });

    await user.save();
    return user;
  } catch (error) {
    console.error(`Error creating user with data: ${JSON.stringify(data)}`, error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    await User.findByIdAndDelete(id);
  } catch (error) {
    console.error(`Error deleting user with id: ${id}`, error);
    throw error;
  }
}

export async function findUserById(id: string) {
  try {
    return await User.findById(id);
  } catch (error) {
    console.error(`Error finding user by id: ${id}`, error);
    throw error;
  }
}

export async function findUserByEmail(email: string) {
  try {
    return await User.findOne({ email }).select("+password +role");
  } catch (error) {
    console.error(`Error finding user by email: ${email}`, error);
    throw error;
  }
}


export async function markUserEmailVerified(userId: string) {
  try {
    await User.findByIdAndUpdate(userId, {
      verified: true,
      $unset: { otp: 1 }  // Remove OTP after verification
    });
  } catch (error) {
    console.error(`Error marking user verified with id: ${userId}`, error);
    throw error;
  }
}

// Additional functions based on your schema

export async function findUserByOAuth(provider: 'github' | 'google', id: string) {
  try {
    if (provider === 'github') {
      return await User.findOne({ githubId: id });
    } else {
      return await User.findOne({ googleId: id });
    }
  } catch (error) {
    console.error(`Error finding user by ${provider} id: ${id}`, error);
    throw error;
  }
}

export async function updateUserOtp(userId: string, otp: number) {
  try {
    await User.findByIdAndUpdate(userId, { 
      otp,
      lastActiveAt: new Date()
    });
  } catch (error) {
    console.error(`Error updating OTP for user: ${userId}`, error);
    throw error;
  }
}

export async function setResetToken(email: string, resetToken: string, resetTokenExpiry: Date) {
  try {
    await User.findOneAndUpdate(
      { email }, 
      { resetToken, resetTokenExpiry }
    );
  } catch (error) {
    console.error(`Error setting reset token for user with email: ${email}`, error);
    throw error;
  }
}

// Course management functions
// export async function addCourseToUser(userId: string, courseId: number) {
//   try {
//     await User.findByIdAndUpdate(
//       userId,
//       { $addToSet: { coursesBought: courseId } }
//     );
//   } catch (error) {
//     console.error(`Error adding course ${courseId} to user ${userId}`, error);
//     throw error;
//   }
// }

// export async function addToCart(userId: string, courseId: number) {
//   try {
//     await User.findByIdAndUpdate(
//       userId,
//       { $addToSet: { cart: courseId } }
//     );
//   } catch (error) {
//     console.error(`Error adding course ${courseId} to cart for user ${userId}`, error);
//     throw error;
//   }
// }

// export async function addToWishlist(userId: string, courseId: number) {
//   try {
//     await User.findByIdAndUpdate(
//       userId,
//       { $addToSet: { wishlist: courseId } }
//     );
//   } catch (error) {
//     console.error(`Error adding course ${courseId} to wishlist for user ${userId}`, error);
//     throw error;
//   }
// }

// export async function removeFromCart(userId: string, courseId: number) {
//   try {
//     await User.findByIdAndUpdate(
//       userId,
//       { $pull: { cart: courseId } }
//     );
//   } catch (error) {
//     console.error(`Error removing course ${courseId} from cart for user ${userId}`, error);
//     throw error;
//   }
// }

// export async function removeFromWishlist(userId: string, courseId: number) {
//   try {
//     await User.findByIdAndUpdate(
//       userId,
//       { $pull: { wishlist: courseId } }
//     );
//   } catch (error) {
//     console.error(`Error removing course ${courseId} from wishlist for user ${userId}`, error);
//     throw error;
//   }
// }

// // Course progress tracking
// export async function initCourseProgress(userId: string, courseId: number, modules: IModuleProgress[]) {
//   try {
//     const courseProgress: ICourseProgress = {
//       courseId,
//       modules,
//       overallCompletionPercentage: 0,
//       completionStatus: false,
//       dateStarted: new Date(),
//       lastUpdated: new Date()
//     };

//     await User.findByIdAndUpdate(
//       userId,
//       { 
//         $push: { courseProgress: courseProgress },
//         lastActiveAt: new Date()
//       }
//     );
//   } catch (error) {
//     console.error(`Error initializing course progress for user ${userId}`, error);
//     throw error;
//   }
// }

// export async function updateSubmoduleProgress(userId: string, courseId: number, moduleId: number, submoduleId: number, completed: boolean) {
//   try {
//     // First find the user to get current progress
//     const user = await User.findById(userId);
//     if (!user) throw new Error("User not found");
    
//     // Find the course progress
//     const courseProgressIndex = user.courseProgress.findIndex(cp => cp.courseId === courseId);
//     if (courseProgressIndex === -1) throw new Error("Course progress not found");
    
//     // Find the module
//     const moduleIndex = user.courseProgress[courseProgressIndex].modules.findIndex(m => m.moduleId === moduleId);
//     if (moduleIndex === -1) throw new Error("Module progress not found");
    
//     // Find the submodule
//     const submoduleIndex = user.courseProgress[courseProgressIndex].modules[moduleIndex].submodules.findIndex(
//       s => s.submoduleId === submoduleId
//     );
//     if (submoduleIndex === -1) throw new Error("Submodule not found");
    
//     // Update using MongoDB's positional operator for nested arrays
//     const query = {
//       _id: userId,
//       "courseProgress.courseId": courseId,
//       "courseProgress.modules.moduleId": moduleId,
//       "courseProgress.modules.submodules.submoduleId": submoduleId
//     };
    
//     const update = {
//       $set: {
//         "courseProgress.$[course].modules.$[module].submodules.$[submodule].completed": completed,
//         "courseProgress.$[course].lastUpdated": new Date()
//       }
//     };
    
//     const options = {
//       arrayFilters: [
//         { "course.courseId": courseId },
//         { "module.moduleId": moduleId },
//         { "submodule.submoduleId": submoduleId }
//       ]
//     };
    
//     await User.updateOne(query, update, options);
    
//     // Now recalculate overall completion percentage and update it
//     await updateCourseCompletionPercentage(userId, courseId);
    
//   } catch (error) {
//     console.error(`Error updating submodule progress for user ${userId}`, error);
//     throw error;
//   }
// }

// async function updateCourseCompletionPercentage(userId: string, courseId: number) {
//   try {
//     const user = await User.findById(userId);
//     if (!user) throw new Error("User not found");
    
//     const courseProgressIndex = user.courseProgress.findIndex(cp => cp.courseId === courseId);
//     if (courseProgressIndex === -1) throw new Error("Course progress not found");
    
//     const courseProgress = user.courseProgress[courseProgressIndex];
    
//     // Count total submodules and completed submodules
//     let totalSubmodules = 0;
//     let completedSubmodules = 0;
    
//     courseProgress.modules.forEach(module => {
//       totalSubmodules += module.submodules.length;
//       completedSubmodules += module.submodules.filter(submodule => submodule.completed).length;
//     });
    
//     // Calculate percentage
//     const completionPercentage = totalSubmodules > 0 
//       ? Math.round((completedSubmodules / totalSubmodules) * 100) 
//       : 0;
    
//     // Check if course is fully completed
//     const isCompleted = completionPercentage === 100;
    
//     // Update course progress with new percentage
//     await User.updateOne(
//       { _id: userId, "courseProgress.courseId": courseId },
//       { 
//         $set: {
//           "courseProgress.$.overallCompletionPercentage": completionPercentage,
//           "courseProgress.$.completionStatus": isCompleted,
//           "courseProgress.$.lastUpdated": new Date(),
//           ...(isCompleted ? { "courseProgress.$.dateCompleted": new Date() } : {})
//         },
//         lastActiveAt: new Date()
//       }
//     );
    
//   } catch (error) {
//     console.error(`Error updating course completion percentage for user ${userId}`, error);
//     throw error;
//   }
// }

// export async function updateUserLastActive(userId: string) {
//   try {
//     await User.findByIdAndUpdate(userId, {
//       lastActiveAt: new Date()
//     });
//   } catch (error) {
//     console.error(`Error updating last active time for user ${userId}`, error);
//     throw error;
//   }
// }

// export async function updateUserLastLogin(userId: string) {
//   try {
//     await User.findByIdAndUpdate(userId, {
//       lastLoginAt: new Date(),
//       lastActiveAt: new Date()
//     });
//   } catch (error) {
//     console.error(`Error updating last login time for user ${userId}`, error);
//     throw error;
//   }
// }