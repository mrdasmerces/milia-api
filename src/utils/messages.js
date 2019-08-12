const messages = {

  defaultErrors: {
    secretsError: 'Secret not found.',
    dbError: 'DynamoDB connection error.',
    itemNotFoundError: 'Item not found.',
    genericError: 'Erro ao efetuar sua solicitação.',
    permissionError: 'Usuário não tem permissão para efetuar essa ação.',
    businessRuleError: 'Erro de regra de negócio.',
    resourceNotAvailableError: 'O recurso não está disponível.',
    userTokenError: 'Erro ao criar token do usuário.',
    missingParamsError: 'Parametros não passados corretamente.',
    eventError: 'Erro ao gerar evento.'
  },

  // class errors
  decryptTokenError: 'Houve um erro ao descriptografar token. Tente novamente.',
  secretNotFoundError: 'Secret não encontrado.',
  loadSecretsError: 'Não foi possível carregar secrets.',

  user: {
    loginSuccess: 'Login efetuado com sucesso.',
    historyCreateError: 'Houve um erro ao salvar histórico na tentativa de login.',
    createUserError: 'Houve um erro ao criar o usuário. Tente novamente.',
    userTokenADServiceUnavailableError: 'Serviço de geração de token de AD não disponível.',
    userADInvalidError: 'Usuário e senha inválidos.',
    userADServiceUnavailableError: 'Serviço de validação de usuário não disponível.',
    tokenCreationError: 'Houve um erro ao criar o token do usuário. Por favor, tente novamente.',
    missingUsernameParamError: 'Paramêtro username não passado.',
    userInvalidError: 'Usuário e senha inválidos.',
    userDisabledError: 'Usuário desabilitado. Por favor, entre em contato com seu administrador.',
    refreshTokenInvalid: 'Não foi possível revalidar o login.',
    refreshTokenExpired: 'Tempo máximo de utilização do refresh token alcançado.',
    refreshTokenNotFound: 'Refresh Token não encontrado.',
    userNotFound: 'Usuário e senha inválidos.',
    userWaitingForAdm: 'Usuário aguardando confirmação. Por favor, entre em contato com seu administrador.'
  },
};

module.exports = { messages };
