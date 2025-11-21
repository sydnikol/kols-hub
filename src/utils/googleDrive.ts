/**
 * Google Drive Integration Service
 * Uses the comprehensive googleSyncService for authentication and file operations
 */

import { googleSyncService } from '../services/googleSyncService';

/**
 * Initialize Google Drive
 */
export async function initializeDrive(): Promise<void> {
  await googleSyncService.initialize();
}

/**
 * Check if Google Drive is connected
 */
export async function isDriveConnected(): Promise<boolean> {
  return await googleSyncService.isAuthenticated();
}

/**
 * Connect to Google Drive (start OAuth flow)
 */
export async function authorizeDrive(): Promise<{ success: boolean; error?: string }> {
  try {
    await initializeDrive();
    const result = await googleSyncService.authenticate();
    return {
      success: result.success,
      error: result.error,
    };
  } catch (error) {
    console.error('Failed to authorize Drive:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Authorization failed',
    };
  }
}

/**
 * Disconnect from Google Drive
 */
export async function disconnectDrive(): Promise<void> {
  await googleSyncService.signOut();
}

/**
 * Upload file to Google Drive
 */
export async function uploadToDrive(
  fileName: string,
  content: Blob | string,
  options: {
    mimeType?: string;
    folderId?: string;
  } = {}
): Promise<any> {
  try {
    if (!await isDriveConnected()) {
      throw new Error('Not connected to Google Drive. Please authorize first.');
    }

    // Determine MIME type
    let mimeType = options.mimeType;
    if (!mimeType) {
      if (content instanceof Blob) {
        mimeType = content.type || 'application/octet-stream';
      } else {
        mimeType = 'text/plain';
      }
    }

    const result = await googleSyncService.uploadToDrive({
      fileName,
      content,
      mimeType,
      folderId: options.folderId,
    });

    console.log(`Successfully uploaded ${fileName} to Google Drive`);
    return result;
  } catch (error) {
    console.error('Failed to upload to Drive:', error);
    throw error;
  }
}

/**
 * Download file from Google Drive
 */
export async function downloadFromDrive(fileId: string): Promise<Blob> {
  try {
    if (!await isDriveConnected()) {
      throw new Error('Not connected to Google Drive. Please authorize first.');
    }

    return await googleSyncService.downloadFromDrive(fileId);
  } catch (error) {
    console.error('Failed to download from Drive:', error);
    throw error;
  }
}

/**
 * List files in Google Drive
 */
export async function listDriveFiles(options: {
  folderId?: string;
  query?: string;
  maxResults?: number;
} = {}): Promise<any[]> {
  try {
    if (!await isDriveConnected()) {
      throw new Error('Not connected to Google Drive. Please authorize first.');
    }

    return await googleSyncService.listDriveFiles(options);
  } catch (error) {
    console.error('Failed to list Drive files:', error);
    throw error;
  }
}

/**
 * Create a backup of app data to Google Drive
 */
export async function createBackup(
  data: any,
  fileName: string = `backup_${new Date().toISOString()}.json`
): Promise<any> {
  try {
    if (!await isDriveConnected()) {
      throw new Error('Not connected to Google Drive. Please authorize first.');
    }

    return await googleSyncService.createBackup(data, fileName);
  } catch (error) {
    console.error('Failed to create backup:', error);
    throw error;
  }
}

/**
 * Restore data from a Google Drive backup
 */
export async function restoreBackup(fileId: string): Promise<any> {
  try {
    const blob = await downloadFromDrive(fileId);
    const text = await blob.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to restore backup:', error);
    throw error;
  }
}
