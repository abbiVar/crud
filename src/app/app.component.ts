import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Producto } from './models/producto';
import { ProductosService } from './servicios/productos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'crudAngular';
  productos!: Producto[];
  modalVisible: boolean = false;
  textoBoton!:string
  productoSeleccionado!:Producto
  eliminarVisible:boolean=false;
  nuevoProducto = new FormGroup({
    nombre: new FormControl('', Validators.required),
    precio: new FormControl(0, Validators.required),
    descripcion: new FormControl('', Validators.required),
    imagen: new FormControl('',Validators.required)
  })
  constructor(private servicioProductos: ProductosService) {

  }
  ngOnInit() {
    this.servicioProductos.getProductos().subscribe(producto => {
      this.productos = producto;
    })
  }
  agregarProducto() {
    if (this.nuevoProducto.valid) {
      let nuevoProducto: Producto = {
        nombre: this.nuevoProducto.value.nombre!,
        precio: this.nuevoProducto.value.precio!,
        idProducto: '',
        descripcion: this.nuevoProducto.value.descripcion!,
        imagen: this.nuevoProducto.value.imagen!
      }
      this.servicioProductos.createProducto(nuevoProducto).then(producto => {
        alert('producto agragado')
      })
        .catch(error => {
          alert('Ocurrio un error\nError: ' + error)
        })
    }else{
      alert('Falta completar algun espacio')
    }

  }
  mostrarDialogo() {
    this.modalVisible = true;
    this.textoBoton='Agregar Producto'
  }
  mostrarEditar(productoSeleccionado:Producto){
    this.productoSeleccionado=productoSeleccionado
    this.nuevoProducto.setValue({
      nombre:productoSeleccionado.nombre,
      precio: productoSeleccionado.precio,
      descripcion: productoSeleccionado.descripcion,
      imagen:productoSeleccionado.imagen
    })
    this.textoBoton= 'Actualizar Producto'
    this.modalVisible = true;
  }
  actualizarProducto(){
    let nuevoProducto: Producto = {
      nombre: this.nuevoProducto.value.nombre!,
      precio: this.nuevoProducto.value.precio!,
      idProducto: this.productoSeleccionado.idProducto,
      descripcion: this.nuevoProducto.value.descripcion!,
      imagen: this.nuevoProducto.value.imagen!
    }
    
    this.servicioProductos.editarProducto(this.productoSeleccionado.idProducto, nuevoProducto).then((resp)=>{
      alert('Producto Actualizado con exito')
    })
    .catch((error)=>{
      alert('No se pudo actualizar el producto \n Error: '+error)
    })
  }
  cargarProducto(){
    if(this.textoBoton==='Agregar Producto'){
      this.agregarProducto()
    }else if(this.textoBoton==='Actualizar Producto'){
      this.actualizarProducto()
    }
  }
  eliminarProducto(){
    this.servicioProductos.deleteProducto(this.productoSeleccionado.idProducto).then((resp)=>{
      alert("El producto fue eliminado con exito")
    })
    .catch((err)=>{
      alert("No se pudo eliminar el producto\n Error: "+err)
    })
    this.eliminarVisible=false
  }
  mostrarEliminar(producto:Producto){
    this.eliminarVisible=true;
    this.productoSeleccionado=producto
  }
  cargarImagen(event:any){
    let archivo = event.target.files[0]
    let reader = new FileReader()
  }
}
