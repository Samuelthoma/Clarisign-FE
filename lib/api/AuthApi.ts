import { ActionResult, ApiError } from "./Client";
import * as actions from "./AuthActions";

async function unwrap<T>(pending: Promise<ActionResult<T>>): Promise<T> {
  const result = await pending;

  if (!result.ok) {
    throw new ApiError(result.message, {
      status: result.status,
      code: result.code,
    });
  }

  return result.data;
}

export const loginApi = (email: string, password: string) =>
  unwrap(actions.loginApi(email, password));

export const logoutApi = () => unwrap(actions.logoutApi());

export const registerApi = (email: string) => unwrap(actions.registerApi(email));

export const verifyOtpApi = (email: string, otp: string) =>
  unwrap(actions.verifyOtpApi(email, otp));

export const verifyKycApi = (data: {
  email: string;
  id_card_key: string;
  selfie_key: string;
  nik?: string;
  full_name?: string;
  date_of_birth?: string;
}) => unwrap(actions.verifyKycApi(data));

export const uploadFaceImageApi = (file: File) =>
  unwrap(actions.uploadFaceImageApi(file));

export const setPasswordApi = (data: {
  email: string;
  password: string;
  confirmPassword: string;
  registrationToken: string;
}) => unwrap(actions.setPasswordApi(data));

export const idCardOcrApi = (file: File) => unwrap(actions.idCardOcrApi(file));

export const requestPasswordResetApi = (email: string) =>
  unwrap(actions.requestPasswordResetApi(email));

export const verifyResetPasswordOtpApi = (email: string, otp: string) =>
  unwrap(actions.verifyResetPasswordOtpApi(email, otp));

export const resetPasswordApi = (resetToken: string, password: string) =>
  unwrap(actions.resetPasswordApi(resetToken, password));
