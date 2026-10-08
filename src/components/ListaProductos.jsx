import { useEffect, useState } from 'react'
import { productos as productosLocales } from '../data/productos'
import { useCarritoStore } from '../store/useCarritoStore'

function ListaProductos() {
    const [productos, setProductos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState('')
    const [origen, setOrigen] = useState('api')
    const agregarProducto = useCarritoStore((state) => state.agregarProducto)

    useEffect(() => {
        const controlador = new AbortController()

        async function cargarProductos() {
        setCargando(true)
        setError('')

        if (origen === 'local') {
            setProductos(productosLocales)
            setCargando(false)
            return
        }

        try {
            const respuesta = await fetch('https://fakestoreapi.com/products', {
                signal: controlador.signal,
            })

            if (!respuesta.ok) {
                throw new Error('No se pudieron cargar los productos')
            }

            const datos = await respuesta.json()
            const productosAdaptados = datos.map((producto) => ({
            id: producto.id,
            nombre: producto.title,
            precio: producto.price,
        }))

        setProductos(productosAdaptados)
        }   catch (error) {
                if (error.name !== 'AbortError') {
                setError('No se pudieron cargar los productos. Intenta nuevamente.')
            }
        }   finally {
                if (!controlador.signal.aborted) {
                setCargando(false)
            }
        }        }

        cargarProductos()

        return () => controlador.abort()
    }, [origen])

    return (
        <section className="panel">
            <h2>Productos</h2>

            <div className="fuentes-productos">
              <button
                className={`btn ${origen === 'api' ? 'btn-primario' : 'btn-secundario'}`}
                onClick={() => setOrigen('api')}
                type="button"
              >
                Usar API
              </button>
              <button
                className={`btn ${origen === 'local' ? 'btn-primario' : 'btn-secundario'}`}
                onClick={() => setOrigen('local')}
                type="button"
              >
                Usar datos locales
              </button>
            </div>

            {cargando && <p className="vacio">Cargando productos...</p>}
            {error && <p className="vacio">{error}</p>}

            {productos.map((producto) => (
                <div key={producto.id} className="fila">
                    <div>
                        <p className="fila-nombre">{producto.nombre}</p>
                        <p className="fila-detalle">${producto.precio.toLocaleString('es-CO')}</p>
                    </div>

                    <button
                        className="btn btn-primario"
                        onClick={() => agregarProducto(producto)}>
                        Agregar
                    </button>
                </div>
            ))}
        </section>
    )
}

export default ListaProductos