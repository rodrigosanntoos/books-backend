export const errors = {
  shared: {
    somethingWentWrong: 'Infelizmente, algo deu errado.',
    headerMissing: key => `'${key}' header is missing`,
    queryParameterMissing: key => `'${key}' query parameter is missing`,
    fieldNotFound: key => `'${key}' é obrigatório`,
  },
  book: {
    notFound: 'Livro não encontrada.',
  },
  user: {
    unauthorizerd: 'Não autorizado.',
    invalidUsernameOrPassword: 'Usuário ou senha inválida.',
  },
}
