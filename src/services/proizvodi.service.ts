import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument  } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';
import { MyImageService } from '../services/my-image.service';
import { AngularFireAuth } from '@angular/fire/auth';

import { Proizvod } from '../models/Proizvod';

@Injectable({
  providedIn: 'root'
})
export class ProizvodiService {
  proizvodiCollection: AngularFirestoreCollection<Proizvod>;
  proizvodDoc: AngularFirestoreDocument<Proizvod>;
  proizvodi: Observable<Proizvod[]>;
  proizvod: Observable<Proizvod>;
  novaProizvod: Proizvod;
  constructor(private afs: AngularFirestore,
              private storage: AngularFireStorage,
              private imageService: MyImageService,
              private auth: AngularFireAuth) { }
  getProizvodi(): Observable<Proizvod[]> {
      // tslint:disable-next-line: max-line-length
      const collection: AngularFirestoreCollection<Proizvod> = this.afs.collection('proizvodi', ref => ref.orderBy('Datum', 'desc'));
      const collection$: Observable<Proizvod[]> = collection.snapshotChanges().pipe(
          map(actions => {
              return actions.map(action  => {
          const data = action.payload.doc.data() as Proizvod;
          data.Id = action.payload.doc.id;
          return data;
            });
          })
        );
      return collection$;
  }
  getFocused(): Observable<Proizvod[]> {
    // tslint:disable-next-line: max-line-length
    const collection: AngularFirestoreCollection<Proizvod> = this.afs.collection('proizvodi', ref => ref.orderBy('Datum', 'desc').where('Fokus', '==', true));
    const collection$: Observable<Proizvod[]> = collection.snapshotChanges().pipe(
        map(actions => {
            return actions.map(action  => {
        const data = action.payload.doc.data() as Proizvod;
        data.Id = action.payload.doc.id;
        return data;
          });
        })
      );
    return collection$;
}
  getProducts(): Observable<Proizvod[]> {
      const user = this.auth.auth.currentUser.displayName;
      let collection: AngularFirestoreCollection<Proizvod>;
      if ( user === 'Rijad Dzanko') {
        collection = this.afs.collection('proizvodi', ref => ref.orderBy('Datum', 'desc'));
      } else {
        collection = this.afs.collection('proizvodi', ref => ref.orderBy('Datum', 'desc').where('Objava', '==', user));
      }
      const collection$: Observable<Proizvod[]> = collection.snapshotChanges().pipe(
          map(actions => {
              return actions.map(action  => {
          const data = action.payload.doc.data() as Proizvod;
          data.Id = action.payload.doc.id;
          return data;
            });
          })
        );
      return collection$;
  }
  getByKategorija(kategorija: string): Observable<Proizvod[]> {
    let collection: AngularFirestoreCollection<Proizvod>;
    if (kategorija !== 'Svi proizvodi') {
      // tslint:disable-next-line: max-line-length
       collection = this.afs.collection('proizvodi', ref => ref.where('Kategorija', '==', kategorija));
    } else {
      collection = this.afs.collection('proizvodi');
    }
    const collection$: Observable<Proizvod[]> = collection.snapshotChanges().pipe(
        map(actions => {
            return actions.map(action  => {
        const data = action.payload.doc.data() as Proizvod;
        data.Id = action.payload.doc.id;
        return data;
          });
        })
      );
    return collection$;
  }
  updateKategorija(proizvod: Proizvod, kategorija: string) {
    proizvod.Kategorija = kategorija;
    this.updateProizvod(proizvod.Id, proizvod);
  }
  getProizvod(category: string, id: string): Observable<Proizvod> {
    this.proizvodDoc = this.afs.doc<Proizvod>(`${category}/${id}`);
    this.proizvod = this.proizvodDoc.snapshotChanges().pipe(
      map(action => {
        if (action.payload.exists === false) {
          return null;
        } else {
          const data = action.payload.data() as Proizvod;
          data.Id = action.payload.id;
          return data;
        }
      })
    );
    return this.proizvod;
  }
  getProizvodValue(id: string) {
    return this.afs.doc<Proizvod>(`proizvodi/${id}`);
  }
  updateProizvod(id: string, proizvod: Proizvod) {
    this.proizvodDoc = this.afs.doc<Proizvod>(`proizvodi/${id}`);

    this.novaProizvod = {
      Naslov: proizvod.Naslov,
      Podnaslov: proizvod.Podnaslov,
      Sadrzaj: proizvod.Sadrzaj,
      Kategorija: proizvod.Kategorija,
      Datum: proizvod.Datum,
      Fokus: proizvod.Fokus,
      Objava: proizvod.Objava
    };
    this.proizvodDoc.update(this.novaProizvod).catch(err => {
      console.log(err);
    });
  }
  DodajProizvod(proizvod: Proizvod) {
    const user = this.auth.auth.currentUser.displayName;
    const collection: AngularFirestoreCollection<Proizvod> = this.afs.collection('proizvodi');
    proizvod.Objava = user;
    collection.add(proizvod);
  }
  DeleteProizvod(proizvod: Proizvod) {
    this.proizvodDoc = this.afs.doc<Proizvod>(`proizvodi/${proizvod.Id}`);
    this.proizvodDoc.delete();
    this.imageService.deleteImage(proizvod.Podnaslov, 'Proizvodi');
  }
}
