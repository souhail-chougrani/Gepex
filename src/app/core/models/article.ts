export class ajoutArt {
  "ArticlesID":string[];
  "UsersRsID": string[]
  constructor(artIDs : string[], uIds : string[]){
      this.ArticlesID = artIDs;
      this.UsersRsID = uIds ;
  }
}

export class sta {
  id: string
  state: boolean

  constructor(id: string) {
      this.id = id
      this.state = false
  }
}

export class checkedState{
  id : string // article Id
  state : boolean
  constructor(id :string){
      this.id = id;
      this.state = false;
  }
}

export function remplir() {
  var al: sta[] = []
  for (var i = 1; i < 43; i++) {
      al.push(new sta("Ar" + i.toString()))
  }
  return al
}

export class ArticleEnfant {
  "ArticleMere": ArticleMere
  "EnfantsCount": number;
  "ArticleEnfants": ArticleEnfant[];
}
export class ArticleMere {
  "ArticleID": string;
  "DesignationArticle": string;
  "CodeCroquis": number;
  "CodePieceMere": string;
}
export class Articles {
  "MeresCount": number;
  "ArticleArborescence": ArticleEnfant[];
}

