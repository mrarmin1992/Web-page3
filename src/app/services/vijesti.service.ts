import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { MyImageService } from '../services/my-image.service';
import { AngularFireAuth } from '@angular/fire/auth';

import { Vijest } from '../models/Vijest';

@Injectable({
  providedIn: 'root'
})
export class VijestiService {
  vijestiCollection: AngularFirestoreCollection<Vijest>;
  vijestDoc: AngularFirestoreDocument<Vijest>;
  vijesti: Observable<Vijest[]>;
  vijest: Observable<Vijest>;
  novaVijest: Vijest;
  constructor(private afs: AngularFirestore,
              private storage: AngularFireStorage,
              private imageService: MyImageService,
              private auth: AngularFireAuth) { }
  getVijesti(): Observable<Vijest[]> {
      // tslint:disable-next-line: max-line-length
      const collection: AngularFirestoreCollection<Vijest> = this.afs.collection('vijesti', ref => ref.orderBy('Datum', 'desc'));
      const collection$: Observable<Vijest[]> = collection.snapshotChanges().pipe(
          map(actions => {
              return actions.map(action  => {
          const data = action.payload.doc.data() as Vijest;
          data.Id = action.payload.doc.id;
          return data;
            });
          })
        );
      return collection$;
  }
  getFocused(): Observable<Vijest[]> {
    // tslint:disable-next-line: max-line-length
    const collection: AngularFirestoreCollection<Vijest> = this.afs.collection('vijesti', ref => ref.orderBy('Datum', 'desc').where('Fokus', '==', true));
    const collection$: Observable<Vijest[]> = collection.snapshotChanges().pipe(
        map(actions => {
            return actions.map(action  => {
        const data = action.payload.doc.data() as Vijest;
        data.Id = action.payload.doc.id;
        return data;
          });
        })
      );
    return collection$;
}
  getProducts(): Observable<Vijest[]> {
      const user = this.auth.auth.currentUser.displayName;
      let collection: AngularFirestoreCollection<Vijest>;
      if ( user === 'Rijad Dzanko') {
        collection = this.afs.collection('vijesti', ref => ref.orderBy('Datum', 'desc'));
      } else {
        collection = this.afs.collection('vijesti', ref => ref.orderBy('Datum', 'desc').where('Objava', '==', user));
      }
      const collection$: Observable<Vijest[]> = collection.snapshotChanges().pipe(
          map(actions => {
              return actions.map(action  => {
          const data = action.payload.doc.data() as Vijest;
          data.Id = action.payload.doc.id;
          return data;
            });
          })
        );
      return collection$;
  }
  getByKategorija(kategorija: string): Observable<Vijest[]> {
    let collection: AngularFirestoreCollection<Vijest>;
    if (kategorija !== 'Sve vijesti') {
      // tslint:disable-next-line: max-line-length
       collection = this.afs.collection('vijesti', ref => ref.where('Kategorija', '==', kategorija));
    } else {
      collection = this.afs.collection('vijesti');
    }
    const collection$: Observable<Vijest[]> = collection.snapshotChanges().pipe(
        map(actions => {
            return actions.map(action  => {
        const data = action.payload.doc.data() as Vijest;
        data.Id = action.payload.doc.id;
        return data;
          });
        })
      );
    return collection$;
  }
  updateKategorija(vijest: Vijest, kategorija: string) {
    vijest.Kategorija = kategorija;
    this.updateVijest(vijest.Id, vijest);
  }
  getVijest(category: string, id: string): Observable<Vijest> {
    this.vijestDoc = this.afs.doc<Vijest>(`${category}/${id}`);
    this.vijest = this.vijestDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as Vijest;
          data.Id = action.payload.id;
          return data;
        }
      })
    );
    return this.vijest;
  }
  getVijestValue(id: string) {
    return this.afs.doc<Vijest>(`vijesti/${id}`);
  }
  updateVijest(id: string, vijest: Vijest) {
    this.vijestDoc = this.afs.doc<Vijest>(`vijesti/${id}`);

    this.novaVijest = {
      Naslov: vijest.Naslov,
      Podnaslov: vijest.Podnaslov,
      Sadrzaj: vijest.Sadrzaj,
      Kategorija: vijest.Kategorija,
      Datum: vijest.Datum,
      Fokus: vijest.Fokus,
      Objava: vijest.Objava
    };
    this.vijestDoc.update(this.novaVijest).catch(err => {
      console.log(err);
    });
  }
  DodajVijest(vijest: Vijest) {
    const user = this.auth.auth.currentUser.displayName;
    const collection: AngularFirestoreCollection<Vijest> = this.afs.collection('vijesti');
    vijest.Objava = user;
    collection.add(vijest);
  }
  DeleteVijest(vijest: Vijest) {
    this.vijestDoc = this.afs.doc<Vijest>(`vijesti/${vijest.Id}`);
    this.vijestDoc.delete();
    this.imageService.deleteImage(vijest.Podnaslov, 'Vijesti');
  }
}
