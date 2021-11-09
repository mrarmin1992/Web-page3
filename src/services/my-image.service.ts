import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class MyImageService {

  constructor(private afs: AngularFireStorage) { }

  public uploadImage(image: File, name: string, folder: string) {
    const basePath = `${folder}/`;
    const filePath = `${basePath}${name}`;
    const ref = this.afs.ref(filePath);
    const task = ref.put(image);
  }
  public deleteImage(name: string, folder: string) {
    const basePath = `${folder}/`;
    const filePath = `${basePath}${name}`;
    const ref = this.afs.ref(filePath);
    const task = ref.delete();
  }
}
