import { Observable } from 'rxjs';
export interface Dogadjaj {
  Id?: string;
  Naslov?: string;
  Opis?: string;
  Kategorija?: string;
  DatumPocetka?: any;
  VrijemePocetka?: any;
  DatumObjave?: any;
  Slika?: Observable<any>;
  Objava: string;
}
