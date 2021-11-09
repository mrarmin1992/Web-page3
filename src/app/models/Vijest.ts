import { Observable } from 'rxjs';

export interface Vijest {
  Id?: string;
  Naslov?: string;
  Podnaslov?: string;
  Sadrzaj?: string;
  Kategorija?: string;
  Datum?: any;
  Slika?: Observable<any>;
  Fokus?: boolean;
  Objava: string;
}
