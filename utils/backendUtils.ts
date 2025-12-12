import { expect, Page, APIRequestContext, APIResponse } from '@playwright/test';

export class BackendUtils {

  static async validateSignupResponse(response: APIResponse, userData: any, dynamicEmail: string) {
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody).toHaveProperty('token');
    expect(responseBody.user).toEqual(expect.objectContaining({
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: dynamicEmail
    }));
  }

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
}