import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

import { MyImageService } from '../services/my-image.service';

import { Prakticne } from '../models/Prakticne';

@Injectable({
  providedIn: 'root'
})
export class PrakticnaObukaService {
  obukeCollection: AngularFirestoreCollection<Prakticne>;
  obukaDoc: AngularFirestoreDocument<Prakticne>;
  obuke: Observable<Prakticne[]>;
  obuka: Observable<Prakticne>;
  novaObuka: Prakticne;
  constructor(private afs: AngularFirestore,
              private imageService: MyImageService,
              private auth: AngularFireAuth) { }
  sveObuke(): Observable<Prakticne[]> {
    // tslint:disable-next-line: max-line-length
    const collection: AngularFirestoreCollection<Prakticne> = this.afs.collection('prakticneObuke', ref => ref.orderBy('DatumPocetka', 'asc'));
    const collection$: Observable<Prakticne[]> = collection.snapshotChanges().pipe(
        map(actions => {
            return actions.map(action  => {
        const data = action.payload.doc.data() as Prakticne;
        data.Id = action.payload.doc.id;
        return data;
          });
        })
      );
    return collection$;
  }
  get5(): Observable<Prakticne[]> {
    // tslint:disable-next-line: max-line-length
    const collection: AngularFirestoreCollection<Prakticne> = this.afs.collection('prakticneObuke', ref => ref.orderBy('DatumPocetka', 'asc').limit(5));
    const collection$: Observable<Prakticne[]> = collection.snapshotChanges().pipe(
        map(actions => {
            return actions.map(action  => {
        const data = action.payload.doc.data() as Prakticne;
        data.Id = action.payload.doc.id;
        return data;
          });
        })
      );
    return collection$;
  }
  getObuke(): Observable<Prakticne[]> {
    const user = this.auth.auth.currentUser.displayName;
    let collection: AngularFirestoreCollection<Prakticne>;
    if ( user === 'Rijad Dzanko') {
      collection = this.afs.collection('prakticneObuke', ref => ref.orderBy('DatumObjave', 'desc'));
    } else {
      collection = this.afs.collection('prakticneObuke', ref => ref.orderBy('DatumObjave', 'desc').where('Objava', '==', user));
    }
    const collection$: Observable<Prakticne[]> = collection.snapshotChanges().pipe(
        map(actions => {
            return actions.map(action  => {
        const data = action.payload.doc.data() as Prakticne;
        data.Id = action.payload.doc.id;
        return data;
          });
        })
      );
    return collection$;
}
getAktivni(): Observable<Prakticne[]> {
  // tslint:disable-next-line: max-line-length
  const collection: AngularFirestoreCollection<Prakticne> = this.afs.collection('prakticneObuke', ref => ref.where('Aktivan', '==', true));
  const collection$: Observable<Prakticne[]> = collection.snapshotChanges().pipe(
      map(actions => {
          return actions.map(action  => {
      const data = action.payload.doc.data() as Prakticne;
      data.Id = action.payload.doc.id;
      return data;
        });
      })
    );
  return collection$;
}
getObuka(id: string): Observable<Prakticne> {
  this.obukaDoc = this.afs.doc<Prakticne>(`prakticneObuke/${id}`);
  this.obuka = this.obukaDoc.snapshotChanges().pipe(
    map(action => {
      if (action.payload.exists === false) {
        return null;
      } else {
        const data = action.payload.data() as Prakticne;
        data.Id = action.payload.id;
        return data;
      }
    })
  );
  return this.obuka;
}
getByKategorija(kategorija: string): Observable<Prakticne[]> {
  let collection: AngularFirestoreCollection<Prakticne>;
  if (kategorija !== 'Sve praktične obuke') {
    // tslint:disable-next-line: max-line-length
     collection = this.afs.collection('prakticneObuke', ref => ref.where('Kategorija', '==', kategorija));
  } else {
    collection = this.afs.collection('prakticneObuke');
  }
  const collection$: Observable<Prakticne[]> = collection.snapshotChanges().pipe(
      map(actions => {
          return actions.map(action  => {
      const data = action.payload.doc.data() as Prakticne;
      data.Id = action.payload.doc.id;
      return data;
        });
      })
    );
  return collection$;
}
updateKategorija(obuka: Prakticne, kategorija: string) {
  obuka.Kategorija = kategorija;
  this.updateObuka(obuka.Id, obuka);

}
getObukaValue(id: string) {
  return this.afs.doc<Prakticne>(`prakticneObuke/${id}`);
}
updateObuka(id: string, obuka: Prakticne) {
  this.obukaDoc = this.afs.doc<Prakticne>(`prakticneObuke/${id}`);

  this.novaObuka = {
    Naslov: obuka.Naslov,
    Opis: obuka.Opis,
    Trajanje: obuka.Trajanje,
    Kategorija: obuka.Kategorija,
    DatumObjave: obuka.DatumObjave,
    DatumPocetka: obuka.DatumPocetka,
    Cijena: obuka.Cijena,
    BrojPolaznika: obuka.BrojPolaznika,
    Objava: obuka.Objava,
    Aktivan: obuka.Aktivan
  };
  this.obukaDoc.update(this.novaObuka).catch(err => {
    console.log(err);
  });
}
dodajObuku(obuka: Prakticne) {
  const user = this.auth.auth.currentUser.displayName;
  const collection: AngularFirestoreCollection<Prakticne> = this.afs.collection('prakticneObuke');
  obuka.Objava = user;
  collection.add(obuka);
}
deleteObuka(obuka: Prakticne) {
  this.obukaDoc = this.afs.doc<Prakticne>(`prakticneObuke/${obuka.Id}`);
  this.obukaDoc.delete();
  this.imageService.deleteImage(obuka.Naslov, 'Obuke');
}
}
