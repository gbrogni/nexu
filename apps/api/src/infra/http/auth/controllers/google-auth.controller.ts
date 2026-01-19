import { AuthenticateWithGoogleUseCase } from '@/application/auth/use-cases/authenticate-with-google';
import { SessionManager } from '@/domain/auth/contracts/session-manager.interface';
import { GoogleOauthGuard } from '@/infra/auth/google-auth/google-oauth.guard';
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import z from 'zod';
import { ApiTags, ApiExcludeEndpoint, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '@/infra/auth/public';
import { EnvService } from '@/infra/env/env.service';

interface GoogleUser {
  providerId: string;
  email: string;
  name: string;
  picture: string;
}

interface GoogleAuthRequest extends Request {
  user: GoogleUser;
}

const googleUserSchema = z.object({
  providerId: z.string(),
  email: z.string().email(),
  name: z.string(),
  picture: z.string().url(),
});

@ApiTags('🔐 Authentication')
@Controller('auth')
@Public()
export class GoogleAuthController {
  constructor(
    private readonly authenticateWithGoogle: AuthenticateWithGoogleUseCase,
    private readonly sessionManager: SessionManager,
    private readonly env: EnvService,
  ) { }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  @ApiOperation({
    summary: '🚀 Iniciar autenticação com Google',
    description: `
        **Inicia o fluxo de autenticação OAuth 2.0 com Google.**
        
        ## 🔄 Fluxo de Autenticação:
        1. **Redirecionamento**: Usuário é redirecionado para o Google
        2. **Autorização**: Google solicita permissões do usuário
        3. **Callback**: Google redireciona para /callback/google
        4. **Processamento**: Sistema processa os dados e autentica
        5. **Frontend**: Usuário é redirecionado para aplicação
        
        ## 🎯 Como Usar no Frontend:
        \`\`\`javascript
        // Redireciona para Google OAuth
        window.location.href = 'http://localhost:3001/auth/google';
        \`\`\`
        
        ## 🔐 Escopos Solicitados:
        - **profile**: Nome e foto do usuário
        - **email**: Email verificado do usuário
        
        ## ⚠️ Importante:
        Este endpoint automaticamente redireciona para o Google.
        Não retorna dados JSON.
      `,
  })
  @ApiResponse({
    status: 302,
    description: '🔄 **Redirecionamento para Google OAuth**\n\n' +
      'O usuário é automaticamente redirecionado para a página de autorização do Google.\n' +
      'Após autorização, será redirecionado de volta para o callback.',
    headers: {
      'Location': {
        description: 'URL de autorização do Google',
        schema: {
          type: 'string',
          example: 'https://accounts.google.com/oauth/authorize?client_id=...'
        }
      }
    }
  })

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  @ApiExcludeEndpoint()
  async handle(
    @Req() req: GoogleAuthRequest,
    @Res() res: Response
  ): Promise<void> {
    try {
      const validationResult = googleUserSchema.safeParse(req.user);

      if (!validationResult.success) {
        console.error('Google OAuth validation failed:', validationResult.error);
        return res.redirect(`${this.env.get('FRONTEND_URL')}/auth/error?reason=invalid_data`);
      }

      const { email, name, picture, providerId } = validationResult.data;

      const result = await this.authenticateWithGoogle.execute({
        email,
        name,
        pictureUrl: picture || '',
        providerId,
      });

      if (result.isLeft()) {
        console.error('Google OAuth authentication failed:', result.value);
        return res.redirect(`${this.env.get('FRONTEND_URL')}/auth/error?reason=auth_failed`);
      }

      const { accessToken, refreshToken } = result.value;

      this.sessionManager.setTokens({ accessToken, refreshToken });
      res.redirect(`${this.env.get('FRONTEND_URL')}/?auth=google_success`);

    } catch (error) {
      console.error('Google OAuth error:', error);
      res.redirect(`${this.env.get('FRONTEND_URL')}/auth/error?reason=server_error`);
    }
  }
}