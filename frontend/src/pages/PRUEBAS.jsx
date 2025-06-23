import { useRef } from "react"

const Prueba = (onClick) => {
  const dialogRef = useRef(null)

  const openModal = () => {
    dialogRef.current?.showModal()
  }

  const closeModal = () => {
    dialogRef.current?.close()
  }

  return (
    <>
      {/* primer boton */}
      <div className="p-4">
        <button onClick={openModal} className="bg-blue-600 text-white px-4 py-2 rounded">
          Abrir modal
        </button>

        <dialog ref={dialogRef} className="rounded-md p-6 shadow-lg backdrop:bg-black/40">
          <h2 className="text-lg font-bold mb-4">Modal con &lt;dialog&gt;</h2>
          <p>Este es un modal nativo en React usando la etiqueta &lt;dialog&gt;.</p>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={closeModal} className="bg-gray-300 px-4 py-2 rounded">
              Cerrar
            </button>
          </div>
        </dialog>
      </div>

      <h2>boton para ver comentarios</h2>

      {/* boton final */}

<button
      className="button-comentarios"
      data-tooltip="Ver comentarios"
      type="button"
      onClick={openModal}
    >
      <div className="button-comentarios-wrapper">
        <div className="text">Ver más</div>
        <span className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-plus-lg"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 
                 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
            />
          </svg>
        </span>
      </div>
    </button>



    </>
  )
}

export default Prueba