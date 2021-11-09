import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

import { KategorijaVijesti } from '../models/KategorijaVijesti';

@Injectable({
  providedIn: 'root'
})
export class KategorijeVijestiService {
  kategorijeVijestiCollection: AngularFirestoreCollection<KategorijaVijesti>;
  kategorijaVijestiDoc: AngularFirestoreDocument<KategorijaVijesti>;
  kategorijeVijesti: Observable<KategorijaVijesti[]>;
  kategorijaVijesti: Observable<KategorijaVijesti>;
  novaKategorijaVijesti: KategorijaVijesti;
  constructor(private afs: AngularFirestore,
              private storage: AngularFireStorage) { }

getKategorijeVijesti(): Observable<KategorijaVijesti[]> {
      // tslint:disable-next-line: max-line-length
      const collection: AngularFirestoreCollection<KategorijaVijesti> = this.afs.collection('kategorijeVijesti');
      const collection$: Observable<KategorijaVijesti[]> = collection.snapshotChanges().pipe(
          map(actions => {
              return actions.map(action  => {
          const data = action.payload.doc.data() as KategorijaVijesti;
          data.Id = action.payload.doc.id;
          return data;
            });
          })
        );
      return collection$;
  }
  getKategorijaVijesti(id: string): Observable<KategorijaVijesti> {
    this.kategorijaVijestiDoc = this.afs.doc<KategorijaVijesti>(`kategorijeVijesti/${id}`);
    this.kategorijaVijesti = this.kategorijaVijestiDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as KategorijaVijesti;
          data.Id = action.payload.id;
          return data;
        }
      })
    );
    return this.kategorijaVijesti;
  }
  addkategorijaVijesti(kategorija: KategorijaVijesti) {
    const collection: AngularFirestoreCollection<KategorijaVijesti> = this.afs.collection('kategorijeVijesti');
    collection.add(kategorija);
  }
  updateKategorijaVijesti(kategorija: KategorijaVijesti, id: string) {
    this.kategorijaVijestiDoc = this.afs.doc<KategorijaVijesti>(`kategorijeVijesti/${id}`);
    this.kategorijaVijestiDoc.update(kategorija).catch(err => {
      console.log(err);
    });
  }
  deleteKategorijaVijesti(id: string) {
    this.kategorijaVijestiDoc = this.afs.doc(`kategorijeVijesti/${id}`);
    this.kategorijaVijestiDoc.delete();
  }
}
