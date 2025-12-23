import { expect, Page, APIRequestContext, APIResponse, Response } from '@playwright/test';

export class BackendUtils {
// Validar la respuesta de registro de usuario
  static async validateSignupResponse(response: any, userData: any, dynamicEmail: string) {
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
    expect(responseBody.user).toEqual(expect.objectContaining({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: dynamicEmail
    }));
    return responseBody;
  }
// Validar el código de estado de una respuesta
  static async validateStatusCode(response: Response | APIResponse, expectedStatus: number) {
    expect(response.status()).toBe(expectedStatus);
  }
// Registrar un usuario vía API
  static async registerUserViaApi(request: APIRequestContext, userData: any, dynamicEmail: string) {
    const response = await request.post('http://localhost:6007/api/auth/signup', {
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: dynamicEmail,
        password: userData.password
      }
    });
    return response;
  }

  static async mockSignupAsServerError(page: Page) {
    await page.route('**/api/auth/signup', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Internal Server Error' }),
      });
    });
  }
  

static async validateLoginResponse(response: Response) {
  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('token');
  expect(typeof responseBody.token).toBe('string');
  return responseBody;
}

}