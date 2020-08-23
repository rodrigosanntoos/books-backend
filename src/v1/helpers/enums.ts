export enum AuthHeader {
  Authorization = 'authorization',
  ResourceType = 'resourceType',
  Book = 'book',
  Origin = 'origin',
}

export enum AuthContext {
  CurrentUser = 'current-user',
  UserId = 'user-id',
}

export enum Route {
  auths = 'auth',
  books = 'books',
}

export enum Method {
  Post = 'POST',
}

export enum BookCategories {
  biographies = 'Biografias',
  collections = 'Coleções',
  behavior = 'Comportamento',
  tales = 'Contos',
  literaryCriticism = 'Crítica Literária',
  scienceFiction = 'Ficção Científica',
  folklore = 'Folclore',
  genealogy = 'Genealogia',
  humor = 'Humor',
  children = 'Infantojuvenis',
  games = 'Jogos',
  newspapers = 'Jornais',
  brazilianLiterature = 'Literatura Brasileira',
  foreignLiterature = 'Literatura Estrangeira',
  rareBooks = 'Livros Raros',
  manuscripts = 'Manuscritos',
  poetry = 'Poesia',
  anotherSubjects = 'Outros Assuntos',
}
