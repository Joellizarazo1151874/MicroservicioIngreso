// Variable global para almacenar la sede asignada
let sedeAsignada = '';

// Variables para gestión de usuarios
let userToDelete = null;

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
    const navFuncionarios = document.getElementById('navFuncionarios');
    const navFuncionariosItem = document.getElementById('navFuncionariosItem');
    const navUsuarios = document.getElementById('navUsuarios');
    const navUsuariosItem = document.getElementById('navUsuariosItem');
    
    // Secciones
    const registrarEntradaSection = document.getElementById('registrarEntradaSection');
    const entradasActivasSection = document.getElementById('entradasActivasSection');
    const consultasSection = document.getElementById('consultasSection');
    const estadisticasSection = document.getElementById('estadisticasSection');
    const funcionariosSection = document.getElementById('funcionariosSection');
    const usuariosSection = document.getElementById('usuariosSection');
    
    // Formularios
    const searchStudentForm = document.getElementById('searchStudentForm');
    const studentInfo = document.getElementById('studentInfo');
    const entryForm = document.getElementById('entryForm');
    
    // Botones de acción
    const refreshActiveBtn = document.getElementById('refreshActiveBtn');
    const searchDateBtn = document.getElementById('searchDateBtn');
    const searchTermBtn = document.getElementById('searchTermBtn');
    
    // Elementos para gestión de usuarios
    const addUserBtn = document.getElementById('addUserBtn');
    const saveUserBtn = document.getElementById('saveUserBtn');
    const confirmDeleteUserBtn = document.getElementById('confirmDeleteUserBtn');
    
    // Modales
    const userModal = new bootstrap.Modal(document.getElementById('userModal'));
    const deleteUserModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
    
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
            configureUIByUser(user.usuario, user.nivel);
        }
    };
    
    // Configurar la interfaz según el usuario
    const configureUIByUser = (username, nivel) => {
        // Ocultar todas las secciones y opciones de navegación por defecto
        registrarEntradaSection.classList.add('d-none');
        entradasActivasSection.classList.add('d-none');
        consultasSection.classList.add('d-none');
        estadisticasSection.classList.add('d-none');
        funcionariosSection.classList.add('d-none');
        usuariosSection.classList.add('d-none');
        
        navRegistrarEntrada.parentElement.classList.add('d-none');
        navEntradasActivas.parentElement.classList.add('d-none');
        navConsultas.parentElement.classList.add('d-none');
        navEstadisticasItem.classList.add('d-none');
        navFuncionariosItem.classList.add('d-none');
        navUsuariosItem.classList.add('d-none');
        
        // Configurar según el nivel de usuario
        if (nivel === 'admin') {
            // Usuario administrador - ve todos los registros
            // Mostrar todas las opciones de navegación para el administrador
            navEntradasActivas.parentElement.classList.remove('d-none');
            navConsultas.parentElement.classList.remove('d-none');
            navEstadisticasItem.classList.remove('d-none');
            navFuncionariosItem.classList.remove('d-none');
            navUsuariosItem.classList.remove('d-none');
            
            // Activar la sección de usuarios por defecto
            navUsuarios.classList.add('active');
            usuariosSection.classList.remove('d-none');
            
            // Cargar la lista de usuarios
            loadUsers();
            
        } else if (nivel === 'entrada' || username === 'entradabecl' || username === 'entradabecle') {
            // Usuario de entrada
            navRegistrarEntrada.parentElement.classList.remove('d-none');
            navRegistrarEntrada.classList.add('active');
            registrarEntradaSection.classList.remove('d-none');
            
            // Ocultar el selector de sede y mostrar un texto informativo
            const sedeContainer = document.getElementById('sede').parentElement;
            const sedeLabel = sedeContainer.querySelector('label');
            
            // Guardar el valor de sede para usarlo en el formulario
            sedeAsignada = username === 'entradabecle' ? 'Enfermeria' : 'Principal';
            
            // Crear un elemento para mostrar la sede asignada
            const sedeInfo = document.createElement('div');
            sedeInfo.classList.add('alert', 'alert-info', 'mt-2');
            sedeInfo.innerHTML = `<strong>Sede asignada:</strong> ${username === 'entradabecle' ? 'Enfermería' : 'Principal'}`;
            
            // Reemplazar el selector con el texto informativo
            sedeContainer.innerHTML = '';
            sedeContainer.appendChild(sedeLabel);
            sedeContainer.appendChild(sedeInfo);
            
        } else if (nivel === 'administrativo') {
            // Usuario administrativo
            navConsultas.parentElement.classList.remove('d-none');
            navEstadisticasItem.classList.remove('d-none');
            
            // Activar la sección de consultas por defecto
            navConsultas.classList.add('active');
            consultasSection.classList.remove('d-none');
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
        if (funcionariosSection) funcionariosSection.classList.add('d-none');
        if (usuariosSection) usuariosSection.classList.add('d-none');
        
        // Desactivar todos los enlaces de navegación
        if (navRegistrarEntrada) navRegistrarEntrada.classList.remove('active');
        if (navEntradasActivas) navEntradasActivas.classList.remove('active');
        if (navConsultas) navConsultas.classList.remove('active');
        if (navEstadisticas) navEstadisticas.classList.remove('active');
        if (navFuncionarios) navFuncionarios.classList.remove('active');
        if (navUsuarios) navUsuarios.classList.remove('active');
        
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
        } else if (section === funcionariosSection && navFuncionarios) {
            navFuncionarios.classList.add('active');
            loadFuncionarios(); // Cargar funcionarios
        } else if (section === usuariosSection && navUsuarios) {
            navUsuarios.classList.add('active');
            loadUsers();
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
        const programa = document.getElementById('programaFecha').value;
        
        // Validar fechas
        if (!fechaInicio || !fechaFin) {
            Swal.fire({
                icon: 'warning',
                title: 'Fechas requeridas',
                text: 'Por favor ingrese fechas de inicio y fin'
            });
            return;
        }
        
        try {
            // Mostrar indicador de carga
            Swal.fire({
                title: 'Cargando datos',
                text: 'Por favor espere...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Obtener datos con el nuevo parámetro de programa
            const response = await entryService.getEntriesByDate(fechaInicio, fechaFin, sede, programa);
            
            // Cerrar el indicador de carga independientemente del resultado
            Swal.close();
            
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
            // Cerrar el indicador de carga en caso de error
            Swal.close();
            
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
            // Mostrar indicador de carga
            Swal.fire({
                title: 'Buscando',
                text: 'Por favor espere...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            const response = await entryService.searchEntry(term);
            
            // Cerrar el indicador de carga
            Swal.close();
            
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
            // Cerrar el indicador de carga en caso de error
            Swal.close();
            
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
            // Mostrar indicador de carga con SweetAlert
            Swal.fire({
                title: 'Buscando registros',
                text: 'Por favor espere...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Realizar búsqueda
            const response = await entryService.searchEntry(searchTerm);
            
            // Cerrar el indicador de carga
            Swal.close();
            
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
            // Cerrar el indicador de carga en caso de error
            Swal.close();
            
            console.error('Error en búsqueda general:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error de conexión con el servidor'
            });
        }
    };
    
    // Función para cargar funcionarios de la biblioteca
    const loadFuncionarios = async () => {
        try {
            // Mostrar indicador de carga
            Swal.fire({
                title: 'Cargando funcionarios...',
                text: 'Por favor espere',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Llamar al servicio para obtener todos los funcionarios
            const response = await funcionarioService.getAllFuncionarios();
            
            // Cerrar el indicador de carga
            Swal.close();
            
            if (response.status === 'success' && response.funcionarios && response.funcionarios.length > 0) {
                // Limpiar la tabla
                const tableBody = document.getElementById('funcionariosTableBody');
                tableBody.innerHTML = '';
                
                // Agregar cada funcionario a la tabla
                response.funcionarios.forEach(funcionario => {
                    const row = document.createElement('tr');
                    
                    // Crear las celdas con la información del funcionario
                    row.innerHTML = `
                        <td>${funcionario.cardnumber}</td>
                        <td>${funcionario.firstname}</td>
                        <td>${funcionario.surname}</td>
                        <td>${funcionario.email}</td>
                        <td>
                            <img src="../funcionario-service/fotos/${funcionario.foto}" 
                                 alt="Foto de ${funcionario.firstname}" 
                                 class="img-thumbnail" 
                                 style="max-width: 100px; max-height: 100px;">
                        </td>
                        <td>
                            <button class="btn btn-sm btn-primary edit-foto-btn" data-codigo="${funcionario.cardnumber}">
                                <i class="fas fa-camera"></i> Cambiar Foto
                            </button>
                        </td>
                    `;
                    
                    // Agregar la fila a la tabla
                    tableBody.appendChild(row);
                });
                
                // Agregar event listeners a los botones de edición de foto
                document.querySelectorAll('.edit-foto-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const codigo = e.currentTarget.getAttribute('data-codigo');
                        openFotoUploadModal(codigo);
                    });
                });
                
            } else {
                // Mostrar mensaje si no hay funcionarios
                Swal.fire({
                    icon: 'info',
                    title: 'Sin funcionarios',
                    text: 'No se encontraron funcionarios de la biblioteca en el sistema.'
                });
            }
        } catch (error) {
            // Cerrar el indicador de carga en caso de error
            Swal.close();
            
            console.error('Error al cargar funcionarios:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al cargar los funcionarios.'
            });
        }
    };
    
    // Función para abrir modal de carga de foto
    const openFotoUploadModal = (codigo) => {
        Swal.fire({
            title: 'Cambiar foto del funcionario',
            html: `
                <div class="mb-3">
                    <label for="fotoUrl" class="form-label">URL de la imagen:</label>
                    <input type="text" id="fotoUrl" class="form-control" placeholder="https://ejemplo.com/foto.jpg">
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545',
            preConfirm: () => {
                const fotoUrl = document.getElementById('fotoUrl').value;
                if (!fotoUrl) {
                    Swal.showValidationMessage('Por favor ingrese una URL válida');
                    return false;
                }
                return { fotoUrl };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Mostrar indicador de carga
                    Swal.fire({
                        title: 'Guardando...',
                        text: 'Por favor espere',
                        allowOutsideClick: false,
                        didOpen: () => {
                            Swal.showLoading();
                        }
                    });
                    
                    // Llamar al servicio para guardar la foto
                    const response = await funcionarioService.saveFuncionarioFoto(codigo, result.value.fotoUrl);
                    
                    // Cerrar el indicador de carga
                    Swal.close();
                    
                    if (response.status === 'success') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Éxito',
                            text: 'Foto actualizada correctamente'
                        }).then(() => {
                            // Recargar la lista de funcionarios
                            loadFuncionarios();
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: response.message || 'Ocurrió un error al guardar la foto'
                        });
                    }
                } catch (error) {
                    console.error('Error al guardar foto:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Ocurrió un error al guardar la foto'
                    });
                }
            }
        });
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
    
    // Event listener para la sección de funcionarios
    if (navFuncionarios) {
        navFuncionarios.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(funcionariosSection);
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
            let fechaInicio, fechaFin, sede, searchTerm, programa;
            
            // Determinar qué tab está activo
            const porFechaTab = document.getElementById('porFechaTab');
            const buscarTab = document.getElementById('buscarTab');
            
            if (porFechaTab.classList.contains('active')) {
                fechaInicio = document.getElementById('fechaInicio').value;
                fechaFin = document.getElementById('fechaFin').value;
                sede = document.getElementById('sedeFecha').value;
                programa = document.getElementById('programaFecha').value;
                
                if (!fechaInicio || !fechaFin) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Fechas requeridas',
                        text: 'Por favor ingrese fechas de inicio y fin para exportar'
                    });
                    return;
                }
            } else if (buscarTab.classList.contains('active')) {
                searchTerm = document.getElementById('searchTerm').value;
                
                if (!searchTerm) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Término de búsqueda requerido',
                        text: 'Por favor ingrese un término de búsqueda para exportar'
                    });
                    return;
                }
            }
            
            try {
                Swal.fire({
                    title: 'Generando Excel',
                    text: 'Por favor espere mientras se genera el archivo...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });
                
                const response = await statsService.exportToExcel('consultas', {
                    fechaInicio,
                    fechaFin,
                    sede,
                    searchTerm,
                    programa
                });
                
                // La función exportToExcel ya maneja la descarga y los mensajes
            } catch (error) {
                // Cerrar el indicador de carga en caso de error
                Swal.close();
                
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
            const programa = document.getElementById('estProgPrograma').value;
            
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
                
                const response = await statsService.getStatsByProgram(fechaInicio, fechaFin, sede, programa);
                
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
                // Cerrar el indicador de carga en caso de error
                Swal.close();
                
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
            const programa = document.getElementById('estProgPrograma').value;
            
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
                    sede,
                    programa
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
                // Cerrar el indicador de carga en caso de error
                Swal.close();
                
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
                // Cerrar el indicador de carga en caso de error
                Swal.close();
                
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
                // Cerrar el indicador de carga en caso de error
                Swal.close();
                
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
                // Cerrar el indicador de carga en caso de error
                Swal.close();
                
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
                // Cerrar el indicador de carga en caso de error
                Swal.close();
                
                console.error('Error al exportar a Excel:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error de conexión con el servidor'
                });
            }
        });
    }
    
    // Iniciar la aplicación
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
    
    // ===== GESTIÓN DE USUARIOS =====
    
    // Cargar todos los usuarios
    const loadUsers = async () => {
        const result = await userService.getAllUsers();
        
        if (result.success) {
            renderUsersTable(result.users);
        } else {
            alert('Error al cargar los usuarios: ' + result.message);
        }
    };
    
    // Renderizar la tabla de usuarios
    const renderUsersTable = (users) => {
        const table = document.getElementById('usersTable');
        table.innerHTML = '';
        
        if (users.length === 0) {
            table.innerHTML = '<tr><td colspan="4" class="text-center">No hay usuarios registrados</td></tr>';
            return;
        }
        
        // Mapear nivel a texto más descriptivo
        const nivelTexto = {
            'admin': 'Administrador',
            'entrada': 'Entrada',
            'administrativo': 'Administrativo'
        };
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.usuario}</td>
                <td>${nivelTexto[user.nivel] || user.nivel}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-user" data-id="${user.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-user" data-id="${user.id}" data-usuario="${user.usuario}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            table.appendChild(row);
        });
        
        // Agregar event listeners a los botones de acción
        document.querySelectorAll('.edit-user').forEach(btn => {
            btn.addEventListener('click', () => openEditUserModal(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-user').forEach(btn => {
            btn.addEventListener('click', () => openDeleteUserModal(btn.dataset.id, btn.dataset.usuario));
        });
    };
    
    // Abrir modal para crear un nuevo usuario
    const openAddUserModal = () => {
        document.getElementById('userModalLabel').textContent = 'Nuevo Usuario';
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = '';
        document.getElementById('passwordInput').required = true;
        document.getElementById('passwordHelpText').classList.add('d-none');
        userModal.show();
    };
    
    // Abrir modal para editar un usuario existente
    const openEditUserModal = async (userId) => {
        document.getElementById('userModalLabel').textContent = 'Editar Usuario';
        document.getElementById('userForm').reset();
        document.getElementById('userId').value = userId;
        document.getElementById('passwordInput').required = false;
        document.getElementById('passwordHelpText').classList.remove('d-none');
        
        // Buscar el usuario en la tabla para prellenar el formulario
        const table = document.getElementById('usersTable');
        const rows = table.querySelectorAll('tr');
        
        for (const row of rows) {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0 && cells[0].textContent === userId) {
                const usuario = cells[1].textContent;
                const nivel = cells[2].textContent;
                
                document.getElementById('usuarioInput').value = usuario;
                
                // Mapear el texto descriptivo al valor real
                const nivelMap = {
                    'Administrador': 'admin',
                    'Entrada': 'entrada',
                    'Administrativo': 'administrativo'
                };
                document.getElementById('nivelInput').value = nivelMap[nivel] || '';
                
                break;
            }
        }
        
        userModal.show();
    };
    
    // Guardar un usuario (crear o actualizar)
    const saveUser = async () => {
        // Validar el formulario
        const form = document.getElementById('userForm');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const userId = document.getElementById('userId').value;
        const userData = {
            usuario: document.getElementById('usuarioInput').value,
            password: document.getElementById('passwordInput').value,
            nivel: document.getElementById('nivelInput').value
        };
        
        let result;
        
        if (userId) {
            // Actualizar usuario existente
            result = await userService.updateUser(userId, userData);
        } else {
            // Crear nuevo usuario
            result = await userService.createUser(userData);
        }
        
        if (result.success) {
            // Cerrar modal y recargar usuarios
            userModal.hide();
            loadUsers();
        } else {
            alert('Error: ' + result.message);
        }
    };
    
    // Abrir modal de confirmación para eliminar un usuario
    const openDeleteUserModal = (userId, username) => {
        userToDelete = userId;
        document.getElementById('deleteUserName').textContent = username;
        deleteUserModal.show();
    };
    
    // Eliminar un usuario
    const deleteUser = async () => {
        if (!userToDelete) return;
        
        const result = await userService.deleteUser(userToDelete);
        
        if (result.success) {
            // Cerrar modal y recargar usuarios
            deleteUserModal.hide();
            loadUsers();
        } else {
            alert('Error: ' + result.message);
        }
        
        userToDelete = null;
    };
    
    // Event listeners para la gestión de usuarios
    if (addUserBtn) addUserBtn.addEventListener('click', openAddUserModal);
    if (saveUserBtn) saveUserBtn.addEventListener('click', saveUser);
    if (confirmDeleteUserBtn) confirmDeleteUserBtn.addEventListener('click', deleteUser);
    
    // Event listener para navegación de usuarios
    if (navUsuarios) {
        navUsuarios.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(usuariosSection);
            loadUsers();
        });
    }
    
    // Cargar años para el selector de estadísticas mensuales
    const loadYearsForStats = () => {
        const yearSelect = document.getElementById('estMensualYear');
        if (yearSelect) {
            const currentYear = new Date().getFullYear();
            for (let i = currentYear; i >= currentYear - 5; i--) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                yearSelect.appendChild(option);
            }
        }
    };
    
    // Función para cargar los programas académicos
    const loadProgramas = async () => {
        try {
            const response = await statsService.getAllPrograms();
            
            if (response.status === 'success' && response.programas) {
                // Selectores donde cargar los programas
                const selectors = [
                    document.getElementById('estProgPrograma'),
                    document.getElementById('programaFecha')
                ];
                
                // Llenar cada selector si existe
                selectors.forEach(selector => {
                    if (selector) {
                        // Conservar la opción "Todos"
                        const defaultOption = selector.querySelector('option');
                        selector.innerHTML = '';
                        selector.appendChild(defaultOption);
                        
                        // Agregar cada programa como opción
                        response.programas.forEach(programa => {
                            const option = document.createElement('option');
                            option.value = programa.carrera;
                            option.textContent = programa.carrera;
                            selector.appendChild(option);
                        });
                    }
                });
            } else {
                console.error('Error al cargar programas:', response.message);
            }
        } catch (error) {
            console.error('Error al obtener programas académicos:', error);
        }
    };
    
    // Llamar a las funciones de inicialización
    loadYearsForStats();
    loadProgramas();
}); 