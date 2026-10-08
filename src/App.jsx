import './App.css'
import Encabezado from './components/Encabezado'
import ListaProductos from './components/ListaProductos'
import Carrito from './components/Carrito'

function App() {
    return (
        <div className="app">
            <Encabezado />

            <main className="contenido">
                <ListaProductos />
                <Carrito />
            </main>
        </div>
    )
}

export default App