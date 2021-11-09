import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

import { MyImageService } from '../services/my-image.service';

import { Publikacija } from '../models/Publikacija';

@Injectable({
  providedIn: 'root'
})
export class PublikacijeService {
  publikacijeCollection: AngularFirestoreCollection<Publikacija>;
  publikacijaDoc: AngularFirestoreDocument<Publikacija>;
  publikacije: Observable<Publikacija[]>;
  publikacija: Observable<Publikacija>;
  novaPublikacija: Publikacija;
  constructor(private afs: AngularFirestore,
              private imageService: MyImageService,
              private storage: AngularFireStorage) { }

  getPublikacije(): Observable<Publikacija[]> {
    // tslint:disable-next-line: max-line-length
    const collection: AngularFirestoreCollection<Publikacija> = this.afs.collection('publikacije', ref => ref.orderBy('DatumObjavljivanja', 'desc'));
    const collection$: Observable<Publikacija[]> = collection.snapshotChanges().pipe(
        map(actions => {
            return actions.map(action  => {
        const data = action.payload.doc.data() as Publikacija;
        data.Id = action.payload.doc.id;
        return data;
          });
        })
      );
    return collection$;
}
getPublikacija(id: string): Observable<Publikacija> {
  this.publikacijaDoc = this.afs.doc<Publikacija>(`publikacije/${id}`);
  this.publikacija = this.publikacijaDoc.snapshotChanges().pipe(
    map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Publikacija;
        data.Id = action.payload.id;
        return data;
      }
    })
  );
  return this.publikacija;
}
getByAutor(autor: string) {
  let collection: AngularFirestoreCollection<Publikacija>;
  if (autor !== 'Autori') {
       collection = this.afs.collection('publikacije', ref => ref.where('Autor', '==', autor).orderBy('Datumobjavljivanja', 'desc'));
    } else {
      collection = this.afs.collection('publikacije', ref => ref.orderBy('DatumObjavljivanja', 'desc'));
    }
  const collection$: Observable<Publikacija[]> = collection.snapshotChanges().pipe(
      map(actions => {
          return actions.map(action  => {
      const data = action.payload.doc.data() as Publikacija;
      data.Id = action.payload.doc.id;
      return data;
        });
      })
    );
  return collection$;
}

updatePublikacija(id: string, publikacija: Publikacija) {
  this.publikacijaDoc = this.afs.doc<Publikacija>(`publikacije/${id}`);

  this.publikacijaDoc.update(publikacija).catch(err => {
    console.log(err);
  });
}
dodajPublikacija(publikacija: Publikacija) {
  const collection: AngularFirestoreCollection<Publikacija> = this.afs.collection('publikacije');
  collection.add(publikacija);
}
deletePublikacija(publikacija: Publikacija) {
  this.publikacijaDoc = this.afs.doc<Publikacija>(`publikacije/${publikacija.Id}`);
  this.publikacijaDoc.delete();
}
}
