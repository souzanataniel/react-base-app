import {apiClient} from '@/lib/api/client';
import {User} from '@/features/auth';
import {ChangePasswordRequest, UpdateUserRequest} from '@/features/auth/types';

class UserService {

  private readonly baseUrl = '/auth';

  async getCurrentUser(): Promise<User> {
    try {
      return await apiClient.get<User>(`${this.baseUrl}/me`);
    } catch (error) {
      throw this.handleUserError(error);
    }
  }

  async updateProfile(data: UpdateUserRequest): Promise<User> {
    try {
      return await apiClient.patch<User>(`${this.baseUrl}/me`, data);
    } catch (error) {
      throw this.handleUserError(error);
    }
  }

  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    try {
      return await apiClient.post(`${this.baseUrl}/change-password`, data);
    } catch (error) {
      throw this.handleUserError(error);
    }
  }

  async uploadAvatar(avatarFile: File | FormData): Promise<User> {
    try {
      const formData = avatarFile instanceof FormData
        ? avatarFile
        : this.createAvatarFormData(avatarFile);

      return await apiClient.upload<User>(`${this.baseUrl}/avatar`, formData);
    } catch (error) {
      throw this.handleUserError(error);
    }
  }

  async deleteAvatar(): Promise<User> {
    try {
      return await apiClient.delete<User>(`${this.baseUrl}/avatar`);
    } catch (error) {
      throw this.handleUserError(error);
    }
  }

  async deleteAccount(password: string): Promise<{ message: string }> {
    try {
      return await apiClient.post(`${this.baseUrl}/delete-account`, {password});
    } catch (error) {
      throw this.handleUserError(error);
    }
  }

  private createAvatarFormData(file: File): FormData {
    const formData = new FormData();
    formData.append('avatar', file);
    return formData;
  }

  private handleUserError(error: any): Error {
    const errorCode = error.response?.data?.code || error.code;
    const errorMessage = error.response?.data?.message || error.message;

    const userError = new Error(errorMessage) as any;
    userError.code = errorCode;
    userError.status = error.response?.status;
    userError.fieldErrors = error.response?.data?.fieldErrors;

    return userError;
  }
}

export const userService = new UserService();
