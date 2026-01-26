import { supabaseClient } from '../db/supabase.client';
import type { CVUploadResponseDTO, SignedURLResponseDTO } from '../types';

/** Maximum file size in bytes (3MB) */
const MAX_FILE_SIZE = 3 * 1024 * 1024;

/** Allowed MIME types */
const ALLOWED_MIME_TYPES = ['application/pdf'];

/** Storage bucket name */
const CV_BUCKET = 'cv';

/**
 * CV API module
 * Handles CV file upload and download operations
 * Note: Requires authentication - users can only access their own CV
 */
export const cvApi = {
  /**
   * Validate file before upload
   * @param file - File to validate
   * @throws Error if validation fails
   */
  validateFile(file: File): void {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `CV_FILE_TOO_LARGE: File size exceeds maximum allowed (3MB). Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      );
    }

    // Check file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      throw new Error(
        `CV_INVALID_FILE_TYPE: Only PDF files are allowed. Received: ${file.type || 'unknown'}`
      );
    }

    // Check file extension as additional validation
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf') {
      throw new Error(
        `CV_INVALID_FILE_EXTENSION: Only .pdf files are allowed. Received: .${extension}`
      );
    }
  },

  /**
   * Upload CV file for a user
   * @param userId - UUID of the user
   * @param file - PDF file to upload
   * @returns Promise<CVUploadResponseDTO> - Upload result
   * @throws Error if upload fails or validation fails
   */
  async uploadCV(userId: string, file: File): Promise<CVUploadResponseDTO> {
    // Validate file first
    this.validateFile(file);

    const filePath = `${userId}/cv.pdf`;

    // Check if CV already exists
    const { data: existingFiles } = await supabaseClient.storage
      .from(CV_BUCKET)
      .list(userId);

    if (existingFiles && existingFiles.length > 0) {
      throw new Error('CV_ALREADY_UPLOADED: CV has already been uploaded. Cannot upload again.');
    }

    // Upload the file
    const { data, error } = await supabaseClient.storage
      .from(CV_BUCKET)
      .upload(filePath, file, {
        contentType: 'application/pdf',
        upsert: false, // Don't allow overwriting
      });

    if (error) {
      throw new Error(error.message);
    }

    // Update profile with cv_uploaded_at timestamp
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({ cv_uploaded_at: new Date().toISOString() })
      .eq('id', userId);

    if (profileError) {
      // If profile update fails, try to delete the uploaded file
      await supabaseClient.storage.from(CV_BUCKET).remove([filePath]);
      throw new Error(`Failed to update profile: ${profileError.message}`);
    }

    return {
      Key: data.path,
      Id: data.id,
    };
  },

  /**
   * Get signed URL for CV download
   * @param userId - UUID of the user
   * @param expiresIn - URL expiration time in seconds (default: 1 hour)
   * @returns Promise<SignedURLResponseDTO> - Signed URL
   * @throws Error if CV not found or URL generation fails
   */
  async getCVDownloadUrl(
    userId: string,
    expiresIn = 3600
  ): Promise<SignedURLResponseDTO> {
    const filePath = `${userId}/cv.pdf`;

    const { data, error } = await supabaseClient.storage
      .from(CV_BUCKET)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      if (error.message.includes('not found')) {
        throw new Error('CV_NOT_FOUND: CV file has not been uploaded yet.');
      }
      throw new Error(error.message);
    }

    return {
      signedURL: data.signedUrl,
    };
  },

  /**
   * Check if CV exists for a user
   * @param userId - UUID of the user
   * @returns Promise<boolean>
   */
  async hasCVUploaded(userId: string): Promise<boolean> {
    const { data, error } = await supabaseClient.storage
      .from(CV_BUCKET)
      .list(userId);

    if (error) {
      throw new Error(error.message);
    }

    return data !== null && data.length > 0;
  },

  /**
   * Get CV file metadata
   * @param userId - UUID of the user
   * @returns Promise<{ name: string; size: number; createdAt: string } | null>
   */
  async getCVMetadata(
    userId: string
  ): Promise<{ name: string; size: number; createdAt: string } | null> {
    const { data, error } = await supabaseClient.storage
      .from(CV_BUCKET)
      .list(userId);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return null;
    }

    const cvFile = data.find((f) => f.name === 'cv.pdf');
    if (!cvFile) {
      return null;
    }

    return {
      name: cvFile.name,
      size: cvFile.metadata?.size ?? 0,
      createdAt: cvFile.created_at,
    };
  },
};
