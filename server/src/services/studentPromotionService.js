import mongoose from 'mongoose';
import StudentEnrollment from '../models/StudentEnrollment.js';
import Student from '../models/Student.js';
import { logAction } from './auditService.js';

/**
 * Executes Algorithm 47: Bulk Student Promotion / Lifecycle updates
 * @param {Object} promotionData - { currentAcademicYearId, nextAcademicYearId, promotions: [...] }
 * @param {String} userId - Admin / Manager ID performing the action
 */
export const processStudentPromotion = async (promotionData, userId) => {
  const { currentAcademicYearId, nextAcademicYearId, promotions } = promotionData;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const promotionResults = [];

    for (const item of promotions) {
      const { 
        studentId, 
        result, // 'PROMOTE', 'RETAIN', 'TRANSFER', 'DISCONTINUE'
        targetClassId, 
        targetSectionId, 
        newRollNumber, 
        reason 
      } = item;

      // 1. Update status on the historical enrollment (Never overwrite!)
      const historicalStatus = result === 'PROMOTE' ? 'PROMOTED' : result === 'RETAIN' ? 'RETAINED' : 'WITHDRAWN';
      await StudentEnrollment.findOneAndUpdate(
        { student: studentId, academicYear: currentAcademicYearId },
        { status: historicalStatus },
        { session }
      );

      // 2. Process ACTIVE continuations (Promote or Retain)
      if (result === 'PROMOTE' || result === 'RETAIN') {
        const [newEnrollment] = await StudentEnrollment.create([{
          student: studentId,
          academicYear: nextAcademicYearId,
          class: targetClassId,
          section: targetSectionId,
          rollNumber: newRollNumber,
          status: 'ENROLLED'
        }], { session });

        promotionResults.push(newEnrollment);
      } 
      // 3. Process Lifecycle exits (Transfer or Discontinue)
      else if (result === 'TRANSFER' || result === 'DISCONTINUE') {
        await Student.findByIdAndUpdate(
          studentId,
          {
            status: result === 'TRANSFER' ? 'TRANSFERRED' : 'DISCONTINUED',
            statusChangeReason: reason || 'Year-end status update',
            statusChangeDate: new Date()
          },
          { session }
        );
      }

      // 4. Audit Log
      await logAction({
        user: userId,
        action: 'PROMOTED',
        module: 'STUDENTS',
        recordId: studentId,
        newValue: { result, nextAcademicYearId, targetClassId, targetSectionId }
      }, session);
    }

    await session.commitTransaction();
    session.endSession();

    return promotionResults;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Promotion processing failed: ${error.message}`);
  }
};