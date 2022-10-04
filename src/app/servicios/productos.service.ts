import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore'
import { async } from '@firebase/util';
import { map } from 'rxjs/operators';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private coleccionProductos!: AngularFirestoreCollection<Producto>

  getProductos() {
    return this.coleccionProductos.snapshotChanges().pipe(map(action => action.map(a => a.payload.doc.data())));
  }
  constructor(private db: AngularFirestore) {
    this.coleccionProductos = db.collection('productos')
  }
  createProducto(nuevoProducto: Producto) {
    return new Promise(async (resolve, reject) => {
      try {
        const id = this.db.createId();
        nuevoProducto.idProducto = id;
        const respuesta = await this.coleccionProductos.doc(id).set(nuevoProducto);
        resolve(respuesta)
        //this.db.collection('productos').add(nuevoProducto)
      }
      catch (error) {
        reject(error)
      }
    })


  }
  editarProducto(idProducto: string, nuevosDatos: Producto) {
    return this.coleccionProductos.doc(idProducto).update(nuevosDatos)
  }
  deleteProducto(idProducto: string) {
    return new Promise(async(resolve, reject) => {
      try {
        const respuesta = await this.coleccionProductos.doc(idProducto).delete()
        resolve(respuesta)
      }
      catch (error) {
        reject(error)
      }
    }
    )

  }
}
