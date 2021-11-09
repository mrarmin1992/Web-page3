export interface Prijava {
  Id?: string;
  Ime?: string;
  Prezime?: string;
  DatumRodjenja?: string;
  DatumPrijave?: string;
  Adresa?: string;
  JMBG?: string[13];
  Email?: string;
  Telefon?: string;
  Zanimanje?: string;
  Znanje?: string;
  EventId?: string;
  EventNaziv?: string;
  Objava: string;
  Pogledano?: boolean;
}
