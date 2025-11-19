 const modalNoticias = document.getElementById('modalNoticias')
        modalNoticias.addEventListener('show.bs.modal', function (event) {
            const trigger = event.relatedTarget
            const title = trigger.querySelector('.carousel-caption h5')
            const text = trigger.querySelector('.carousel-caption p')

            const modalTitle = modalNoticias.querySelector('.modal-title')
            const modalBody = modalNoticias.querySelector('.modal-body')

            modalTitle.textContent = title ? title.textContent : ''
            modalBody.textContent = text ? text.textContent : ''
        })