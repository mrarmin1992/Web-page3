import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

import { KategorijaProizvoda } from '../models/KategorijaProizvoda';

@Injectable({
  providedIn: 'root'
})
export class KategorijeProizvodaService {
  kategorijeProizvodiCollection: AngularFirestoreCollection<KategorijaProizvoda>;
  kategorijaProizvodiDoc: AngularFirestoreDocument<KategorijaProizvoda>;
  kategorijeProizvodi: Observable<KategorijaProizvoda[]>;
  kategorijaProizvodi: Observable<KategorijaProizvoda>;
  novaKategorijaProizvodi: KategorijaProizvoda;
  constructor(private afs: AngularFirestore,
              private storage: AngularFireStorage) { }

getKategorijeProizvodi(): Observable<KategorijaProizvoda[]> {
      // tslint:disable-next-line: max-line-length
      const collection: AngularFirestoreCollection<KategorijaProizvoda> = this.afs.collection('kategorijeProizvodi');
      const collection$: Observable<KategorijaProizvoda[]> = collection.snapshotChanges().pipe(
          map(actions => {
              return actions.map(action  => {
          const data = action.payload.doc.data() as KategorijaProizvoda;
          data.Id = action.payload.doc.id;
          return data;
            });
          })
        );
      return collection$;
  }
  getKategorijaProizvodi(id: string): Observable<KategorijaProizvoda> {
    this.kategorijaProizvodiDoc = this.afs.doc<KategorijaProizvoda>(`kategorijeProizvodi/${id}`);
    this.kategorijaProizvodi = this.kategorijaProizvodiDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as KategorijaProizvoda;
          data.Id = action.payload.id;
          return data;
        }
      })
    );
    return this.kategorijaProizvodi;
  }
  addkategorijaProizvodi(kategorija: KategorijaProizvoda) {
    const collection: AngularFirestoreCollection<KategorijaProizvoda> = this.afs.collection('kategorijeProizvodi');
    collection.add(kategorija);
  }
  updateKategorijaProizvodi(kategorija: KategorijaProizvoda, id: string) {
    this.kategorijaProizvodiDoc = this.afs.doc<KategorijaProizvoda>(`kategorijeProizvodi/${id}`);
    this.kategorijaProizvodiDoc.update(kategorija).catch(err => {
      console.log(err);
    });
  }
  deleteKategorijaProizvodi(id: string) {
    this.kategorijaProizvodiDoc = this.afs.doc(`kategorijeProizvodi/${id}`);
    this.kategorijaProizvodiDoc.delete();
  }
}
