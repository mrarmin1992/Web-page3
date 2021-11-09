import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { KursService } from '../services/kurs.service';

import { KategorijaKurs } from '../models/KategorijaKurs';
import { Kurs } from '../models/Kurs';

@Injectable({
  providedIn: 'root'
})
export class KategorijeKurseviService {
  kursevi: Kurs[];
  kategorijeKurseviCollection: AngularFirestoreCollection<KategorijaKurs>;
  kategorijakursDoc: AngularFirestoreDocument<KategorijaKurs>;
  kategorijeKursevi: Observable<KategorijaKurs[]>;
  kategorijaKurs: Observable<KategorijaKurs>;
  novaKategorijaKurs: KategorijaKurs;
  constructor(private afs: AngularFirestore,
              private kursService: KursService) { }

  getKategorijeKursevi(): Observable<KategorijaKurs[]> {
    // tslint:disable-next-line: max-line-length
    const collection: AngularFirestoreCollection<KategorijaKurs> = this.afs.collection('kategorijeKursevi');
    const collection$: Observable<KategorijaKurs[]> = collection.snapshotChanges().pipe(
        map(actions => {
            return actions.map(action  => {
        const data = action.payload.doc.data() as KategorijaKurs;
        data.Id = action.payload.doc.id;
        return data;
          });
        })
      );
    return collection$;
}
getKategorijaKurs(id: string): Observable<KategorijaKurs> {
  this.kategorijakursDoc = this.afs.doc<KategorijaKurs>(`kategorijeKursevi/${id}`);
  this.kategorijaKurs = this.kategorijakursDoc.snapshotChanges().pipe(
    map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as KategorijaKurs;
        data.Id = action.payload.id;
        return data;
      }
    })
  );
  return this.kategorijaKurs;
}
addkategorijaKurs(kategorija: KategorijaKurs) {
  const collection: AngularFirestoreCollection<KategorijaKurs> = this.afs.collection('kategorijeKursevi');
  collection.add(kategorija);
}
updateKategorijaKurs(kategorija: KategorijaKurs, id: string) {
  this.kategorijakursDoc = this.afs.doc<KategorijaKurs>(`kategorijeKursevi/${id}`);
  this.kategorijakursDoc.update(kategorija).catch(err => {
    console.log(err);
  });
}
deleteKategorijaKurs(id: string) {
  this.kategorijakursDoc = this.afs.doc(`kategorijeKursevi/${id}`);
  this.kategorijakursDoc.delete();
}
}
