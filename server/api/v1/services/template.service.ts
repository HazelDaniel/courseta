import { log } from "../../../utils.js";

interface TemplateOptType {
  type: string;
  data: {
    [prop: string]: string;
  };
}

interface TemplateFunctionType {
  (variable: string): string;
}

const creatorPassTemplate: TemplateFunctionType = (creatorPass) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Creator Pass Code</title>
        <style>
            body {
                font-family: 'Inter', 'Helvetica', sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #F5F5F5;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            }
            .header {
                background: linear-gradient(135deg, #FeFeFe, #E9ECEF);
                text-align: center;
                padding: 40px 20px;
            }
            .logo {
                max-width: 120px;
                height: auto;
            }
            .content {
                padding: 40px;
            }
            .code {
                background-color: #F8F9FA;
                border: 1px solid #E9ECEF;
                border-radius: 8px;
                padding: 16px;
                font-size: 24px;
                text-align: center;
                letter-spacing: 5px;
                margin: 30px 0;
                color: #495057;
            }
            .button {
                display: inline-block;
                background-color: #3e0f33;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 24px;
                border-radius: 6px;
                font-weight: 500;
                transition: background-color 0.3s ease;
            }
            .button:hover {
                background-color: #3e3e3e;
            }
            .footer {
                background-color: #F8F9FA;
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #868E96;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
              <svg class="logo" width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_218_1780)">
                <circle cx="18.4722" cy="16.7213" r="9.47541" fill="#3C4442"/>
                <path d="M26.2755 21.1803C26.2755 23.9508 22.9066 26.1967 18.7509 26.1967C14.5952 26.1967 11.2263 23.9508 11.2263 21.1803C11.2263 18.4099 12.087 22.8525 16.2427 22.8525C20.3984 22.8525 26.2755 18.4099 26.2755 21.1803Z" fill="#F3F3F3"/>
                <g filter="url(#filter0_d_218_1780)">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9148 34C12.6326 34 7.56687 32.2089 3.83185 29.0208C3.50975 28.7459 3.19982 28.4625 2.90237 28.1713C4.31465 28.9319 5.88933 29.4928 7.57197 29.8076C7.28341 29.5557 7.00254 29.2934 6.72998 29.0208C3.54186 25.8327 1.7508 21.5087 1.7508 17C1.7508 12.8024 3.3032 8.76496 6.09006 5.65511C4.09809 6.22083 2.29562 7.14071 0.785156 8.32726C1.62605 7.1171 2.64653 5.99094 3.83185 4.97918C7.56687 1.79107 12.6326 0 17.9148 0V0.0205501C18.1926 0.00688132 18.4713 0 18.7508 0V4.45902H18.7508C11.8246 4.45902 6.20977 10.0738 6.20977 17C6.20977 23.9262 11.8246 29.541 18.7508 29.541H18.7508V34C18.4713 34 18.1926 33.9931 17.9148 33.9795V34Z" fill="url(#paint0_radial_218_1780)"/>
                </g>
                </g>
                <defs>
                <filter id="filter0_d_218_1780" x="-3.21484" y="0" width="25.9656" height="42" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_218_1780"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_218_1780" result="shape"/>
                </filter>
                <radialGradient id="paint0_radial_218_1780" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(9.96423 17) rotate(146.31) scale(23.5748 12.457)">
                <stop stop-color="#F3F3F3"/>
                <stop offset="1" stop-color="white"/>
                </radialGradient>
                <clipPath id="clip0_218_1780">
                <rect width="34" height="34" fill="white"/>
                </clipPath>
                </defs>
                </svg>
            </div>
            <div class="content">
                <h1 style="color: #212529; font-weight: 600;">Welcome, Creator!</h1>
                <p style="color: #495057;">We're excited to have you on board. Here's your exclusive Creator Pass code:</p>
                <div class="code">${creatorPass}</div>
                <p style="color: #495057;">Use this code to access special features and benefits on our platform.</p>
                <p style="color: #495057;">Ready to get started?</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Courseta Ed-tech. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

const verificationLinkTemplate: TemplateFunctionType = (verificationLink) => {
  return `
    <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email</title>
          <style>
              body {
                  font-family: 'Inter', 'Helvetica', sans-serif;
                  line-height: 1.6;
                  color: #333;
                  background-color: #FeFeFe;
                  margin: 0;
                  padding: 0;
              }
              .container {
                  max-width: 600px;
                  margin: 40px auto;
                  background-color: #ffffff;
                  border-radius: 12px;
                  overflow: hidden;
                  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
              }
              .header {
                  background: linear-gradient(135deg, #FeFeFe, #E9ECEF);
                  text-align: center;
                  padding: 40px 20px;
              }
              .logo {
                  max-width: 120px;
                  height: auto;
              }
              .content {
                  padding: 40px;
              }
              .button {
                  display: inline-block;
                  background-color: #3e0f33;
                  color: #ffffff;
                  text-decoration: none;
                  padding: 12px 24px;
                  border-radius: 6px;
                  font-weight: 500;
                  transition: background-color 0.3s ease;
              }
              .button:hover {
                  background-color: #3e3e3e;
              }
              .footer {
                  background-color: #F8F9FA;
                  text-align: center;
                  padding: 20px;
                  font-size: 12px;
                  color: #868E96;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                <svg class="logo" width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_218_1780)">
                  <circle cx="18.4722" cy="16.7213" r="9.47541" fill="#3C4442"/>
                  <path d="M26.2755 21.1803C26.2755 23.9508 22.9066 26.1967 18.7509 26.1967C14.5952 26.1967 11.2263 23.9508 11.2263 21.1803C11.2263 18.4099 12.087 22.8525 16.2427 22.8525C20.3984 22.8525 26.2755 18.4099 26.2755 21.1803Z" fill="#F3F3F3"/>
                  <g filter="url(#filter0_d_218_1780)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M17.9148 34C12.6326 34 7.56687 32.2089 3.83185 29.0208C3.50975 28.7459 3.19982 28.4625 2.90237 28.1713C4.31465 28.9319 5.88933 29.4928 7.57197 29.8076C7.28341 29.5557 7.00254 29.2934 6.72998 29.0208C3.54186 25.8327 1.7508 21.5087 1.7508 17C1.7508 12.8024 3.3032 8.76496 6.09006 5.65511C4.09809 6.22083 2.29562 7.14071 0.785156 8.32726C1.62605 7.1171 2.64653 5.99094 3.83185 4.97918C7.56687 1.79107 12.6326 0 17.9148 0V0.0205501C18.1926 0.00688132 18.4713 0 18.7508 0V4.45902H18.7508C11.8246 4.45902 6.20977 10.0738 6.20977 17C6.20977 23.9262 11.8246 29.541 18.7508 29.541H18.7508V34C18.4713 34 18.1926 33.9931 17.9148 33.9795V34Z" fill="url(#paint0_radial_218_1780)"/>
                  </g>
                  </g>
                  <defs>
                  <filter id="filter0_d_218_1780" x="-3.21484" y="0" width="25.9656" height="42" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="4"/>
                  <feGaussianBlur stdDeviation="2"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_218_1780"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_218_1780" result="shape"/>
                  </filter>
                  <radialGradient id="paint0_radial_218_1780" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(9.96423 17) rotate(146.31) scale(23.5748 12.457)">
                  <stop stop-color="#F3F3F3"/>
                  <stop offset="1" stop-color="white"/>
                  </radialGradient>
                  <clipPath id="clip0_218_1780">
                  <rect width="34" height="34" fill="white"/>
                  </clipPath>
                  </defs>
                  </svg>
              </div>
              <div class="content">
                  <h1 style="color: #212529; font-weight: 600;">Verify Your Email</h1>
                  <p style="color: #495057;">Thank you for signing up! To complete your registration, please verify your email address by clicking the button below:</p>
                  <p style="text-align: center; margin-top: 30px;">
                      <a href="${verificationLink}" class="button">Verify Email</a>
                  </p>
                  <p style="color: #495057; margin-top: 30px;">If you didn't create an account on our platform, you can safely ignore this email.</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Courseta Ed-tech. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
  `;
};

export class Template {

  private templateCreationHash: {
    [prop: string]: TemplateFunctionType;
  } = {
    creatorPassTemplate,
    verificationLinkTemplate,
  };

  constructor(public opts: TemplateOptType) { }

  get select(): string {
    if (!(this.opts.type in this.opts.data)) {
      throw new Error("field does not exist in data");
    }
    return this.opts.data[this.opts.type];
  }

  get generate(): string {
    const value = this.select;
    if (!(`${this.opts.type}Template` in this.templateCreationHash)) {
      throw new Error("no function exists to parse your template");
    }
    return this.templateCreationHash[`${this.opts.type}Template`](value);
  }
}

export default Template;
