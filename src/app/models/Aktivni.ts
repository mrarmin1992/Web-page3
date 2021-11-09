import { Observable } from 'rxjs';
export interface Aktivni {
  Id?: string;
  Naslov?: string;
  Opis?: string;
  Slika?: Observable<any>;
  Vrsta?: boolean;
  Dugme?: string;
}
