// Variable global para almacenar la sede asignada
let sedeAsignada = '';

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const mainApp = document.getElementById('mainApp');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const currentUser = document.getElementById('currentUser');
    
    // Elementos de navegación
    const navRegistrarEntrada = document.getElementById('navRegistrarEntrada');
    const navEntradasActivas = document.getElementById('navEntradasActivas');
    const navConsultas = document.getElementById('navConsultas');
    const navEstadisticas = document.getElementById('navEstadisticas');
    const navEstadisticasItem = document.getElementById('navEstadisticasItem');
    
    // Secciones
    const registrarEntradaSection = document.getElementById('registrarEntradaSection');
    const entradasActivasSection = document.getElementById('entradasActivasSection');
    const consultasSection = document.getElementById('consultasSection');
    const estadisticasSection = document.getElementById('estadisticasSection');
    
    // Formularios
    const searchStudentForm = document.getElementById('searchStudentForm');
    const studentInfo = document.getElementById('studentInfo');
    const entryForm = document.getElementById('entryForm');
    
    // Botones de acción
    const refreshActiveBtn = document.getElementById('refreshActiveBtn');
    const searchDateBtn = document.getElementById('searchDateBtn');
    const searchTermBtn = document.getElementById('searchTermBtn');
    
    // Verificar autenticación al cargar la página
    const checkAuth = async () => {
        if (auth.isAuthenticated()) {
            // Validar token
            const isValid = await auth.validateToken();
            if (isValid) {
                // Mostrar la aplicación principal
                showAuthenticatedUI();
            } else {
                // Mostrar formulario de login
                showLoginForm();
            }
        } else {
            // Mostrar formulario de login
            showLoginForm();
        }
    };
    
    // Mostrar la interfaz autenticada según el tipo de usuario
    const showAuthenticatedUI = () => {
        loginForm.classList.add('d-none');
        mainApp.classList.remove('d-none');
        
        // Mostrar usuario actual
        const user = auth.getUser();
        if (user) {
            currentUser.textContent = user.usuario;
            
            // Configurar la interfaz según el usuario
            configureUIByUser(user.usuario);
        }
    };
    
    // Configurar la interfaz según el usuario
    const configureUIByUser = (username) => {
        // Ocultar todas las secciones y opciones de navegación por defecto
        registrarEntradaSection.classList.add('d-none');
        entradasActivasSection.classList.add('d-none');
        consultasSection.classList.add('d-none');
        
        navRegistrarEntrada.parentElement.classList.add('d-none');
        navEntradasActivas.parentElement.classList.add('d-none');
        navConsultas.parentElement.classList.add('d-none');
        
        // Configurar según el usuario
        if (username === 'entradabecl') {
            // Usuario de sede Principal
            navRegistrarEntrada.parentElement.classList.remove('d-none');
            navRegistrarEntrada.classList.add('active');
            registrarEntradaSection.classList.remove('d-none');
            
            // Ocultar el selector de sede y mostrar un texto informativo
            const sedeContainer = document.getElementById('sede').parentElement;
            const sedeLabel = sedeContainer.querySelector('label');
            
            // Guardar el valor de sede para usarlo en el formulario
            sedeAsignada = 'Principal';
            
            // Crear un elemento para mostrar la sede asignada
            const sedeInfo = document.createElement('div');
            sedeInfo.classList.add('alert', 'alert-info', 'mt-2');
            sedeInfo.innerHTML = '<strong>Sede asignada:</strong> Principal';
            
            // Reemplazar el selector con el texto informativo
            sedeContainer.innerHTML = '';
            sedeContainer.appendChild(sedeLabel);
            sedeContainer.appendChild(sedeInfo);
            
        } else if (username === 'entradabecle') {
            // Usuario de sede Enfermería
            navRegistrarEntrada.parentElement.classList.remove('d-none');
            navRegistrarEntrada.classList.add('active');
            registrarEntradaSection.classList.remove('d-none');
            
            // Ocultar el selector de sede y mostrar un texto informativo
            const sedeContainer = document.getElementById('sede').parentElement;
            const sedeLabel = sedeContainer.querySelector('label');
            
            // Guardar el valor de sede para usarlo en el formulario
            sedeAsignada = 'Enfermeria';
            
            // Crear un elemento para mostrar la sede asignada
            const sedeInfo = document.createElement('div');
            sedeInfo.classList.add('alert', 'alert-info', 'mt-2');
            sedeInfo.innerHTML = '<strong>Sede asignada:</strong> Enfermería';
            
            // Reemplazar el selector con el texto informativo
            sedeContainer.innerHTML = '';
            sedeContainer.appendChild(sedeLabel);
            sedeContainer.appendChild(sedeInfo);
            
        } else if (username === 'adminbecl') {
            // Usuario administrador - ve todos los registros
            // Mostrar todas las opciones de navegación para el administrador
            navRegistrarEntrada.parentElement.classList.add('d-none');
            navEntradasActivas.parentElement.classList.remove('d-none');
            navConsultas.parentElement.classList.remove('d-none');
            
            // Activar la sección de consultas por defecto
            navConsultas.classList.add('active');
            consultasSection.classList.remove('d-none');
            
            // Modificar el título para indicar que es la vista de administrador
            const consultasHeader = document.querySelector('#consultasSection .card-header h5');
            if (consultasHeader) {
                consultasHeader.textContent = 'Panel de Administración - Todos los Registros';
            }
            
            // Mostrar los filtros de fecha y búsqueda
            const tabsContainer = document.getElementById('consultasTabs');
            if (tabsContainer) {
                tabsContainer.classList.remove('d-none');
            }
            
            const tabContent = document.querySelector('.tab-content');
            if (tabContent) {
                tabContent.classList.remove('d-none');
            }
            
            // Añadir una barra de búsqueda general encima de los tabs
            const searchContainer = document.createElement('div');
            searchContainer.className = 'mb-4';
            searchContainer.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h6 class="card-title">Búsqueda rápida</h6>
                        <div class="input-group">
                            <input type="text" id="generalSearchInput" class="form-control" placeholder="Buscar por nombre, código, correo...">
                            <button id="generalSearchBtn" class="btn btn-danger">Buscar</button>
                        </div>
                    </div>
                </div>
            `;
            
            // Insertar la barra de búsqueda antes de los tabs
            if (tabsContainer && tabsContainer.parentNode) {
                tabsContainer.parentNode.insertBefore(searchContainer, tabsContainer);
            }
            
            // Crear un contenedor para la paginación
            const paginationContainer = document.createElement('div');
            paginationContainer.id = 'paginationContainer';
            paginationContainer.className = 'my-3';
            
            // Añadir el contenedor de paginación antes de la tabla
            const tableContainer = document.querySelector('#consultasSection .table-responsive');
            if (tableContainer && tableContainer.parentNode) {
                tableContainer.parentNode.insertBefore(paginationContainer, tableContainer);
            }
            
            // Cargar todos los registros automáticamente
            loadAllEntries();
            
            // Añadir un indicador de carga
            const loadingIndicator = document.createElement('div');
            loadingIndicator.id = 'loadingIndicator';
            loadingIndicator.className = 'text-center my-3';
            loadingIndicator.innerHTML = '<div class="spinner-border text-danger" role="status"><span class="visually-hidden">Cargando...</span></div><p class="mt-2">Cargando todos los registros...</p>';
            
            if (tableContainer && tableContainer.parentNode) {
                tableContainer.parentNode.insertBefore(loadingIndicator, tableContainer);
            }
            
        } else if (username === 'computobecl') {
            // Usuario de cómputo - mostrar la sección de gestión de equipos
            // Mostrar la sección de cómputo que ya existe en el HTML
            const computoSection = document.getElementById('computoSection');
            if (computoSection) {
                // Ocultar otras secciones
                registrarEntradaSection.classList.add('d-none');
                entradasActivasSection.classList.add('d-none');
                consultasSection.classList.add('d-none');
                estadisticasSection.classList.add('d-none');
                
                // Mostrar la sección de cómputo
                computoSection.classList.remove('d-none');
                
                // Cambiar el color del encabezado a rojo para mantener consistencia
                const cardHeader = computoSection.querySelector('.card-header');
                if (cardHeader) {
                    cardHeader.classList.remove('bg-primary');
                    cardHeader.classList.add('bg-danger');
                }
                
                // Cargar equipos disponibles al iniciar
                loadAvailableEquipment();
            }
        }
    };
    
    // Mostrar formulario de login
    const showLoginForm = () => {
        loginForm.classList.remove('d-none');
        mainApp.classList.add('d-none');
    };
    
    // Mostrar una sección específica
    const showSection = (section) => {
        if (!section) {
            console.error('Error: La sección no existe');
            return;
        }
        
        // Ocultar todas las secciones
        if (registrarEntradaSection) registrarEntradaSection.classList.add('d-none');
        if (entradasActivasSection) entradasActivasSection.classList.add('d-none');
        if (consultasSection) consultasSection.classList.add('d-none');
        if (estadisticasSection) estadisticasSection.classList.add('d-none');
        
        // Desactivar todos los enlaces de navegación
        if (navRegistrarEntrada) navRegistrarEntrada.classList.remove('active');
        if (navEntradasActivas) navEntradasActivas.classList.remove('active');
        if (navConsultas) navConsultas.classList.remove('active');
        if (navEstadisticas) navEstadisticas.classList.remove('active');
        
        // Mostrar la sección solicitada
        section.classList.remove('d-none');
        
        // Activar el enlace correspondiente
        if (section === registrarEntradaSection && navRegistrarEntrada) {
            navRegistrarEntrada.classList.add('active');
            // Ocultar info de estudiante cuando cambiamos a esta sección
            if (studentInfo) studentInfo.classList.add('d-none');
            if (searchStudentForm) searchStudentForm.reset();
        } else if (section === entradasActivasSection && navEntradasActivas) {
            navEntradasActivas.classList.add('active');
            loadActiveEntries(); // Cargar entradas activas
        } else if (section === consultasSection && navConsultas) {
            navConsultas.classList.add('active');
            // Inicializar fechas para consulta
            const today = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(today.getDate() - 7);
            
            const fechaInicio = document.getElementById('fechaInicio');
            const fechaFin = document.getElementById('fechaFin');
            
            if (fechaInicio) fechaInicio.value = oneWeekAgo.toISOString().split('T')[0];
            if (fechaFin) fechaFin.value = today.toISOString().split('T')[0];
        } else if (section === estadisticasSection && navEstadisticas) {
            navEstadisticas.classList.add('active');
            // Inicializar fechas y años para los formularios de estadísticas
            const today = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(today.getMonth() - 1);
            
            // Inicializar fechas para estadísticas por programa
            const estProgFechaInicio = document.getElementById('estProgFechaInicio');
            const estProgFechaFin = document.getElementById('estProgFechaFin');
            
            if (estProgFechaInicio) estProgFechaInicio.value = oneMonthAgo.toISOString().split('T')[0];
            if (estProgFechaFin) estProgFechaFin.value = today.toISOString().split('T')[0];
            
            // Inicializar fechas para estadísticas semanales
            const estSemanalFechaInicio = document.getElementById('estSemanalFechaInicio');
            const estSemanalFechaFin = document.getElementById('estSemanalFechaFin');
            
            if (estSemanalFechaInicio) estSemanalFechaInicio.value = oneMonthAgo.toISOString().split('T')[0];
            if (estSemanalFechaFin) estSemanalFechaFin.value = today.toISOString().split('T')[0];
            
            // Inicializar selector de años para estadísticas mensuales
            const yearSelect = document.getElementById('estMensualYear');
            if (yearSelect && yearSelect.options.length === 0) { // Solo llenar si está vacío
                const currentYear = today.getFullYear();
                for (let year = currentYear; year >= currentYear - 5; year--) {
                    const option = document.createElement('option');
                    option.value = year;
                    option.textContent = year;
                    yearSelect.appendChild(option);
                }
            }
        }
    };
    
    // Buscar estudiante por código y registrar entrada inmediatamente
    const searchAndRegisterStudent = async (code) => {
        try {
            // Buscar estudiante
            const response = await entryService.findStudentByCode(code);
            
            if (response.status === 'success') {
                // Preparar datos para registro
                const entryData = {
                    nombre: response.student.nombre,
                    correo: response.student.correo,
                    codigo: response.student.codigo,
                    programa: response.student.programa || '',
                    facultad: response.student.facultad || '',
                    sede: sedeAsignada
                };
                
                // Registrar entrada inmediatamente
                const registerResponse = await entryService.registerEntry(entryData);
                
                if (registerResponse.status === 'success') {
                    // Mostrar notificación de éxito
                    Swal.fire({
                        icon: 'success',
                        title: 'Registro Exitoso',
                        text: 'Entrada registrada correctamente',
                        timer: 2000,
                        showConfirmButton: false
                    });
                    
                    // Mostrar información del estudiante
                    document.getElementById('studentName').textContent = response.student.nombre;
                    document.getElementById('studentEmail').textContent = response.student.correo;
                    document.getElementById('studentCodeInfo').textContent = response.student.codigo;
                    document.getElementById('studentProgram').textContent = response.student.programa || 'No especificado';
                    document.getElementById('studentFaculty').textContent = response.student.facultad || 'No especificado';
                    
                    // Mostrar la información del estudiante
                    studentInfo.classList.remove('d-none');
                    
                    // Ocultar el formulario de registro de entrada ya que no es necesario
                    entryForm.classList.add('d-none');
                    
                    // Limpiar el campo de código para el próximo registro
                    document.getElementById('studentCode').value = '';
                    
                    return true;
                } else {
                    // Mostrar mensaje de error en el registro
                    Swal.fire({
                        icon: 'error',
                        title: 'Error de Registro',
                        text: registerResponse.message || 'Error al registrar la entrada'
                    });
                    return false;
                }
            } else {
                // Mostrar mensaje de error al buscar estudiante
                Swal.fire({
                    icon: 'error',
                    title: 'Estudiante no encontrado',
                    text: response.message || 'No se encontró el estudiante con ese código'
                });
                
                // Ocultar información del estudiante
                studentInfo.classList.add('d-none');
                
                return false;
            }
        } catch (error) {
            console.error('Error al procesar el registro:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
            
            // Ocultar información del estudiante
            studentInfo.classList.add('d-none');
            
            return false;
        }
    };
    
    // Cargar entradas activas
    const loadActiveEntries = async () => {
        const sede = document.getElementById('sedeFilter').value;
        
        try {
            const response = await entryService.getActiveEntries(sede);
            
            if (response.status === 'success') {
                // Limpiar tabla
                const tableBody = document.getElementById('activeEntriesTable');
                tableBody.innerHTML = '';
                
                // Añadir filas a la tabla
                response.entries.forEach(entry => {
                    const row = document.createElement('tr');
                    
                    // Formatear fecha
                    const entryDate = new Date(entry.entrada);
                    const formattedDate = entryDate.toLocaleString('es-ES');
                    
                    row.innerHTML = `
                        <td>${entry.id}</td>
                        <td>${entry.nombre}</td>
                        <td>${entry.correo}</td>
                        <td>${entry.codigo || ''}</td>
                        <td>${formattedDate}</td>
                        <td>${entry.sede}</td>
                        <td>
                            <button class="btn btn-sm btn-danger exit-btn" data-id="${entry.id}">
                                Registrar Salida
                            </button>
                        </td>
                    `;
                    
                    tableBody.appendChild(row);
                });
                
                // Añadir event listeners para botones de salida
                document.querySelectorAll('.exit-btn').forEach(btn => {
                    btn.addEventListener('click', async (e) => {
                        const id = e.target.getAttribute('data-id');
                        registerExitHandler(id);
                    });
                });
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Error al cargar las entradas activas'
                });
            }
        } catch (error) {
            console.error('Error al cargar entradas activas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    };
    
    // Manejar registro de salida
    const registerExitHandler = async (id) => {
        // Confirmar acción
        const { isConfirmed } = await Swal.fire({
            icon: 'question',
            title: '¿Registrar salida?',
            text: '¿Está seguro de registrar la salida?',
            showCancelButton: true,
            confirmButtonText: 'Sí, registrar',
            cancelButtonText: 'Cancelar'
        });
        
        if (isConfirmed) {
            try {
                const response = await entryService.registerExit(id);
                
                if (response.status === 'success') {
                    // Mostrar mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Salida registrada exitosamente'
                    });
                    
                    // Recargar entradas activas
                    loadActiveEntries();
                } else {
                    // Mostrar mensaje de error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Error al registrar la salida'
                    });
                }
            } catch (error) {
                console.error('Error al registrar salida:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error de conexión con el servidor'
                });
            }
        }
    };
    
    // Cargar entradas por fecha
    const loadEntriesByDate = async () => {
        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;
        const sede = document.getElementById('sedeFecha').value;
        
        // Validar fechas
        if (!fechaInicio || !fechaFin) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Requeridos',
                text: 'Por favor, ingrese fechas de inicio y fin'
            });
            return;
        }
        
        try {
            const response = await entryService.getEntriesByDate(fechaInicio, fechaFin, sede);
            
            if (response.status === 'success') {
                // Mostrar resultados en la tabla
                renderConsultasTable(response.entries);
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Error al cargar las entradas'
                });
            }
        } catch (error) {
            console.error('Error al cargar entradas por fecha:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    };
    
    // Buscar entradas
    const searchEntries = async () => {
        const term = document.getElementById('searchTerm').value;
        
        // Validar término de búsqueda
        if (!term) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Requerido',
                text: 'Por favor, ingrese un término de búsqueda'
            });
            return;
        }
        
        try {
            const response = await entryService.searchEntry(term);
            
            if (response.status === 'success') {
                // Mostrar resultados en la tabla
                renderConsultasTable(response.entries);
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Error al buscar las entradas'
                });
            }
        } catch (error) {
            console.error('Error al buscar entradas:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    };
    
    // Variables para la paginación
    let allEntries = [];
    let currentPage = 1;
    const entriesPerPage = 10;
    
    // Cargar todos los registros
    const loadAllEntries = async () => {
        try {
            // Usamos la función existente getEntriesByDate con un rango muy amplio
            // Desde 2000-01-01 hasta la fecha actual + 1 día (para asegurar que incluya hoy)
            const today = new Date();
            today.setDate(today.getDate() + 1);
            
            const formatDate = (date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };
            
            const startDate = '2000-01-01';
            const endDate = formatDate(today);
            
            // Usar la función existente getEntriesByDate
            const response = await entryService.getEntriesByDate(startDate, endDate);
            
            if (response.status === 'success') {
                // Guardar todos los registros
                allEntries = response.entries;
                
                // Ordenar por ID de forma descendente (más recientes primero)
                allEntries.sort((a, b) => b.id - a.id);
                
                // Ocultar indicador de carga
                const loadingIndicator = document.getElementById('loadingIndicator');
                if (loadingIndicator) {
                    loadingIndicator.remove();
                }
                
                // Renderizar la primera página
                renderPaginatedEntries(1);
                
                // Crear la paginación
                createPagination();
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Error al cargar los registros'
                });
                
                // Ocultar indicador de carga
                const loadingIndicator = document.getElementById('loadingIndicator');
                if (loadingIndicator) {
                    loadingIndicator.remove();
                }
            }
        } catch (error) {
            console.error('Error al cargar todos los registros:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
            
            // Ocultar indicador de carga
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.remove();
            }
        }
    };
    
    // Crear la paginación
    const createPagination = () => {
        const paginationContainer = document.getElementById('paginationContainer');
        if (!paginationContainer) return;
        
        // Limpiar el contenedor
        paginationContainer.innerHTML = '';
        
        // Calcular el número total de páginas
        const totalPages = Math.ceil(allEntries.length / entriesPerPage);
        
        // Crear el elemento de paginación
        const pagination = document.createElement('nav');
        pagination.setAttribute('aria-label', 'Paginación de registros');
        
        const paginationList = document.createElement('ul');
        paginationList.className = 'pagination justify-content-center';
        
        // Botón Anterior
        const prevItem = document.createElement('li');
        prevItem.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        
        const prevLink = document.createElement('a');
        prevLink.className = 'page-link';
        prevLink.href = '#';
        prevLink.setAttribute('aria-label', 'Anterior');
        prevLink.innerHTML = '<span aria-hidden="true">&laquo;</span>';
        prevLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage > 1) {
                renderPaginatedEntries(currentPage - 1);
            }
        });
        
        prevItem.appendChild(prevLink);
        paginationList.appendChild(prevItem);
        
        // Números de página
        // Mostrar máximo 5 páginas en la paginación
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Ajustar si estamos cerca del final
        if (endPage - startPage < 4 && startPage > 1) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
            
            const pageLink = document.createElement('a');
            pageLink.className = 'page-link';
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.addEventListener('click', (e) => {
                e.preventDefault();
                renderPaginatedEntries(i);
            });
            
            pageItem.appendChild(pageLink);
            paginationList.appendChild(pageItem);
        }
        
        // Botón Siguiente
        const nextItem = document.createElement('li');
        nextItem.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        
        const nextLink = document.createElement('a');
        nextLink.className = 'page-link';
        nextLink.href = '#';
        nextLink.setAttribute('aria-label', 'Siguiente');
        nextLink.innerHTML = '<span aria-hidden="true">&raquo;</span>';
        nextLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentPage < totalPages) {
                renderPaginatedEntries(currentPage + 1);
            }
        });
        
        nextItem.appendChild(nextLink);
        paginationList.appendChild(nextItem);
        
        pagination.appendChild(paginationList);
        paginationContainer.appendChild(pagination);
        
        // Añadir información sobre el total de registros
        const infoText = document.createElement('div');
        infoText.className = 'text-center mt-2';
        infoText.innerHTML = `<small>Mostrando registros ${(currentPage - 1) * entriesPerPage + 1} a ${Math.min(currentPage * entriesPerPage, allEntries.length)} de ${allEntries.length} registros totales</small>`;
        paginationContainer.appendChild(infoText);
    };
    
    // Renderizar entradas paginadas
    const renderPaginatedEntries = (page) => {
        // Actualizar página actual
        currentPage = page;
        
        // Calcular índices
        const startIndex = (page - 1) * entriesPerPage;
        const endIndex = Math.min(startIndex + entriesPerPage, allEntries.length);
        
        // Obtener entradas para la página actual
        const paginatedEntries = allEntries.slice(startIndex, endIndex);
        
        // Renderizar entradas
        renderConsultasTable(paginatedEntries);
        
        // Actualizar paginación
        createPagination();
    };
    
    // Renderizar tabla de consultas
    const renderConsultasTable = (entries) => {
        // Limpiar tabla
        const tableBody = document.getElementById('consultasTable');
        tableBody.innerHTML = '';
        
        // Verificar si hay resultados
        if (entries.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sin Resultados',
                text: 'No se encontraron registros con los criterios especificados'
            });
            return;
        }
        
        // Añadir filas a la tabla
        entries.forEach(entry => {
            const row = document.createElement('tr');
            
            // Formatear fechas
            const entryDate = new Date(entry.entrada);
            const formattedEntryDate = entryDate.toLocaleString('es-ES');
            
            let formattedExitDate = '';
            if (entry.salida) {
                const exitDate = new Date(entry.salida);
                formattedExitDate = exitDate.toLocaleString('es-ES');
            }
            
            row.innerHTML = `
                <td>${entry.id}</td>
                <td>${entry.nombre}</td>
                <td>${entry.correo}</td>
                <td>${entry.codigo || ''}</td>
                <td>${formattedEntryDate}</td>
                <td>${formattedExitDate}</td>
                <td>${entry.sede}</td>
            `;
            
            tableBody.appendChild(row);
        });
    };
    
    // Función para realizar búsqueda general
    const performGeneralSearch = async () => {
        const searchTerm = document.getElementById('generalSearchInput').value.trim();
        
        if (!searchTerm) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Requerido',
                text: 'Por favor, ingrese un término de búsqueda'
            });
            return;
        }
        
        try {
            // Mostrar indicador de carga
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'block';
            } else {
                // Crear indicador de carga si no existe
                const newLoadingIndicator = document.createElement('div');
                newLoadingIndicator.id = 'loadingIndicator';
                newLoadingIndicator.className = 'text-center my-3';
                newLoadingIndicator.innerHTML = '<div class="spinner-border text-danger" role="status"><span class="visually-hidden">Buscando...</span></div><p class="mt-2">Buscando registros...</p>';
                
                const tableContainer = document.querySelector('#consultasSection .table-responsive');
                if (tableContainer && tableContainer.parentNode) {
                    tableContainer.parentNode.insertBefore(newLoadingIndicator, tableContainer);
                }
            }
            
            // Realizar búsqueda
            const response = await entryService.searchEntry(searchTerm);
            
            // Ocultar indicador de carga
            const updatedLoadingIndicator = document.getElementById('loadingIndicator');
            if (updatedLoadingIndicator) {
                updatedLoadingIndicator.style.display = 'none';
            }
            
            if (response.status === 'success') {
                // Actualizar registros y paginación
                allEntries = response.entries;
                
                // Ordenar por ID de forma descendente
                allEntries.sort((a, b) => b.id - a.id);
                
                // Renderizar primera página
                renderPaginatedEntries(1);
                
                // Mostrar mensaje con el número de resultados
                Swal.fire({
                    icon: 'success',
                    title: 'Búsqueda Completada',
                    text: `Se encontraron ${allEntries.length} registros para "${searchTerm}"`,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Error al realizar la búsqueda'
                });
            }
        } catch (error) {
            console.error('Error en búsqueda general:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
            
            // Ocultar indicador de carga
            const loadingIndicator = document.getElementById('loadingIndicator');
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
        }
    };
    
    // Función para buscar estudiante para asignación de equipo
    const searchStudentForCompute = async (code) => {
        try {
            // Mostrar indicador de carga
            Swal.fire({
                title: 'Buscando estudiante...',
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            });
            
            // Llamar al servicio de cómputo para buscar estudiante
            const response = await computoService.findStudentByCode(code);
            
            Swal.close();
            
            if (response.status === 'success') {
                // Mostrar información del estudiante
                const student = response.student;
                document.getElementById('studentNameCompute').textContent = student.nombre || '';
                document.getElementById('studentEmailCompute').textContent = student.correo || '';
                document.getElementById('studentCodeInfoCompute').textContent = student.codigo || '';
                document.getElementById('studentProgramCompute').textContent = student.programa || '';
                document.getElementById('studentFacultyCompute').textContent = student.facultad || '';
                
                // Guardar datos en campos ocultos
                document.getElementById('nombreCompute').value = student.nombre || '';
                document.getElementById('correoCompute').value = student.correo || '';
                document.getElementById('codigoCompute').value = student.codigo || '';
                document.getElementById('programaCompute').value = student.programa || '';
                document.getElementById('facultadCompute').value = student.facultad || '';
                
                // Mostrar el formulario de entrada
                document.getElementById('studentInfoCompute').classList.remove('d-none');
                
                // Cargar equipos disponibles
                loadAvailableEquipment();
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'No se encontró el estudiante'
                });
                
                // Ocultar información del estudiante
                document.getElementById('studentInfoCompute').classList.add('d-none');
            }
        } catch (error) {
            console.error('Error al buscar estudiante:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al buscar el estudiante'
            });
        }
    };
    
    // Función para cargar equipos disponibles
    const loadAvailableEquipment = async () => {
        try {
            // Llamar al servicio de cómputo para obtener equipos disponibles
            const data = await computoService.getAvailableEquipos();
            
            // Obtener el selector de equipos
            const equipoSelect = document.getElementById('equipoSelect');
            
            // Limpiar opciones actuales
            equipoSelect.innerHTML = '<option value="">Seleccione un equipo</option>';
            
            // Añadir equipos disponibles
            if (data.status === 'success' && data.equipos && data.equipos.length > 0) {
                data.equipos.forEach(equipo => {
                    const option = document.createElement('option');
                    option.value = equipo.id;
                    option.textContent = `${equipo.equipo}`;
                    equipoSelect.appendChild(option);
                });
            } else {
                // Añadir mensaje si no hay equipos disponibles
                const option = document.createElement('option');
                option.disabled = true;
                option.textContent = 'No hay equipos disponibles';
                equipoSelect.appendChild(option);
            }
        } catch (error) {
            console.error('Error al cargar equipos disponibles:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar los equipos disponibles'
            });
        }
    };
    
    // Función para registrar entrada de equipo
    const registerComputeEntry = async () => {
        try {
            // Obtener datos del formulario
            const nombre = document.getElementById('nombreCompute').value;
            const correo = document.getElementById('correoCompute').value;
            const codigo = document.getElementById('codigoCompute').value;
            const programa = document.getElementById('programaCompute').value;
            const facultad = document.getElementById('facultadCompute').value;
            const equipoId = document.getElementById('equipoSelect').value;
            
            // Validar que se haya seleccionado un equipo
            if (!equipoId) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atención',
                    text: 'Por favor seleccione un equipo'
                });
                return;
            }
            
            // Mostrar indicador de carga
            Swal.fire({
                title: 'Registrando entrada...',
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            });
            
            // Preparar datos para enviar
            const data = await computoService.registerEntryEquipo({
                nombre,
                correo,
                codigo,
                programa,
                facultad,
                equipo: equipoId // Enviamos el ID del equipo como 'equipo' para que coincida con el backend
            });
            
            Swal.close();
            
            if (data.status === 'success') {
                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Entrada registrada correctamente'
                });
                
                // Limpiar formulario
                document.getElementById('searchStudentComputeForm').reset();
                document.getElementById('studentInfoCompute').classList.add('d-none');
                
                // Recargar equipos disponibles
                loadAvailableEquipment();
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: data.message || 'No se pudo registrar la entrada'
                });
            }
        } catch (error) {
            console.error('Error al registrar entrada:', error);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al registrar la entrada'
            });
        }
    };
    
    // Función para cargar entradas activas de equipos
    const loadActiveComputeEntries = async () => {
        try {
            // Mostrar indicador de carga
            Swal.fire({
                title: 'Cargando entradas activas...',
                didOpen: () => {
                    Swal.showLoading();
                },
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            });
            
            // Llamar al servicio de cómputo para obtener entradas activas
            const data = await computoService.getActiveEntriesEquipo();
            
            Swal.close();
            
            // Obtener la tabla
            const tableBody = document.getElementById('activeEntriesComputeTable');
            
            // Limpiar tabla
            if (tableBody) {
                tableBody.innerHTML = '';
            } else {
                console.error('No se encontró el elemento con ID "activeEntriesComputeTable"');
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al cargar la tabla de entradas activas'
                });
                return;
            }
            
            // Añadir entradas a la tabla
            if (data.status === 'success' && data.entries && data.entries.length > 0) {
                data.entries.forEach(entry => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${entry.id}</td>
                        <td>${entry.nombre}</td>
                        <td>${entry.correo}</td>
                        <td>${entry.codigo}</td>
                        <td>${entry.numero_equipo}</td>
                        <td>${entry.entrada}</td>
                        <td>
                            <button class="btn btn-sm btn-danger register-exit-compute" data-id="${entry.id}">
                                <i class="fas fa-sign-out-alt"></i> Salida
                            </button>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
                
                // Añadir event listeners a los botones de salida
                document.querySelectorAll('.register-exit-compute').forEach(button => {
                    button.addEventListener('click', function() {
                        const entryId = this.getAttribute('data-id');
                        registerComputeExit(entryId);
                    });
                });
            } else {
                // Mostrar mensaje si no hay entradas activas
                const row = document.createElement('tr');
                row.innerHTML = `<td colspan="7" class="text-center">No hay entradas activas</td>`;
                tableBody.appendChild(row);
            }
        } catch (error) {
            console.error('Error al cargar entradas activas:', error);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudieron cargar las entradas activas'
            });
        }
    };
    
    // Función para registrar salida de equipo
    const registerComputeExit = async (entryId) => {
        try {
            // Confirmar acción
            const result = await Swal.fire({
                title: '¿Registrar salida?',
                text: '¿Está seguro de registrar la salida de este equipo?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, registrar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#dc3545'
            });
            
            if (result.isConfirmed) {
                // Mostrar indicador de carga
                Swal.fire({
                    title: 'Registrando salida...',
                    didOpen: () => {
                        Swal.showLoading();
                    },
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false
                });
                
                // Llamar al servicio de cómputo para registrar salida
                const data = await computoService.registerExitEquipo(entryId);
                
                Swal.close();
                
                if (data.status === 'success') {
                    // Mostrar mensaje de éxito
                    Swal.fire({
                        icon: 'success',
                        title: 'Éxito',
                        text: 'Salida registrada correctamente'
                    });
                    
                    // Recargar entradas activas
                    loadActiveComputeEntries();
                    
                    // Recargar equipos disponibles
                    loadAvailableEquipment();
                } else {
                    // Mostrar mensaje de error
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: data.message || 'No se pudo registrar la salida'
                    });
                }
            }
        } catch (error) {
            console.error('Error al registrar salida:', error);
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al registrar la salida'
            });
        }
    };
    
    // Event Listeners
    
    // Login
    loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validar campos
        if (!username || !password) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Requeridos',
                text: 'Usuario y contraseña son requeridos'
            });
            return;
        }
        
        // Intentar login
        const result = await auth.login(username, password);
        
        if (result.success) {
            // Mostrar la aplicación principal
            showAuthenticatedUI();
        } else {
            // Mostrar mensaje de error
            Swal.fire({
                icon: 'error',
                title: 'Error de Autenticación',
                text: result.message || 'Credenciales inválidas'
            });
        }
    });
    
    // Logout
    logoutBtn.addEventListener('click', async () => {
        await auth.logout();
        showLoginForm();
    });
    
    // Navegación
    navRegistrarEntrada.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(registrarEntradaSection);
    });
    
    navEntradasActivas.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(entradasActivasSection);
    });
    
    navConsultas.addEventListener('click', (e) => {
        e.preventDefault();
        showSection(consultasSection);
    });
    
    // Event listener para la sección de estadísticas
    if (navEstadisticas) {
        navEstadisticas.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(estadisticasSection);
        });
    }
    
    // Buscar y registrar estudiante
    searchStudentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const code = document.getElementById('studentCode').value;
        
        if (!code) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Requerido',
                text: 'Por favor, ingrese el código del estudiante'
            });
            return;
        }
        
        await searchAndRegisterStudent(code);
    });
    
    // Registro de entrada
    entryForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Usar la sede asignada globalmente en lugar de intentar obtenerla del elemento eliminado
        const sede = sedeAsignada;
        if (!sede) {
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'No se pudo determinar la sede asignada'
            });
            return;
        }
        
        // Obtener datos del formulario
        const entryData = {
            nombre: document.getElementById('nombre').value,
            correo: document.getElementById('correo').value,
            codigo: document.getElementById('codigo').value,
            programa: document.getElementById('programa').value,
            facultad: document.getElementById('facultad').value,
            sede: sede
        };
        
        try {
            const response = await entryService.registerEntry(entryData);
            
            if (response.status === 'success') {
                // Mostrar mensaje de éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Entrada registrada exitosamente'
                });
                
                // Limpiar formularios
                entryForm.reset();
                searchStudentForm.reset();
                studentInfo.classList.add('d-none');
            } else {
                // Mostrar mensaje de error
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message || 'Error al registrar la entrada'
                });
            }
        } catch (error) {
            console.error('Error al registrar entrada:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    });
    
    // Botón de actualizar entradas activas
    refreshActiveBtn.addEventListener('click', loadActiveEntries);
    
    // Botón de búsqueda por fecha
    searchDateBtn.addEventListener('click', loadEntriesByDate);
    
    // Botón de búsqueda por término
    searchTermBtn.addEventListener('click', searchEntries);
    
    // Botón de exportación a Excel en la sección de consultas
    if (document.getElementById('exportConsultasExcel')) {
        document.getElementById('exportConsultasExcel').addEventListener('click', async () => {
            // Obtener los parámetros de filtro actuales
            const fechaInicio = document.getElementById('fechaInicio').value;
            const fechaFin = document.getElementById('fechaFin').value;
            const sede = document.getElementById('sedeFecha').value;
            const searchTerm = document.getElementById('searchTerm')?.value || '';
            
            try {
                // Mostrar indicador de carga
                Swal.fire({
                    title: 'Generando Excel',
                    text: 'Por favor espere mientras se genera el archivo...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                // Llamar al servicio de estadísticas para exportar a Excel
                const response = await statsService.exportToExcel('consultas', {
                    fechaInicio,
                    fechaFin,
                    sede,
                    searchTerm
                });
                
                // La función exportToExcel ya maneja la descarga y los mensajes
            } catch (error) {
                console.error('Error al exportar consultas a Excel:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error de conexión con el servidor'
                });
            }
        });
    }
    
    // Manejadores de eventos para los formularios de estadísticas
    if (document.getElementById('estProgramasForm')) {
        document.getElementById('estProgramasForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fechaInicio = document.getElementById('estProgFechaInicio').value;
            const fechaFin = document.getElementById('estProgFechaFin').value;
            const sede = document.getElementById('estProgSede').value;
            
            try {
                // Mostrar indicador de carga
                Swal.fire({
                    title: 'Generando estadísticas',
                    text: 'Por favor espere...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                const response = await statsService.getStatsByProgram(fechaInicio, fechaFin, sede);
                
                Swal.close();
                
                if (response.status === 'success') {
                    statsService.renderProgramChart(response.data);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Error al obtener estadísticas'
                    });
                }
            } catch (error) {
                console.error('Error al generar estadísticas por programa:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error de conexión con el servidor'
                });
            }
        });
        
        // Exportar a Excel - Programas
        document.getElementById('exportProgExcel').addEventListener('click', async () => {
            const fechaInicio = document.getElementById('estProgFechaInicio').value;
            const fechaFin = document.getElementById('estProgFechaFin').value;
            const sede = document.getElementById('estProgSede').value;
            
            try {
                Swal.fire({
                    title: 'Generando Excel',
                    text: 'Por favor espere...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                const response = await statsService.exportToExcel('programas', {
                    fechaInicio,
                    fechaFin,
                    sede
                });
                
                Swal.close();
                
                if (response.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Excel Generado',
                        text: 'El archivo Excel se ha generado correctamente',
                        footer: `<a href="${response.file_url}" target="_blank" class="btn btn-success">Descargar Excel</a>`
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Error al generar Excel'
                    });
                }
            } catch (error) {
                console.error('Error al exportar a Excel:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error de conexión con el servidor'
                });
            }
        });
    }
    
    // Estadísticas mensuales
    if (document.getElementById('estMensualForm')) {
        document.getElementById('estMensualForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const year = document.getElementById('estMensualYear').value;
            const sede = document.getElementById('estMensualSede').value;
            
            try {
                Swal.fire({
                    title: 'Generando estadísticas',
                    text: 'Por favor espere...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                const response = await statsService.getMonthlyStats(year, sede);
                
                Swal.close();
                
                if (response.status === 'success') {
                    statsService.renderMonthlyChart(response.data);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Error al obtener estadísticas'
                    });
                }
            } catch (error) {
                console.error('Error al generar estadísticas mensuales:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error de conexión con el servidor'
                });
            }
        });
        
        // Exportar a Excel - Mensual
        document.getElementById('exportMensualExcel').addEventListener('click', async () => {
            const year = document.getElementById('estMensualYear').value;
            const sede = document.getElementById('estMensualSede').value;
            
            try {
                Swal.fire({
                    title: 'Generando Excel',
                    text: 'Por favor espere...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                const response = await statsService.exportToExcel('mensual', {
                    year,
                    sede
                });
                
                Swal.close();
                
                if (response.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Excel Generado',
                        text: 'El archivo Excel se ha generado correctamente',
                        footer: `<a href="${response.file_url}" target="_blank" class="btn btn-success">Descargar Excel</a>`
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Error al generar Excel'
                    });
                }
            } catch (error) {
                console.error('Error al exportar a Excel:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error de conexión con el servidor'
                });
            }
        });
    }
    
    // Estadísticas semanales
    if (document.getElementById('estSemanalForm')) {
        document.getElementById('estSemanalForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fechaInicio = document.getElementById('estSemanalFechaInicio').value;
            const fechaFin = document.getElementById('estSemanalFechaFin').value;
            const sede = document.getElementById('estSemanalSede').value;
            
            try {
                Swal.fire({
                    title: 'Generando estadísticas',
                    text: 'Por favor espere...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                const response = await statsService.getWeeklyStats(fechaInicio, fechaFin, sede);
                
                Swal.close();
                
                if (response.status === 'success') {
                    statsService.renderWeeklyChart(response.data);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Error al obtener estadísticas'
                    });
                }
            } catch (error) {
                console.error('Error al generar estadísticas semanales:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error de conexión con el servidor'
                });
            }
        });
        
        // Exportar a Excel - Semanal
        document.getElementById('exportSemanalExcel').addEventListener('click', async () => {
            const fechaInicio = document.getElementById('estSemanalFechaInicio').value;
            const fechaFin = document.getElementById('estSemanalFechaFin').value;
            const sede = document.getElementById('estSemanalSede').value;
            
            try {
                Swal.fire({
                    title: 'Generando Excel',
                    text: 'Por favor espere...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                const response = await statsService.exportToExcel('semanal', {
                    fechaInicio,
                    fechaFin,
                    sede
                });
                
                Swal.close();
                
                if (response.status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'Excel Generado',
                        text: 'El archivo Excel se ha generado correctamente',
                        footer: `<a href="${response.file_url}" target="_blank" class="btn btn-success">Descargar Excel</a>`
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: response.message || 'Error al generar Excel'
                    });
                }
            } catch (error) {
                console.error('Error al exportar a Excel:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error de conexión con el servidor'
                });
            }
        });
    }
    
    // Event Listeners para la sección de cómputo
    const searchStudentComputeForm = document.getElementById('searchStudentComputeForm');
    if (searchStudentComputeForm) {
        searchStudentComputeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const studentCode = document.getElementById('studentCodeCompute').value.trim();
            if (studentCode) {
                await searchStudentForCompute(studentCode);
            }
        });
    }
    
    const entryComputeForm = document.getElementById('entryComputeForm');
    if (entryComputeForm) {
        entryComputeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await registerComputeEntry();
        });
    }
    
    const refreshActiveComputeBtn = document.getElementById('refreshActiveComputeBtn');
    if (refreshActiveComputeBtn) {
        refreshActiveComputeBtn.addEventListener('click', () => {
            loadActiveComputeEntries();
        });
    }
    
    // Iniciar verificación de autenticación
    checkAuth();
    
    // Event listener para el botón de búsqueda general (se añade dinámicamente)
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'generalSearchBtn') {
            performGeneralSearch();
        }
    });
    
    // Event listener para la tecla Enter en el campo de búsqueda general
    document.addEventListener('keyup', (e) => {
        if (e.target && e.target.id === 'generalSearchInput' && e.key === 'Enter') {
            performGeneralSearch();
        }
    });
}); 